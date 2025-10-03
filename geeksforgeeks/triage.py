import os
import sqlite3
import uuid
import yaml
import json
from datetime import datetime
from typing import List, Dict, Optional, Any
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import openai
from dotenv import load_dotenv

try:
    from .auth_backend import (
        router as auth_router,
        AuthUser,
        get_current_user,
    )
except ImportError:  # pragma: no cover - fallback for direct execution
    from auth_backend import (  # type: ignore
        router as auth_router,
        AuthUser,
        get_current_user,
    )

# Import admin backend
from admin_backend import admin_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Healthcare Triage Bot",
    description="An AI-powered healthcare triage system that evaluates symptoms and provides appropriate care recommendations",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],  # Specific origins for credentials mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication routesheufesah   
app.include_router(auth_router)

# Database setup
DB_FILE = os.getenv("TRIAGE_DB_FILE", "triage_sessions.db")


def init_db():
    """Initialize SQLite database for session logging"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS triage_sessions (
            id TEXT PRIMARY KEY,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            symptoms TEXT,
            severity TEXT,
            duration TEXT,
            additional_factors TEXT,
            triage_label TEXT,
            matched_rules TEXT,
            explanation TEXT,
            session_data TEXT,
            user_id TEXT
        )
    """)
    # Ensure user_id column exists for older databases
    cursor.execute("PRAGMA table_info(triage_sessions)")
    columns = {row[1] for row in cursor.fetchall()}
    if "user_id" not in columns:
        cursor.execute("ALTER TABLE triage_sessions ADD COLUMN user_id TEXT")
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Include admin router for medical dashboard
app.include_router(admin_router)

# Load rules from YAML
def load_rules():
    """Load triage rules from rules.yaml"""
    import os
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    rules_file = os.path.join(script_dir, "rules.yaml")
    
    try:
        with open(rules_file, "r") as file:
            return yaml.safe_load(file)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail=f"Rules file not found at {rules_file}")
    except yaml.YAMLError as e:
        raise HTTPException(status_code=500, detail=f"Error parsing rules file: {str(e)}")

# Pydantic models
class TriageRequest(BaseModel):
    symptoms: List[str] = Field(..., description="List of symptoms reported by the patient")
    severity: Optional[str] = Field(None, description="Severity level: mild, moderate, severe, critical")
    duration: Optional[str] = Field(None, description="Duration of symptoms")
    additional_factors: Optional[List[str]] = Field([], description="Additional factors or symptoms")
    temperature: Optional[str] = Field(None, description="Body temperature if fever is present")
    patient_age: Optional[int] = Field(None, description="Patient age for age-specific considerations")
    session_id: Optional[str] = Field(None, description="Optional session ID for tracking")

class TriageResponse(BaseModel):
    session_id: str
    triage_label: str
    urgency: str
    action: str
    timeframe: str
    matched_rules: List[Dict[str, Any]]
    explanation: str
    confidence_score: float
    timestamp: datetime

class DemoPayload(BaseModel):
    id: str
    name: str
    description: str
    payload: TriageRequest

# Rule evaluation engine
class TriageEvaluator:
    def __init__(self):
        self.rules_data = load_rules()
        self.rules = self.rules_data.get("rules", [])
        self.triage_labels = self.rules_data.get("triage_labels", {})
    
    def normalize_text(self, text: str) -> str:
        """Normalize text for comparison"""
        return text.lower().strip()
    
    def match_symptoms(self, user_symptoms: List[str], rule_symptoms: List[str]) -> bool:
        """Check if user symptoms match rule symptoms"""
        user_symptoms_norm = [self.normalize_text(s) for s in user_symptoms]
        
        for rule_symptom in rule_symptoms:
            rule_symptom_norm = self.normalize_text(rule_symptom)
            # Check for exact match or partial match
            if any(rule_symptom_norm in user_symptom or user_symptom in rule_symptom_norm 
                   for user_symptom in user_symptoms_norm):
                return True
        return False
    
    def match_severity(self, user_severity: Optional[str], rule_severity: List[str]) -> bool:
        """Check if user severity matches rule severity requirements"""
        if not user_severity:
            return "any" in rule_severity or len(rule_severity) == 0
        
        user_severity_norm = self.normalize_text(user_severity)
        return user_severity_norm in [self.normalize_text(s) for s in rule_severity] or "any" in rule_severity
    
    def match_additional_factors(self, user_factors: List[str], rule_factors: List[str]) -> bool:
        """Check if additional factors match"""
        if not rule_factors:
            return True
        
        user_factors_norm = [self.normalize_text(f) for f in user_factors]
        
        for rule_factor in rule_factors:
            rule_factor_norm = self.normalize_text(rule_factor)
            if any(rule_factor_norm in user_factor or user_factor in rule_factor_norm 
                   for user_factor in user_factors_norm):
                return True
        return False
    
    def match_temperature(self, user_temp: Optional[str], rule_temp: List[str]) -> bool:
        """Check if temperature matches rule requirements"""
        if not user_temp or not rule_temp:
            return True
        
        # Simple temperature matching - could be enhanced with actual parsing
        user_temp_norm = self.normalize_text(user_temp)
        return any(self.normalize_text(temp) in user_temp_norm for temp in rule_temp)
    
    def evaluate_rule(self, request: TriageRequest, rule: Dict) -> tuple[bool, float]:
        """Evaluate if a single rule matches the request"""
        conditions = rule.get("conditions", [])
        
        for condition in conditions:
            symptoms_match = self.match_symptoms(request.symptoms, condition.get("symptoms", []))
            severity_match = self.match_severity(request.severity, condition.get("severity", []))
            factors_match = self.match_additional_factors(
                request.additional_factors or [], 
                condition.get("additional_factors", [])
            )
            temp_match = self.match_temperature(
                request.temperature, 
                condition.get("temperature", [])
            )
            
            if symptoms_match and severity_match and factors_match and temp_match:
                # Calculate confidence score based on how many criteria matched
                confidence = 0.7  # Base confidence
                if request.severity: confidence += 0.1
                if request.additional_factors: confidence += 0.1
                if request.temperature: confidence += 0.1
                
                return True, min(confidence, 1.0)
        
        return False, 0.0
    
    def evaluate_triage(self, request: TriageRequest, user: Optional[AuthUser] = None) -> TriageResponse:
        """Evaluate triage request against all rules in priority order"""
        matched_rules = []
        
        # Sort rules by priority
        sorted_rules = sorted(self.rules, key=lambda x: x.get("priority", 999))
        
        for rule in sorted_rules:
            matches, confidence = self.evaluate_rule(request, rule)
            if matches:
                matched_rules.append({
                    "id": rule["id"],
                    "name": rule["name"],
                    "category": rule["category"],
                    "confidence": confidence
                })
        
        if not matched_rules:
            # Default to self-care if no rules match
            triage_label = "SELF_CARE_MONITOR"
            explanation = "Based on the symptoms provided, self-care with monitoring is recommended. If symptoms worsen or persist, please seek medical attention."
            confidence_score = 0.3
        else:
            # Use the highest priority (first) matched rule
            best_rule = next((r for r in sorted_rules if r["id"] == matched_rules[0]["id"]), None)
            triage_label = best_rule["triage_label"]
            explanation = self.generate_explanation(best_rule, request)
            confidence_score = matched_rules[0]["confidence"]
        
        # Get triage label details
        label_info = self.triage_labels.get(triage_label, {
            "urgency": "unknown",
            "action": "Consult healthcare provider",
            "timeframe": "as needed"
        })
        
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())
        
        # Log to database
        self.log_session(session_id, request, triage_label, matched_rules, explanation, user)
        
        return TriageResponse(
            session_id=session_id,
            triage_label=triage_label,
            urgency=label_info["urgency"],
            action=label_info["action"],
            timeframe=label_info["timeframe"],
            matched_rules=matched_rules,
            explanation=explanation,
            confidence_score=confidence_score,
            timestamp=datetime.now()
        )
    
    def generate_explanation(self, rule: Dict, request: TriageRequest) -> str:
        """Generate explanation using OpenAI or template fallback"""
        # Try OpenAI first if API key is available
        if os.getenv("OPENAI_API_KEY"):
            try:
                return self.generate_openai_explanation(rule, request)
            except Exception as e:
                print(f"OpenAI API error: {e}")
                # Fall back to template
        
        # Use template explanation
        template = rule.get("explanation_template", "Please consult with a healthcare provider about your symptoms.")
        
        # Simple template variable replacement
        explanation = template
        if request.symptoms:
            explanation += f" Your reported symptoms include: {', '.join(request.symptoms)}."
        
        return explanation
    
    def generate_openai_explanation(self, rule: Dict, request: TriageRequest) -> str:
        """Generate explanation using OpenAI API"""
        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        prompt = f"""
        As a healthcare triage assistant, provide a clear, empathetic explanation for the following triage recommendation:

        Rule: {rule['name']}
        Category: {rule['category']}
        Triage Label: {rule['triage_label']}
        
        Patient Symptoms: {', '.join(request.symptoms)}
        Severity: {request.severity or 'Not specified'}
        Duration: {request.duration or 'Not specified'}
        Additional Factors: {', '.join(request.additional_factors or [])}
        
        Provide a 2-3 sentence explanation that:
        1. Acknowledges the patient's symptoms
        2. Explains why this triage level is recommended
        3. Provides clear next steps
        
        Keep the tone professional, empathetic, and reassuring while being appropriately urgent when necessary.
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0.3
        )
        
        return response.choices[0].message.content.strip()
    
    def log_session(self, session_id: str, request: TriageRequest, triage_label: str, 
                   matched_rules: List[Dict], explanation: str, user: Optional[AuthUser] = None):
        """Log triage session to SQLite database"""
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        session_data = json.dumps({
            "request": request.dict(),
            "recorded_at": datetime.now().isoformat(),
            "user_id": user.id if user else None,
        })
        
        cursor.execute("""
            INSERT OR REPLACE INTO triage_sessions 
            (id, symptoms, severity, duration, additional_factors, triage_label, 
             matched_rules, explanation, session_data, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            session_id,
            ", ".join(request.symptoms),
            request.severity or "",
            request.duration or "",
            ", ".join(request.additional_factors or []),
            triage_label,
            str(matched_rules),
            explanation,
            session_data,
            user.id if user else None,
        ))
        
        conn.commit()
        conn.close()

# Initialize evaluator
evaluator = TriageEvaluator()

# API Endpoints
@app.post("/api/triage", response_model=TriageResponse)
async def triage_endpoint(request: TriageRequest, user: AuthUser = Depends(get_current_user)):
    """
    Main triage endpoint that evaluates symptoms and returns triage recommendation
    """
    try:
        return evaluator.evaluate_triage(request, user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Triage evaluation error: {str(e)}")

@app.get("/api/demo/{demo_id}", response_model=DemoPayload)
async def get_demo_payload(demo_id: str):
    """
    Get demo request payload for frontend testing
    """
    demo_payloads = {
        "emergency": DemoPayload(
            id="emergency",
            name="Cardiac Emergency",
            description="Severe chest pain with shortness of breath - should trigger RED/EMERGENCY_911",
            payload=TriageRequest(
                symptoms=["chest pain", "shortness of breath", "dizziness"],
                severity="severe",
                duration="sudden onset",
                additional_factors=["sweating", "nausea"]
            )
        ),
        "urgent": DemoPayload(
            id="urgent", 
            name="High Fever with Concerning Symptoms",
            description="High fever with difficulty breathing - should trigger URGENT_CARE",
            payload=TriageRequest(
                symptoms=["fever", "difficulty breathing", "headache"],
                severity="high",
                duration="2 days",
                temperature="104°F",
                additional_factors=["confusion"]
            )
        ),
        "gp": DemoPayload(
            id="gp",
            name="Persistent Cough",
            description="Cough lasting over 2 weeks - should trigger SEE_DOCTOR_24H",
            payload=TriageRequest(
                symptoms=["persistent cough", "fatigue"],
                severity="moderate",
                duration="3 weeks",
                additional_factors=["weight loss"]
            )
        ),
        "self_care": DemoPayload(
            id="self_care",
            name="Mild Cold Symptoms", 
            description="Basic cold symptoms - should trigger SELF_CARE_MONITOR",
            payload=TriageRequest(
                symptoms=["runny nose", "sneezing", "mild cough"],
                severity="mild",
                duration="2 days"
            )
        )
    }
    
    if demo_id not in demo_payloads:
        raise HTTPException(status_code=404, detail="Demo payload not found")
    
    return demo_payloads[demo_id]

@app.get("/api/demo")
async def list_demo_payloads():
    """
    List all available demo payloads
    """
    return {
        "demo_ids": ["emergency", "urgent", "gp", "self_care"],
        "description": "Use /api/demo/{id} to get specific demo payloads for testing"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "version": "1.0.0"
    }

@app.get("/api/rules")
async def get_rules():
    """Get current triage rules (for debugging/admin)"""
    return evaluator.rules_data


@app.get("/api/me", response_model=AuthUser)
async def get_current_user_profile(user: AuthUser = Depends(get_current_user)):
    """Return profile of the authenticated user"""
    return user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
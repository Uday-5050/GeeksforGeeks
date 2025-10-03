import pytest
import json
from fastapi.testclient import TestClient
from triage import app, TriageRequest, evaluator

client = TestClient(app)

class TestTriageAPI:
    """Test suite for the triage API endpoints"""
    
    def test_health_check(self):
        """Test the health check endpoint"""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "version" in data
    
    def test_demo_list(self):
        """Test listing available demo payloads"""
        response = client.get("/api/demo")
        assert response.status_code == 200
        data = response.json()
        assert "demo_ids" in data
        assert len(data["demo_ids"]) > 0
    
    def test_get_demo_payload(self):
        """Test getting a specific demo payload"""
        response = client.get("/api/demo/emergency")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "emergency"
        assert "payload" in data
        assert "symptoms" in data["payload"]
    
    def test_get_invalid_demo_payload(self):
        """Test getting a non-existent demo payload"""
        response = client.get("/api/demo/invalid_id")
        assert response.status_code == 404
    
    def test_emergency_triage(self):
        """Test emergency scenario - should return EMERGENCY_911"""
        payload = {
            "symptoms": ["chest pain", "shortness of breath", "dizziness"],
            "severity": "severe",
            "duration": "sudden onset",
            "additional_factors": ["sweating", "nausea"]
        }
        response = client.post("/api/triage", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["triage_label"] == "EMERGENCY_911"
        assert data["urgency"] == "immediate"
        assert len(data["matched_rules"]) > 0
        assert "session_id" in data
    
    def test_urgent_care_triage(self):
        """Test urgent care scenario - should return URGENT_CARE"""
        payload = {
            "symptoms": ["fever", "difficulty breathing", "headache"],
            "severity": "high", 
            "duration": "2 days",
            "temperature": "104°F",
            "additional_factors": ["confusion"]
        }
        response = client.post("/api/triage", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["triage_label"] == "URGENT_CARE"
        assert data["urgency"] == "urgent"
    
    def test_gp_care_triage(self):
        """Test GP care scenario - should return SEE_DOCTOR_24H"""
        payload = {
            "symptoms": ["persistent cough", "fatigue"],
            "severity": "moderate",
            "duration": "3 weeks",
            "additional_factors": ["weight loss"]
        }
        response = client.post("/api/triage", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["triage_label"] == "SEE_DOCTOR_24H"
        assert data["urgency"] == "moderate"
    
    def test_self_care_triage(self):
        """Test self-care scenario - should return SELF_CARE_MONITOR"""
        payload = {
            "symptoms": ["runny nose", "sneezing", "mild cough"],
            "severity": "mild",
            "duration": "2 days"
        }
        response = client.post("/api/triage", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["triage_label"] == "SELF_CARE_MONITOR"
        assert data["urgency"] == "low"
    
    def test_no_matching_symptoms_defaults_to_self_care(self):
        """Test that unknown symptoms default to self-care"""
        payload = {
            "symptoms": ["very unusual symptom that doesnt match any rules"],
            "severity": "unknown"
        }
        response = client.post("/api/triage", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["triage_label"] == "SELF_CARE_MONITOR"
    
    def test_session_id_handling(self):
        """Test session ID generation and tracking"""
        payload = {
            "symptoms": ["headache"],
            "severity": "mild",
            "session_id": "test-session-123"
        }
        response = client.post("/api/triage", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["session_id"] == "test-session-123"
    
    def test_missing_required_fields(self):
        """Test handling of missing required fields"""
        payload = {}  # Missing symptoms
        response = client.post("/api/triage", json=payload)
        assert response.status_code == 422  # Validation error
    
    def test_confidence_scoring(self):
        """Test that confidence scores are calculated"""
        payload = {
            "symptoms": ["chest pain"],
            "severity": "severe",
            "duration": "sudden onset",
            "additional_factors": ["sweating"]
        }
        response = client.post("/api/triage", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "confidence_score" in data
        assert 0 <= data["confidence_score"] <= 1

class TestTriageEvaluator:
    """Test suite for the triage evaluation logic"""
    
    def test_normalize_text(self):
        """Test text normalization"""
        assert evaluator.normalize_text("  CHEST PAIN  ") == "chest pain"
        assert evaluator.normalize_text("Heart Attack") == "heart attack"
    
    def test_match_symptoms_exact(self):
        """Test exact symptom matching"""
        user_symptoms = ["chest pain", "shortness of breath"]
        rule_symptoms = ["chest pain"]
        assert evaluator.match_symptoms(user_symptoms, rule_symptoms) == True
    
    def test_match_symptoms_partial(self):
        """Test partial symptom matching"""
        user_symptoms = ["severe chest pain"]
        rule_symptoms = ["chest pain"]
        assert evaluator.match_symptoms(user_symptoms, rule_symptoms) == True
    
    def test_match_symptoms_no_match(self):
        """Test non-matching symptoms"""
        user_symptoms = ["headache"]
        rule_symptoms = ["chest pain"]
        assert evaluator.match_symptoms(user_symptoms, rule_symptoms) == False
    
    def test_match_severity_any(self):
        """Test severity matching with 'any' requirement"""
        assert evaluator.match_severity("mild", ["any"]) == True
        assert evaluator.match_severity(None, ["any"]) == True
    
    def test_match_severity_specific(self):
        """Test specific severity matching"""
        assert evaluator.match_severity("severe", ["severe", "critical"]) == True
        assert evaluator.match_severity("mild", ["severe", "critical"]) == False
    
    def test_priority_ordering(self):
        """Test that rules are evaluated in priority order"""
        # Create a request that could match multiple rules
        request = TriageRequest(
            symptoms=["chest pain", "fever"],
            severity="severe",
            additional_factors=["difficulty breathing"]
        )
        
        response = evaluator.evaluate_triage(request)
        # Should match the highest priority rule (RED category)
        assert response.triage_label == "EMERGENCY_911"
    
    def test_rule_evaluation_with_all_criteria(self):
        """Test rule evaluation with all matching criteria"""
        request = TriageRequest(
            symptoms=["chest pain"],
            severity="severe",
            duration="sudden onset",
            additional_factors=["sweating", "dizziness"],
            temperature="normal"
        )
        
        # Find a RED rule that should match
        red_rule = next((r for r in evaluator.rules if r["category"] == "RED"), None)
        assert red_rule is not None
        
        matches, confidence = evaluator.evaluate_rule(request, red_rule)
        assert matches == True
        assert confidence > 0.7

class TestDemoScenarios:
    """Test all demo scenarios to ensure they work as expected"""
    
    @pytest.fixture
    def demo_payloads(self):
        """Load demo payloads from JSON file"""
        with open("demo_payloads.json", "r") as f:
            return json.load(f)["demo_payloads"]
    
    def test_all_demo_scenarios(self, demo_payloads):
        """Test all demo scenarios return expected triage labels"""
        for demo_id, demo_data in demo_payloads.items():
            payload = demo_data["payload"]
            expected_label = demo_data["expected_triage_label"]
            
            response = client.post("/api/triage", json=payload)
            assert response.status_code == 200, f"Demo {demo_id} failed with status {response.status_code}"
            
            data = response.json()
            assert data["triage_label"] == expected_label, \
                f"Demo {demo_id}: expected {expected_label}, got {data['triage_label']}"
    
    def test_emergency_scenarios(self, demo_payloads):
        """Test all emergency scenarios trigger EMERGENCY_911"""
        emergency_demos = {k: v for k, v in demo_payloads.items() 
                          if v["expected_triage_label"] == "EMERGENCY_911"}
        
        assert len(emergency_demos) >= 2, "Should have at least 2 emergency demo scenarios"
        
        for demo_id, demo_data in emergency_demos.items():
            response = client.post("/api/triage", json=demo_data["payload"])
            data = response.json()
            
            assert data["triage_label"] == "EMERGENCY_911"
            assert data["urgency"] == "immediate"
            assert "Call 911" in data["action"]
    
    def test_response_structure(self):
        """Test that all responses have the required structure"""
        payload = {
            "symptoms": ["headache"],
            "severity": "mild"
        }
        
        response = client.post("/api/triage", json=payload)
        data = response.json()
        
        required_fields = [
            "session_id", "triage_label", "urgency", "action", 
            "timeframe", "matched_rules", "explanation", 
            "confidence_score", "timestamp"
        ]
        
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
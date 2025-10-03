# 🏥 AI-Powered Healthcare Triage Bot

An intelligent healthcare triage system that evaluates patient symptoms and provides appropriate care recommendations using rule-based evaluation and optional AI-enhanced explanations.

## 🚀 Features

- **Smart Triage Classification**: Evaluates symptoms in priority order (RED → URGENT → GP → SELF_CARE)
- **RESTful API**: FastAPI-based backend with automatic OpenAPI documentation
- **Rule-Based Engine**: Configurable YAML rules for healthcare triage decisions
- **AI-Enhanced Explanations**: Optional OpenAI integration for personalized explanations
- **Session Tracking**: SQLite database for logging triage sessions
- **Demo Scenarios**: Pre-built test cases for frontend development
- **Comprehensive Testing**: Full pytest test suite included

## 📋 API Endpoints

### Core Endpoints
- `POST /api/triage` - Main triage evaluation endpoint
- `GET /api/demo/{id}` - Get demo request payloads
- `GET /api/demo` - List all available demo scenarios
- `GET /api/health` - Health check endpoint
- `GET /docs` - Interactive API documentation (Swagger UI)

### Triage Categories

| Priority | Category | Label | Description |
|----------|----------|--------|-------------|
| 1 | **RED** | `EMERGENCY_911` | Life-threatening emergencies - call 911 immediately |
| 2 | **URGENT** | `URGENT_CARE` | Serious conditions - seek care within 2-4 hours |
| 3 | **GP** | `SEE_DOCTOR_24H` | General practitioner care - within 24-48 hours |
| 4 | **SELF_CARE** | `SELF_CARE_MONITOR` | Self-care with monitoring |

## 🛠️ Quick Start

### Option 1: Using the Run Script (Recommended)

**Windows:**
```cmd
run.bat
```

**Linux/Mac:**
```bash
chmod +x run.sh
./run.sh
```

### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set Environment Variables** (Optional)
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env file with your OpenAI API key (optional)
   # OPENAI_API_KEY=your_api_key_here
   ```

3. **Start the Server**
   ```bash
   uvicorn triage:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Access the Application**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/api/health

## 📝 Usage Examples

### Basic Triage Request

```bash
curl -X POST "http://localhost:8000/api/triage" \
-H "Content-Type: application/json" \
-d '{
  "symptoms": ["chest pain", "shortness of breath"],
  "severity": "severe",
  "duration": "sudden onset",
  "additional_factors": ["sweating", "dizziness"]
}'
```

### Response Example

```json
{
  "session_id": "123e4567-e89b-12d3-a456-426614174000",
  "triage_label": "EMERGENCY_911",
  "urgency": "immediate",
  "action": "Call 911 immediately",
  "timeframe": "now",
  "matched_rules": [
    {
      "id": "RED_001",
      "name": "Cardiac Emergency", 
      "category": "RED",
      "confidence": 0.9
    }
  ],
  "explanation": "Severe cardiac symptoms require immediate emergency care. Call 911 now.",
  "confidence_score": 0.9,
  "timestamp": "2024-01-01T12:00:00"
}
```

### Demo Scenarios

Get predefined demo payloads for testing:

```bash
# List available demos
curl http://localhost:8000/api/demo

# Get specific demo
curl http://localhost:8000/api/demo/emergency
```

Available demo scenarios:
- `emergency` - Cardiac emergency (RED)
- `urgent` - High fever with complications (URGENT)
- `gp` - Persistent cough (GP)
- `self_care` - Mild cold symptoms (SELF_CARE)

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Install test dependencies (included in requirements.txt)
pip install pytest httpx

# Run all tests
pytest tests/ -v

# Run specific test categories
pytest tests/test_triage.py::TestDemoScenarios -v
pytest tests/test_triage.py::TestTriageAPI -v
```

### Test Coverage

The test suite covers:
- All API endpoints and status codes
- Demo scenario validation 
- Rule evaluation logic
- Priority ordering
- Edge cases and error handling
- Response structure validation

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the image
docker build -t healthcare-triage .

# Run the container
docker run -p 8000:8000 -e OPENAI_API_KEY=your_key healthcare-triage
```

### Docker Compose (Optional)

```yaml
version: '3.8'
services:
  triage-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./data:/app/data
```

## ☁️ Cloud Deployment

### Deploy to Render

1. Connect your GitHub repository to [Render](https://render.com)
2. Create a new Web Service
3. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn triage:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**: Add `OPENAI_API_KEY` if desired

### Deploy to Railway

1. Connect to [Railway](https://railway.app)
2. Deploy from GitHub repository
3. Railway auto-detects Python and runs the application
4. Add environment variables in the dashboard

### Deploy to Heroku

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Create Procfile:
   ```
   web: uvicorn triage:app --host 0.0.0.0 --port $PORT
   ```
3. Deploy:
   ```bash
   heroku create your-app-name
   heroku config:set OPENAI_API_KEY=your_key
   git push heroku main
   ```

## 📊 Configuration

### Rules Configuration

Modify `rules.yaml` to customize triage rules:

```yaml
rules:
  - id: "CUSTOM_001"
    priority: 1
    category: "RED"
    triage_label: "EMERGENCY_911"
    name: "Custom Emergency Rule"
    conditions:
      - symptoms: ["custom symptom"]
        severity: ["severe"]
    explanation_template: "Custom explanation text"
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI explanations | None (uses templates) |
| `PORT` | Server port | 8000 |
| `HOST` | Server host | 0.0.0.0 |
| `LOG_LEVEL` | Logging level | INFO |
| `CORS_ORIGINS` | CORS allowed origins | * |

## 🔧 API Reference

### POST /api/triage

**Request Body:**
```json
{
  "symptoms": ["string"],           // Required: List of symptoms
  "severity": "string",            // Optional: mild, moderate, severe, critical
  "duration": "string",           // Optional: Duration description
  "additional_factors": ["string"], // Optional: Additional symptoms/factors
  "temperature": "string",        // Optional: Temperature if fever present
  "patient_age": 0,              // Optional: Patient age
  "session_id": "string"         // Optional: Session tracking ID
}
```

**Response:**
```json
{
  "session_id": "string",
  "triage_label": "string",
  "urgency": "string", 
  "action": "string",
  "timeframe": "string",
  "matched_rules": [{"id": "string", "name": "string", "category": "string", "confidence": 0.0}],
  "explanation": "string",
  "confidence_score": 0.0,
  "timestamp": "2024-01-01T00:00:00"
}
```

## 📁 Project Structure

```
healthcare-triage/
├── triage.py                 # Main FastAPI application
├── rules.yaml              # Triage rules configuration
├── requirements.txt        # Python dependencies
├── demo_payloads.json     # Demo scenarios for testing
├── Dockerfile             # Docker container configuration
├── run.sh                 # Quick start script (Linux/Mac)
├── run.bat               # Quick start script (Windows)
├── .env.example          # Environment variables template
├── README.md             # This file
└── tests/
    ├── __init__.py
    └── test_triage.py    # Comprehensive test suite
```

## 🚨 Important Notes

### Medical Disclaimer

**This is a demonstration/educational system and should NOT be used for actual medical decision-making. Always consult qualified healthcare professionals for medical advice.**

### Security Considerations

- Configure CORS origins appropriately for production
- Use HTTPS in production environments
- Implement proper authentication if handling real patient data
- Follow HIPAA compliance requirements if applicable
- Regular security updates and dependency scanning

### Performance Considerations

- SQLite database included for simplicity - consider PostgreSQL for production
- Implement rate limiting for production use
- Add monitoring and logging for production deployments
- Consider caching for frequently accessed rules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass: `pytest tests/ -v`
5. Submit a pull request

## 📄 License

This project is provided for educational and demonstration purposes. Please ensure compliance with healthcare regulations and obtain proper medical oversight before any production use.

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port 8000
lsof -ti:8000
# Kill the process
kill -9 <PID>
```

**Module not found errors:**
```bash
# Ensure you're in the virtual environment
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate.bat  # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**OpenAI API errors:**
- Verify API key is correctly set
- Check API key permissions and billing
- System gracefully falls back to template explanations

### Getting Help

- Check the interactive API docs at `/docs` when server is running
- Review test cases in `tests/test_triage.py` for usage examples  
- Validate your rules YAML syntax using online YAML validators

---

🏥 **Healthcare Triage Bot** - Making medical triage more accessible and intelligent!
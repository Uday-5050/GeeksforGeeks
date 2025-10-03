# Quick Reference: Frontend-Backend Integration

## 🚀 Start Both Servers

### Terminal 1 - Backend
```powershell
cd C:\Users\udayj\GeeksforGeeks
python -m uvicorn geeksforgeeks.triage:app --reload --port 8000
```

### Terminal 2 - Frontend  
```powershell
cd C:\Users\udayj\GeeksforGeeks\triage-frontend
npm run dev
```

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main web application |
| Backend API | http://localhost:8000 | REST API endpoints |
| API Docs | http://localhost:8000/docs | Swagger UI documentation |
| ReDoc | http://localhost:8000/redoc | Alternative API docs |

## 📡 API Endpoints

### POST /api/triage
**Request:**
```json
{
  "symptoms": ["chest pain", "shortness of breath"],
  "severity": "severe",
  "patient_age": 55,
  "duration": null,
  "additional_factors": []
}
```

**Response:**
```json
{
  "session_id": "uuid",
  "triage_label": "EMERGENCY_911",
  "urgency": "immediate",
  "action": "Call 911 immediately",
  "timeframe": "now",
  "explanation": "Severe cardiac symptoms...",
  "confidence_score": 0.8,
  "matched_rules": [...]
}
```

### GET /api/health
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-03T...",
  "version": "1.0.0"
}
```

### GET /api/demo/{scenario_id}
**Available Scenarios:**
- `emergency` - Cardiac emergency
- `stroke` - Stroke symptoms
- `urgent` - High fever with breathing difficulty
- `urgent_chest_pain` - Moderate chest pain
- `gp` - Persistent symptoms needing GP
- `gp_fever` - Fever requiring medical advice
- `self_care` - Common cold
- `self_care_cold` - Minor cold symptoms
- `self_care_mild` - Mild headache

## 🔧 Frontend API Usage

### Import the API service
```javascript
import { callTriageAPI, buildTriagePayload } from '../services/api';
```

### Use in component
```javascript
const handleSubmit = async (formData) => {
  setLoading(true);
  setError(null);
  
  try {
    // Transform frontend form to backend format
    const payload = buildTriagePayload(formData);
    
    // Call backend API
    const response = await callTriageAPI(payload);
    
    // Response is already transformed for frontend
    setResult(response);
  } catch (err) {
    setError('Failed to get triage assessment');
  } finally {
    setLoading(false);
  }
};
```

## 🧪 Testing Commands

### Test Backend Health
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/health" -UseBasicParsing
```

### Test Triage Endpoint
```powershell
$body = @{
    symptoms = @("chest pain", "fever")
    severity = "severe"
    patient_age = 45
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/triage" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing
```

### Run Integration Test Suite
```powershell
cd C:\Users\udayj\GeeksforGeeks
.\test-integration.ps1
```

## 🔄 Data Transformation

### Symptom Mapping (Frontend → Backend)
```javascript
const symptomMap = {
  'fever': 'fever',
  'chest_pain': 'chest pain',
  'breathlessness': 'shortness of breath',
  'vomiting': 'vomiting',
  'drowsy': 'confusion',
  'runny_nose': 'runny nose'
};
```

### Triage Level Mapping (Backend → Frontend)
```javascript
const triageLevelMap = {
  'EMERGENCY_911': 'EMERGENCY',
  'URGENT_CARE': 'URGENT',
  'SEE_DOCTOR_24H': 'ROUTINE',
  'SELF_CARE_MONITOR': 'SELF_CARE'
};
```

## 🎯 User Flow

1. **User visits** → http://localhost:3000
2. **Login page** → Enter email & password
3. **Route based on role:**
   - Admin (`admin@...`) → `/dashboard`
   - User (others) → `/home`
4. **Fill symptom form** → Select symptoms, severity, age
5. **Submit** → Frontend calls `/api/triage`
6. **Backend evaluates** → Rules.yaml processing
7. **Response returned** → Transformed data
8. **Display results** → Triage level, actions, explanation

## 📦 Key Files

| File | Purpose |
|------|---------|
| `triage-frontend/src/services/api.js` | API integration layer |
| `triage-frontend/src/pages/Home.jsx` | Symptom form & results |
| `triage-frontend/src/App.jsx` | Routing configuration |
| `geeksforgeeks/triage.py` | Backend API endpoints |
| `geeksforgeeks/rules.yaml` | Triage rules (12 rules) |
| `test-integration.ps1` | Automated testing |

## 🛑 Troubleshooting

### Backend not responding
```powershell
# Check if running
netstat -ano | findstr ":8000"

# Restart backend
cd C:\Users\udayj\GeeksforGeeks
python -m uvicorn geeksforgeeks.triage:app --reload --port 8000
```

### Frontend not loading
```powershell
# Check if running
netstat -ano | findstr ":3000"

# Stop all node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Restart frontend
cd C:\Users\udayj\GeeksforGeeks\triage-frontend
npm run dev
```

### CORS errors
- Backend already has CORS enabled with `allow_origins=["*"]`
- For production, update to specific frontend URL

### Integration test failing
```powershell
# Ensure both servers are running
# Check ports 8000 and 3000 are not blocked
# Run test from correct directory:
cd C:\Users\udayj\GeeksforGeeks
.\test-integration.ps1
```

## ✅ Success Indicators

- ✅ Backend returns 200 on `/api/health`
- ✅ Frontend loads login page at http://localhost:3000
- ✅ Can submit symptom form and get results
- ✅ No CORS errors in browser console
- ✅ Session data logged to `triage_sessions.db`
- ✅ Integration test script passes

## 🎓 Learning Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

---

**Need Help?**
- Check `README_INTEGRATION.md` for detailed documentation
- View `INTEGRATION_STATUS.md` for current status
- Run `.\test-integration.ps1` to verify setup

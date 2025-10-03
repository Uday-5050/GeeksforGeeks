# 🔗 Frontend-Backend Integration Guide

## ✅ Integration Complete!

Your healthcare triage frontend and backend are now fully integrated and ready to work together.

## 🏗️ Architecture Overview

```
┌─────────────────────┐         HTTP/JSON        ┌─────────────────────┐
│                     │    ───────────────────>   │                     │
│  React Frontend     │                           │  FastAPI Backend    │
│  (Port 3000)        │    <───────────────────   │  (Port 8000)        │
│                     │         Responses         │                     │
└─────────────────────┘                           └─────────────────────┘
        │                                                   │
        │                                                   │
    Vite Build                                       SQLite + Rules
    System                                           Database   YAML
```

## 🔄 Data Flow

### 1. Frontend Request Format
```javascript
{
  symptoms_text: "I have chest pain and shortness of breath",
  symptoms_list: ["chest_pain", "breathlessness"],
  age: 45,
  is_child: false,
  severity: "severe"
}
```

### 2. Transformed to Backend Format
```json
{
  "symptoms": ["chest pain", "shortness of breath"],
  "severity": "severe",
  "patient_age": 45,
  "duration": null,
  "additional_factors": []
}
```

### 3. Backend Response
```json
{
  "session_id": "uuid-here",
  "triage_label": "EMERGENCY_911",
  "urgency": "immediate",
  "action": "Call 911 immediately",
  "timeframe": "now",
  "matched_rules": [...],
  "explanation": "Severe cardiac symptoms...",
  "confidence_score": 0.9,
  "timestamp": "2024-01-01T12:00:00"
}
```

### 4. Transformed to Frontend Format
```json
{
  "triage_level": "EMERGENCY",
  "explanation": "Severe cardiac symptoms...",
  "suggested_actions": [
    "Call 911 immediately",
    "Timeframe: now",
    "Based on: Cardiac Emergency"
  ],
  "urgency": "immediate",
  "confidence_score": 0.9,
  "session_id": "uuid-here"
}
```

## 🚀 Running Both Services

### Terminal 1: Start Backend
```powershell
cd C:\Users\udayj\GeeksforGeeks
python -m uvicorn geeksforgeeks.triage:app --reload --port 8000
```

Backend will be available at: **http://localhost:8000**
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health

### Terminal 2: Start Frontend
```powershell
cd C:\Users\udayj\GeeksforGeeks\triage-frontend
npm install  # First time only
npm run dev
```

Frontend will be available at: **http://localhost:3000** (or 5173 depending on Vite config)

## 🔧 Configuration

### Frontend Environment (.env)
```env
VITE_API_URL=http://localhost:8000
```

### CORS Configuration
The backend is already configured to accept requests from any origin:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**For production**: Update `allow_origins` to specific domains:
```python
allow_origins=["https://yourdomain.com", "https://www.yourdomain.com"]
```

## 🎯 Testing the Integration

### Test 1: Emergency Scenario
**Frontend Input:**
- Symptoms text: "severe chest pain and difficulty breathing"
- Checkboxes: chest_pain, breathlessness
- Severity: severe
- Age: 55

**Expected Result:**
- Triage Level: EMERGENCY
- Action: Call 911 immediately
- Urgency: immediate

### Test 2: Self-Care Scenario
**Frontend Input:**
- Symptoms text: "runny nose and mild cough"
- Checkboxes: runny_nose
- Severity: mild
- Age: 30

**Expected Result:**
- Triage Level: SELF_CARE
- Suggested Actions: Self-care with monitoring
- Urgency: low

### Test 3: Urgent Care Scenario
**Frontend Input:**
- Symptoms text: "high fever with severe headache"
- Checkboxes: fever
- Severity: high
- Age: 25

**Expected Result:**
- Triage Level: URGENT
- Action: Seek urgent care within 2-4 hours
- Urgency: urgent

## 🔍 API Mapping

### Symptom Mapping
Frontend checkbox IDs are automatically mapped to backend symptom text:
```javascript
{
  'fever': 'fever',
  'chest_pain': 'chest pain',
  'breathlessness': 'shortness of breath',
  'vomiting': 'vomiting',
  'drowsy': 'confusion',
  'runny_nose': 'runny nose'
}
```

### Triage Level Mapping
Backend labels are transformed to frontend levels:
```javascript
{
  'EMERGENCY_911': 'EMERGENCY',
  'URGENT_CARE': 'URGENT',
  'SEE_DOCTOR_24H': 'ROUTINE',
  'SELF_CARE_MONITOR': 'SELF_CARE'
}
```

## 🐛 Troubleshooting

### Issue: CORS Error
**Symptom:** Browser console shows CORS policy error
**Solution:** Ensure backend CORS middleware is properly configured (already done)

### Issue: Connection Refused
**Symptom:** "Failed to fetch" or "Connection refused"
**Solution:** 
1. Verify backend is running: `curl http://localhost:8000/api/health`
2. Check .env file has correct `VITE_API_URL`
3. Restart frontend: `npm run dev`

### Issue: 422 Validation Error
**Symptom:** Backend returns 422 status
**Solution:** Check that symptom transformation is working. Verify payload in browser DevTools Network tab.

### Issue: Empty Response
**Symptom:** No triage results shown
**Solution:** 
1. Check browser console for errors
2. Verify backend response in Network tab
3. Ensure transformation function is working

## 📱 Development Workflow

### 1. Make Changes to Backend Rules
```bash
# Edit rules.yaml
cd C:\Users\udayj\GeeksforGeeks\geeksforgeeks
notepad rules.yaml

# Backend auto-reloads with --reload flag
# No restart needed!
```

### 2. Make Changes to Frontend
```bash
# Edit any .jsx or .js files
cd C:\Users\udayj\GeeksforGeeks\triage-frontend

# Vite auto-reloads
# No restart needed!
```

### 3. Test Integration
1. Submit form in frontend (http://localhost:3000)
2. Check browser DevTools → Network tab for request/response
3. Check backend terminal for logs
4. Verify results display correctly

## 🚢 Production Deployment

### Deploy Backend (Render/Railway/Heroku)
Follow the steps in `geeksforgeeks/DEPLOYMENT_GUIDE.md`

Get your deployed backend URL (e.g., `https://your-app.onrender.com`)

### Deploy Frontend (Netlify/Vercel)
1. Update `.env` with production backend URL:
   ```env
   VITE_API_URL=https://your-backend-api.onrender.com
   ```

2. Build frontend:
   ```bash
   npm run build
   ```

3. Deploy `dist` folder to Netlify/Vercel

4. Update backend CORS to allow your frontend domain:
   ```python
   allow_origins=["https://your-frontend.netlify.app"]
   ```

## 📊 API Endpoints Reference

| Endpoint | Method | Frontend Usage | Description |
|----------|--------|----------------|-------------|
| `/api/triage` | POST | Main form submission | Evaluate symptoms and return triage recommendation |
| `/api/demo/{id}` | GET | Testing/Demo mode | Get pre-built demo scenarios |
| `/api/demo` | GET | List demos | Get list of available demo IDs |
| `/api/health` | GET | Health check | Verify backend is running |
| `/api/rules` | GET | Admin/Debug | View all triage rules |
| `/docs` | GET | Development | Interactive API documentation |

## ✅ Integration Checklist

- [x] Backend API running on port 8000
- [x] Frontend configured with correct API URL
- [x] CORS enabled on backend
- [x] Request payload transformation implemented
- [x] Response payload transformation implemented  
- [x] Symptom mapping configured
- [x] Triage level mapping configured
- [x] Error handling implemented
- [x] .env file created
- [x] Both services can communicate

## 🎉 You're All Set!

Your healthcare triage system is now fully integrated and ready to use!

**Start both services and test at:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000/docs

**Next Steps:**
1. Test with various symptom combinations
2. Customize rules in `rules.yaml`
3. Add more symptoms to the frontend form
4. Deploy to production when ready

---

For issues or questions, check:
- Backend docs: `geeksforgeeks/README.md`
- Frontend docs: `triage-frontend/README.md`
- Deployment guide: `geeksforgeeks/DEPLOYMENT_GUIDE.md`
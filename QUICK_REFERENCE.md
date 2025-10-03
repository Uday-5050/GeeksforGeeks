# 🚀 Quick Reference - User Dashboard

## 🌐 Access URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3001 | Main application |
| **Backend API** | http://localhost:8000 | Triage API |
| **API Docs** | http://localhost:8000/docs | Swagger documentation |
| **User Dashboard** | http://localhost:3001/user-dashboard | Patient interface |
| **Admin Dashboard** | http://localhost:3001/dashboard | Admin interface |

---

## 👤 Test Credentials

### Regular User
```
Email: user@example.com
Password: password
→ Redirects to: /user-dashboard
```

### Admin User
```
Email: admin@example.com
Password: password
→ Redirects to: /dashboard
```

---

## 🎯 Quick Test Flow

### 1️⃣ Login
```
Open: http://localhost:3001
Login as: user@example.com
Result: User Dashboard loads
```

### 2️⃣ Check Symptoms (Text)
```
Type: "I have a fever, headache, and body ache"
Click: 🔬 Analyze Symptoms
Result: See analysis with risk level and recommendations
```

### 3️⃣ Check Symptoms (Voice)
```
Click: 🎤 Voice Input
Speak: "I have chest pain and shortness of breath"
Click: ⏹️ Stop Recording
Click: 🔬 Analyze Symptoms
Result: Emergency recommendation with red alert
```

### 4️⃣ Check Symptoms (Quick Select)
```
Click chips: 🌡️ Fever + 🤕 Headache + 😷 Cough
Click: 🔬 Analyze Symptoms
Result: Moderate risk with doctor recommendation
```

### 5️⃣ View History
```
Click: 📋 My History (sidebar)
Result: See all past symptom checks
```

### 6️⃣ Change Language
```
Click: Language dropdown (sidebar)
Select: 🇮🇳 हिंदी
Result: Voice input switches to Hindi
```

---

## 🎨 Feature Checklist

| Feature | Status | Location |
|---------|--------|----------|
| Text Input | ✅ | Symptom Checker tab |
| Voice Input | ✅ | Symptom Checker tab |
| Quick Select | ✅ | Symptom Checker tab |
| AI Analysis | ✅ | API integration |
| Risk Assessment | ✅ | Results panel |
| Recommendations | ✅ | Results panel |
| Care Tips | ✅ | Results panel |
| Specialist Suggestions | ✅ | Results panel |
| Health Resources | ✅ | Results panel |
| History Tracking | ✅ | My History tab |
| Health Education | ✅ | Health Info tab |
| Multilingual (6 langs) | ✅ | Settings/Sidebar |
| Responsive Design | ✅ | All devices |

---

## 🧪 Test Scenarios

### Scenario A: Emergency
```
Symptoms: chest pain, shortness of breath, dizziness
Expected: 🚨 HIGH RISK (Red) → Call 911
```

### Scenario B: Urgent Care
```
Symptoms: high fever 104°F, difficulty breathing
Expected: ⚠️ MODERATE RISK (Orange) → Urgent care 24h
```

### Scenario C: Doctor Visit
```
Symptoms: persistent cough, fatigue (3 weeks)
Expected: ⚠️ MODERATE RISK (Yellow) → Doctor 48h
```

### Scenario D: Self-Care
```
Symptoms: runny nose, sneezing, mild cough
Expected: ✅ LOW RISK (Green) → Home care
```

---

## 🎤 Voice Input Languages

| Language | Code | Voice Recognition |
|----------|------|-------------------|
| English | en | en-US |
| हिंदी | hi | hi-IN |
| Español | es | es-ES |
| தமிழ் | ta | ta-IN |
| తెలుగు | te | te-IN |
| ಕನ್ನಡ | kn | kn-IN |

---

## 📊 Common Symptoms

| Icon | Symptom | Category |
|------|---------|----------|
| 🌡️ | Fever | Temperature |
| 🤕 | Headache | Pain |
| 😷 | Cough | Respiratory |
| 🗣️ | Sore Throat | Respiratory |
| 💪 | Body Ache | Pain |
| 😴 | Fatigue | General |
| 🤢 | Nausea | Digestive |
| 😵 | Dizziness | Neurological |
| ❤️ | Chest Pain | Cardiac |
| 😮‍💨 | Shortness of Breath | Respiratory |
| 🫃 | Abdominal Pain | Digestive |
| 🤧 | Runny Nose | Respiratory |

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Voice not working | Use Chrome/Edge, allow microphone |
| Analysis fails | Check backend on port 8000 |
| History not saving | Enable localStorage in browser |
| Port 3000 in use | Use port 3001 (auto-switched) |
| No results showing | Check console (F12) for errors |

---

## 📱 Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Desktop | 1920px+ | 2 columns, full sidebar |
| Laptop | 1366px | 2 columns, compact |
| Tablet | 768px | 1 column, sidebar |
| Mobile | 375px | 1 column, stack |

---

## 🎨 Color Reference

| Risk Level | Color | Hex |
|------------|-------|-----|
| High | Red | #ef4444 |
| Moderate | Orange | #f97316 |
| Moderate | Yellow | #eab308 |
| Low | Green | #10b981 |
| Primary | Purple | #667eea |
| Secondary | Purple | #764ba2 |

---

## 📁 Key Files

```
triage-frontend/src/pages/
├── UserDashboard.jsx     (650+ lines) ✨
├── UserDashboard.css     (1000+ lines) ✨
├── Login.jsx             (updated)
├── Dashboard.jsx         (admin)
└── App.jsx               (routing)
```

---

## 🚀 Deployment Checklist

- [ ] Backend running (port 8000)
- [ ] Frontend running (port 3001)
- [ ] Test login (user & admin)
- [ ] Test text input
- [ ] Test voice input
- [ ] Test quick select
- [ ] Test all tabs
- [ ] Test history
- [ ] Test language switch
- [ ] Test mobile view
- [ ] Check console errors
- [ ] Verify API responses

---

## 📞 Quick Commands

### Start Backend
```powershell
cd C:\Users\saran\Desktop\hackathon\GeeksforGeeks\geeksforgeeks
python triage.py
```

### Start Frontend
```powershell
cd C:\Users\saran\Desktop\hackathon\GeeksforGeeks\triage-frontend
npm run dev
```

### Test API
```powershell
curl -X POST http://localhost:8000/api/triage -H "Content-Type: application/json" -d "{\"symptoms\":[\"fever\"]}"
```

---

## ✅ Success Criteria

Your dashboard is working if:
- ✅ Login redirects to /user-dashboard
- ✅ Can type symptoms and analyze
- ✅ Can use voice input (Chrome)
- ✅ Can select symptom chips
- ✅ Results show risk level
- ✅ Recommendations display
- ✅ History saves and shows
- ✅ Language switching works
- ✅ All tabs functional
- ✅ No console errors

---

## 🎉 You're All Set!

**Ready to use:**
1. Open http://localhost:3001
2. Login as user
3. Start checking symptoms!

**For support:**
- Check TESTING_GUIDE.md
- Check USER_DASHBOARD_GUIDE.md
- Check browser console (F12)

---

**Status:** ✅ Production Ready  
**Last Updated:** October 3, 2025  
**Version:** 1.0.0

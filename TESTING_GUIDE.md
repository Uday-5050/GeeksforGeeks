# 🚀 Quick Start Guide - User Dashboard Testing

## ✅ System Status

### **Backend Server** 
- ✅ Running on: `http://localhost:8000`
- ✅ API Endpoint: `http://localhost:8000/api/triage`
- ✅ Admin API: `http://localhost:8000/api/admin`

### **Frontend Server**
- ✅ Running on: `http://localhost:3001` (or `http://localhost:3000`)
- ✅ User Dashboard: `/user-dashboard`
- ✅ Admin Dashboard: `/dashboard`

---

## 🎯 How to Test the User Dashboard

### **Step 1: Access the Application**

Open your browser and go to:
```
http://localhost:3001
```
(or `http://localhost:3000` if that's the port)

---

### **Step 2: Login as a User**

#### **Option A: Regular User Login**
1. Email: `user@example.com`
2. Password: `password`
3. Click "Sign In"
4. ✅ You'll be redirected to **User Dashboard** (`/user-dashboard`)

#### **Option B: Admin Login**
1. Email: `admin@example.com`
2. Password: `password`
3. Click "Sign In"
4. ✅ You'll be redirected to **Admin Dashboard** (`/dashboard`)

#### **Option C: Sign Up**
1. Click "Sign Up" tab
2. Enter email and password
3. Click "Create Account"
4. ✅ You'll be redirected to **User Dashboard**

---

### **Step 3: Test Symptom Checker**

#### **Test A: Text Input**
1. In the "Describe Your Symptoms" textarea, type:
   ```
   I have a high fever, headache, and body ache for 2 days
   ```
2. Click "🔬 Analyze Symptoms"
3. ✅ View results on the right panel

#### **Test B: Voice Input** (Chrome/Edge only)
1. Click "🎤 Voice Input" button
2. Allow microphone access (if prompted)
3. Speak: "I have chest pain and difficulty breathing"
4. Click "⏹️ Stop Recording"
5. Click "🔬 Analyze Symptoms"
6. ✅ View results

#### **Test C: Quick Select**
1. Click on symptom chips:
   - 🌡️ Fever
   - 🤕 Headache
   - 😷 Cough
2. Selected symptoms appear as tags
3. Click "🔬 Analyze Symptoms"
4. ✅ View results

---

### **Step 4: Review Analysis Results**

After clicking "Analyze Symptoms", you should see:

✅ **Risk Level Badge**
- 🚨 High Risk (Red) - Emergency conditions
- ⚠️ Moderate Risk (Orange/Yellow) - Doctor visit needed
- ✅ Low Risk (Green) - Self-care recommended

✅ **Recommendation Card**
- Action to take
- Timeframe
- Urgency level

✅ **AI Assessment**
- Explanation of the condition
- Confidence score (0-100%)
- Confidence meter visualization

✅ **Care Tips**
- Dos and don'ts
- Home care instructions
- Hydration/rest recommendations

✅ **Specialist Recommendations** (if applicable)
- Types of doctors to consult
- Badge display

✅ **Trusted Health Resources**
- Links to WHO, CDC, Ministry of Health

---

### **Step 5: Test Other Tabs**

#### **📋 My History**
1. Click "📋 My History" in the sidebar
2. ✅ View all past symptom checks
3. ✅ Each entry shows date, symptoms, risk level, recommendations

#### **📚 Health Info**
1. Click "📚 Health Info" in the sidebar
2. ✅ Browse educational cards:
   - Common Cold
   - Fever Management
   - Food Poisoning
   - Medication Safety
   - Emergency Care Guidelines
   - Preventive Care

#### **⚙️ Settings**
1. Click "⚙️ Settings" in the sidebar
2. ✅ Change language (English, Hindi, Tamil, Telugu, Kannada, Spanish)
3. ✅ Toggle notifications
4. ✅ Manage data (Export/Clear history)

---

### **Step 6: Test Language Support**

1. Go to **Settings** or use the language dropdown in the sidebar
2. Select a language:
   - 🇺🇸 English
   - 🇮🇳 हिंदी (Hindi)
   - 🇪🇸 Español (Spanish)
   - 🇮🇳 தமிழ் (Tamil)
   - 🇮🇳 తెలుగు (Telugu)
   - 🇮🇳 ಕನ್ನಡ (Kannada)
3. ✅ Voice input language updates automatically

---

## 🧪 Test Scenarios

### **Scenario 1: Emergency Condition**
**Symptoms:** Chest pain, shortness of breath, dizziness
**Expected Result:**
- 🚨 Risk Level: HIGH (Red)
- Recommendation: Call 911 or go to ER immediately
- Urgency: EMERGENCY
- No delay in seeking care

### **Scenario 2: Urgent Care**
**Symptoms:** High fever (104°F), difficulty breathing, confusion
**Expected Result:**
- ⚠️ Risk Level: MODERATE (Orange)
- Recommendation: Visit urgent care within 24 hours
- Suggested Specialists: General Physician, Internal Medicine

### **Scenario 3: Doctor Visit**
**Symptoms:** Persistent cough, fatigue, weight loss (3 weeks)
**Expected Result:**
- ⚠️ Risk Level: MODERATE (Yellow)
- Recommendation: Schedule doctor appointment within 48 hours
- Suggested Specialists: General Physician, Family Medicine

### **Scenario 4: Self-Care**
**Symptoms:** Runny nose, sneezing, mild cough (2 days)
**Expected Result:**
- ✅ Risk Level: LOW (Green)
- Recommendation: Home care with monitoring
- Care Tips: Rest, hydration, OTC medications

---

## 🔍 Feature Checklist

### **Symptom Input**
- [ ] Text input accepts natural language
- [ ] Voice input button works (Chrome/Edge)
- [ ] Quick select chips toggle on/off
- [ ] Selected symptoms display as tags
- [ ] Can remove selected symptoms
- [ ] Clear button resets form

### **AI Analysis**
- [ ] Analyze button triggers API call
- [ ] Loading state shows during analysis
- [ ] Results appear in right panel
- [ ] Risk level correctly categorized
- [ ] Confidence score displays

### **Results Display**
- [ ] Risk indicator shows correct color
- [ ] Recommendation card displays action
- [ ] Timeframe badge visible
- [ ] AI explanation provided
- [ ] Care tips list displayed
- [ ] Specialist badges appear (when applicable)
- [ ] Resource links work

### **History Tracking**
- [ ] New checks saved to history
- [ ] History tab shows past checks
- [ ] Date/time displayed correctly
- [ ] Can view symptoms and recommendations
- [ ] History persists after page refresh

### **Health Info**
- [ ] Info cards display correctly
- [ ] Content is readable and helpful
- [ ] Warning card highlighted differently
- [ ] All 6 categories present

### **Settings**
- [ ] Language dropdown works
- [ ] Language changes apply to voice input
- [ ] Notification toggles work
- [ ] Export/Clear buttons present

### **Navigation**
- [ ] Sidebar navigation works
- [ ] Active tab highlighted
- [ ] Logout button redirects to login
- [ ] Logo and branding visible

### **Responsive Design**
- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)
- [ ] Touch-friendly on mobile

---

## 🐛 Troubleshooting

### **Issue: Voice input not working**
**Solution:**
- Use Chrome or Edge browser
- Allow microphone permissions
- Check browser console for errors
- Verify `webkitSpeechRecognition` is supported

### **Issue: Analysis not showing results**
**Solution:**
- Check backend is running on port 8000
- Open browser console (F12) for errors
- Verify CORS is enabled in backend
- Check network tab for failed requests

### **Issue: History not saving**
**Solution:**
- Check browser's localStorage is enabled
- Clear browser cache and try again
- Check console for localStorage errors

### **Issue: Port 3000 already in use**
**Solution:**
- Frontend automatically switches to port 3001
- Check console output for actual port
- Use the port shown in terminal output

---

## 📊 Backend API Testing

### **Test Triage Endpoint**
```bash
curl -X POST http://localhost:8000/api/triage \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["fever", "headache", "cough"],
    "severity": "moderate",
    "duration": "2 days",
    "additional_factors": []
  }'
```

### **Expected Response**
```json
{
  "session_id": "unique-uuid",
  "triage_label": "SEE_DOCTOR_24H",
  "urgency": "moderate",
  "action": "Schedule appointment within 24 hours",
  "timeframe": "24 hours",
  "matched_rules": [...],
  "explanation": "Based on your symptoms...",
  "confidence_score": 0.75,
  "timestamp": "2025-10-03T10:30:00"
}
```

---

## 🎨 UI/UX Testing

### **Visual Elements to Check**
- [ ] Gradient purple theme applied
- [ ] Icons display correctly (emojis)
- [ ] Buttons have hover effects
- [ ] Cards have proper shadows
- [ ] Animations smooth (slide-in, pulse)
- [ ] Colors accessible (contrast ratio)
- [ ] Fonts readable

### **User Experience**
- [ ] Flow is intuitive
- [ ] Loading states provide feedback
- [ ] Error messages clear and helpful
- [ ] Success states visible
- [ ] No broken layouts
- [ ] Fast response times

---

## 📸 Screenshots to Capture

1. **Login Screen** - User and admin login
2. **Symptom Checker** - Main dashboard with input forms
3. **Quick Select** - Symptom chips selected
4. **Analysis Results** - Complete results panel
5. **History Tab** - Past symptom checks
6. **Health Info Tab** - Educational cards
7. **Settings Tab** - Language and preferences
8. **Mobile View** - Responsive design

---

## ✅ Final Checklist

Before deployment:
- [ ] All features tested and working
- [ ] No console errors
- [ ] Backend API responsive
- [ ] History persisting correctly
- [ ] Voice input functioning (Chrome/Edge)
- [ ] All languages working
- [ ] Responsive on all devices
- [ ] Accessibility features working
- [ ] Documentation complete
- [ ] User guide ready

---

## 🚀 Next Steps

1. ✅ **Test locally** - Complete all test scenarios
2. ✅ **Fix bugs** - Address any issues found
3. ✅ **User testing** - Get feedback from real users
4. ✅ **Performance optimization** - Check load times
5. ✅ **Security review** - Ensure data protection
6. ✅ **Deploy** - Push to production server

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Verify backend is running (port 8000)
3. Verify frontend is running (port 3000/3001)
4. Review error messages
5. Check network requests
6. Clear browser cache

---

## 🎉 Success Criteria

The User Dashboard is ready when:
- ✅ All 3 input methods work (text, voice, quick select)
- ✅ AI analysis provides accurate recommendations
- ✅ History tracking persists data
- ✅ All 4 tabs functional
- ✅ Multilingual support working
- ✅ Responsive on all screen sizes
- ✅ No critical bugs
- ✅ Fast and smooth performance

---

**Happy Testing! 🎊**

---

**Last Updated:** October 3, 2025  
**Tester:** You  
**Status:** Ready for Testing ✅

# 🏗️ System Architecture - Complete Overview

## 🎯 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                    (React Frontend - Port 3001)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │  Login Page   │  │User Dashboard │  │Admin Dashboard│       │
│  │               │  │               │  │               │       │
│  │ • Sign In     │  │ • Symptoms    │  │ • Statistics  │       │
│  │ • Sign Up     │  │ • Analysis    │  │ • Patients    │       │
│  │ • Social Auth │  │ • History     │  │ • Triage Data │       │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘       │
│          │                  │                  │                 │
│          └──────────────────┴──────────────────┘                 │
│                             │                                     │
└─────────────────────────────┼─────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │ (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API SERVER                            │
│                  (FastAPI - Python - Port 8000)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐│
│  │ Triage Endpoint  │  │ Admin Endpoints  │  │Demo Endpoints  ││
│  │ POST /api/triage │  │ /api/admin/*     │  │ /api/demo/*    ││
│  │                  │  │                  │  │                ││
│  │ • Symptom Input  │  │ • Dashboard Stats│  │ • Test Payloads││
│  │ • AI Analysis    │  │ • Patient Data   │  │ • Scenarios    ││
│  │ • Risk Assess    │  │ • Login/Auth     │  │                ││
│  │ • Recommendations│  │ • History        │  │                ││
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬───────┘│
│           │                     │                     │         │
│           └─────────────────────┴─────────────────────┘         │
│                                 │                                 │
│                                 ▼                                 │
│           ┌──────────────────────────────────────┐               │
│           │     AI/NLP Processing Engine         │               │
│           │                                      │               │
│           │ • Rule-based Matching               │               │
│           │ • Symptom Interpretation            │               │
│           │ • Pattern Recognition               │               │
│           │ • OpenAI Integration (optional)     │               │
│           │ • Confidence Scoring                │               │
│           └──────────────────┬───────────────────┘               │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│                   (SQLite Database)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │triage_sessions  │  │  admin_users    │  │   patients     │  │
│  │                 │  │                 │  │                │  │
│  │ • session_id    │  │ • id            │  │ • id           │  │
│  │ • symptoms      │  │ • username      │  │ • name         │  │
│  │ • severity      │  │ • email         │  │ • age          │  │
│  │ • triage_label  │  │ • password_hash │  │ • contact      │  │
│  │ • timestamp     │  │ • role          │  │ • visits       │  │
│  └─────────────────┘  └─────────────────┘  └────────────────┘  │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │ triage_cases    │  │activity_log     │  │ notifications  │  │
│  │                 │  │                 │  │                │  │
│  │ • id            │  │ • admin_id      │  │ • id           │  │
│  │ • patient_id    │  │ • action        │  │ • type         │  │
│  │ • symptoms      │  │ • timestamp     │  │ • message      │  │
│  │ • risk_level    │  │ • ip_address    │  │ • read         │  │
│  │ • status        │  │                 │  │ • timestamp    │  │
│  └─────────────────┘  └─────────────────┘  └────────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Dashboard Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER LOGIN                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              USER DASHBOARD LOADS                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Symptom  │ │ History  │ │  Health  │ │Settings  │      │
│  │ Checker  │ │          │ │   Info   │ │          │      │
│  └────┬─────┘ └──────────┘ └──────────┘ └──────────┘      │
└───────┼──────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│            SYMPTOM INPUT (3 Methods)                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Text Input   │  │ Voice Input  │  │Quick Select  │      │
│  │              │  │              │  │              │      │
│  │ "I have a    │  │ 🎤 Record   │  │ 🌡️ Fever    │      │
│  │  fever and   │  │ 🗣️ Speech  │  │ 🤕 Headache │      │
│  │  headache"   │  │ ⏹️ Stop     │  │ 😷 Cough    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Combine Symptoms   │
                 │                      │
                 │ • Parse text         │
                 │ • Add voice input    │
                 │ • Add selected chips │
                 └──────────┬───────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ Click "🔬 Analyze"    │
                └───────────┬───────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   API REQUEST                                │
│                                                              │
│  POST http://localhost:8000/api/triage                      │
│  {                                                           │
│    "symptoms": ["fever", "headache"],                       │
│    "severity": "moderate",                                  │
│    "duration": "2 days",                                    │
│    "additional_factors": []                                 │
│  }                                                           │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND AI PROCESSING                           │
│                                                              │
│  1. NLP Interpretation                                      │
│     ├─ Map symptoms to medical database                    │
│     └─ Identify patterns                                    │
│                                                              │
│  2. Rule Matching                                           │
│     ├─ Load rules.yaml                                      │
│     ├─ Match conditions                                     │
│     └─ Calculate confidence                                 │
│                                                              │
│  3. Risk Assessment                                         │
│     ├─ Evaluate severity                                    │
│     ├─ Consider duration                                    │
│     └─ Check additional factors                             │
│                                                              │
│  4. Generate Recommendations                                │
│     ├─ Triage label (EMERGENCY/URGENT/GP/SELF_CARE)       │
│     ├─ Action steps                                         │
│     ├─ Timeframe                                            │
│     └─ Explanation                                          │
│                                                              │
│  5. Log Session                                             │
│     └─ Save to triage_sessions table                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  API RESPONSE                                │
│                                                              │
│  {                                                           │
│    "session_id": "abc-123",                                 │
│    "triage_label": "SEE_DOCTOR_24H",                        │
│    "urgency": "moderate",                                   │
│    "action": "Schedule appointment within 24 hours",        │
│    "timeframe": "24 hours",                                 │
│    "matched_rules": [...],                                  │
│    "explanation": "Based on your symptoms...",              │
│    "confidence_score": 0.85,                                │
│    "timestamp": "2025-10-03T10:30:00"                       │
│  }                                                           │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               DISPLAY RESULTS                                │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🚨/⚠️/✅ RISK INDICATOR                              │   │
│  │ Risk Level: High/Moderate/Low                        │   │
│  │ Urgency: [urgency level]                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🩺 RECOMMENDATION CARD                               │   │
│  │ [Action to take]                                     │   │
│  │ ⏰ Timeframe: [when to act]                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🤖 AI EXPLANATION                                    │   │
│  │ [Detailed explanation]                               │   │
│  │ Confidence: 85% ████████░░                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 💡 CARE TIPS                                         │   │
│  │ • Rest and stay hydrated                             │   │
│  │ • Monitor temperature                                │   │
│  │ • Take OTC medications                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 👨‍⚕️ SPECIALISTS (if applicable)                      │   │
│  │ [General Physician] [Internal Medicine]              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔗 HEALTH RESOURCES                                  │   │
│  │ 🌍 WHO | 🏛️ CDC | 🇮🇳 Ministry of Health            │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ SAVE TO HISTORY       │
                │ (localStorage)        │
                └───────────┬───────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ User can view in      │
                │ "📋 My History" tab   │
                └───────────────────────┘
```

---

## 🎤 Voice Input Architecture

```
┌────────────────────────────────────────────────────────┐
│              User clicks "🎤 Voice Input"              │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Browser asks for permission  │
        │ "Allow microphone access?"   │
        └──────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│           Web Speech API Initialization                  │
│                                                           │
│  const recognition = new webkitSpeechRecognition();      │
│  recognition.lang = selectedLanguage;                    │
│  recognition.continuous = false;                         │
│  recognition.interimResults = false;                     │
│  recognition.start();                                    │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │ 🔴 Recording starts   │
           │ (pulse animation)     │
           └───────┬───────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │ User speaks symptoms     │
        │ "I have chest pain and   │
        │  shortness of breath"    │
        └──────────┬───────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│            Speech Recognition Processing                 │
│                                                           │
│  recognition.onresult = (event) => {                     │
│    const transcript = event.results[0][0].transcript;    │
│    setSymptoms(prev => prev + ' ' + transcript);         │
│  }                                                        │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │ Text appears in       │
           │ symptom textarea      │
           │                       │
           │ "I have chest pain    │
           │  and shortness of     │
           │  breath"              │
           └───────┬───────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │ User clicks              │
        │ "🔬 Analyze Symptoms"    │
        └──────────┬───────────────┘
                   │
                   ▼
           (Continue to Analysis Flow)
```

---

## 📊 Data Persistence Architecture

```
┌────────────────────────────────────────────────────────┐
│              After Each Analysis                        │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│         Create History Entry Object                      │
│                                                           │
│  {                                                        │
│    timestamp: "2025-10-03T10:30:00",                     │
│    symptoms: ["fever", "headache"],                      │
│    triage_label: "SEE_DOCTOR_24H",                       │
│    urgency: "moderate",                                  │
│    action: "Schedule appointment within 24 hours",       │
│    confidence_score: 0.85,                               │
│    session_id: "abc-123"                                 │
│  }                                                        │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Add to history array          │
        │ (prepend to keep newest first)│
        └──────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│         Save to Browser localStorage                     │
│                                                           │
│  localStorage.setItem(                                   │
│    'symptom-history',                                    │
│    JSON.stringify(history)                               │
│  );                                                       │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Also save to backend DB      │
        │ (triage_sessions table)      │
        └──────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│              User Views History                          │
│                                                           │
│  Click "📋 My History" →                                 │
│  Load from localStorage →                                │
│  Display in chronological order                          │
│                                                           │
│  Features:                                               │
│  • Color-coded risk levels                               │
│  • Full symptom list                                     │
│  • Recommendations shown                                 │
│  • Timestamps in readable format                         │
└──────────────────────────────────────────────────────────┘
```

---

## 🌍 Multilingual System Architecture

```
┌────────────────────────────────────────────────────────┐
│         User Selects Language                           │
│         (Dropdown in sidebar or settings)               │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ setSelectedLanguage(code)    │
        │ e.g., 'hi' for Hindi         │
        └──────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│          Language Code Mapping                           │
│                                                           │
│  'en' → English  (en-US voice)                           │
│  'hi' → हिंदी    (hi-IN voice)                           │
│  'es' → Español  (es-ES voice)                           │
│  'ta' → தமிழ்    (ta-IN voice)                           │
│  'te' → తెలుగు   (te-IN voice)                           │
│  'kn' → ಕನ್ನಡ    (kn-IN voice)                           │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Update Speech Recognition    │
        │ recognition.lang = newLang   │
        └──────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│         User Uses Voice Input                            │
│                                                           │
│  If language = 'hi':                                     │
│    User speaks in Hindi                                  │
│    Recognition uses hi-IN                                │
│    Text appears in Devanagari script                     │
│                                                           │
│  If language = 'ta':                                     │
│    User speaks in Tamil                                  │
│    Recognition uses ta-IN                                │
│    Text appears in Tamil script                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌────────────────────────────────────────────────────────┐
│              User Opens Application                     │
│              http://localhost:3001                      │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Check localStorage           │
        │ for existing session         │
        └──────────┬───────────────────┘
                   │
                   ├─ Session exists? ─┐
                   │                   │
                   NO                 YES
                   │                   │
                   ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │ Show Login Page  │  │ Auto-redirect to │
        │                  │  │ appropriate page │
        └────────┬─────────┘  └────────┬─────────┘
                 │                     │
                 ▼                     ▼
      ┌──────────────────┐   ┌────────────────────┐
      │ User enters      │   │ If role = 'admin'  │
      │ credentials      │   │ → /dashboard       │
      │                  │   │                    │
      │ Email: user@...  │   │ If role = 'user'   │
      │ Password: ***    │   │ → /user-dashboard  │
      └────────┬─────────┘   └────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Check email format   │
    │ Contains "admin"?    │
    └────────┬─────────────┘
             │
             ├─ YES ─────┐
             │           │
             NO         YES
             │           │
             ▼           ▼
  ┌──────────────────┐ ┌──────────────────┐
  │ Set role: 'user' │ │ Set role: 'admin'│
  │ Save to storage  │ │ Save to storage  │
  └────────┬─────────┘ └────────┬─────────┘
           │                    │
           ▼                    ▼
  ┌──────────────────┐ ┌──────────────────┐
  │ Redirect to      │ │ Redirect to      │
  │ /user-dashboard  │ │ /dashboard       │
  └──────────────────┘ └──────────────────┘
```

---

## 📱 Responsive Layout Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  DESKTOP (1920px+)                       │
│                                                          │
│  ┌──────────┬──────────────────────────────────────┐   │
│  │          │                                       │   │
│  │ Sidebar  │         Main Content Area            │   │
│  │ 280px    │         (Flex: 1)                     │   │
│  │          │                                       │   │
│  │ • Logo   │  ┌─────────────┬─────────────────┐  │   │
│  │ • Nav    │  │  Input      │   Results       │  │   │
│  │ • Lang   │  │  Section    │   Section       │  │   │
│  │ • Logout │  │             │                 │  │   │
│  │          │  └─────────────┴─────────────────┘  │   │
│  └──────────┴──────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  TABLET (768px)                          │
│                                                          │
│  ┌──────────┬──────────────────────────────────────┐   │
│  │          │                                       │   │
│  │ Sidebar  │         Main Content                 │   │
│  │ 250px    │         (Single Column)              │   │
│  │          │                                       │   │
│  │ (Same)   │  ┌─────────────────────────────┐    │   │
│  │          │  │  Input Section              │    │   │
│  │          │  └─────────────────────────────┘    │   │
│  │          │  ┌─────────────────────────────┐    │   │
│  │          │  │  Results Section            │    │   │
│  │          │  └─────────────────────────────┘    │   │
│  └──────────┴──────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  MOBILE (375px)                          │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Header (Collapsible Sidebar)                   │   │
│  │  ☰ Menu | Logo | User                           │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │          Main Content (Full Width)              │   │
│  │          (Stacked Vertically)                   │   │
│  │                                                  │   │
│  │  ┌─────────────────────────────────────┐       │   │
│  │  │  Input Section                      │       │   │
│  │  └─────────────────────────────────────┘       │   │
│  │  ┌─────────────────────────────────────┐       │   │
│  │  │  Results Section                    │       │   │
│  │  └─────────────────────────────────────┘       │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Real-Time Sync Architecture

```
┌────────────────────────────────────────────────────────┐
│            Patient Uses User Dashboard                  │
│            Submits Symptom Check                        │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ POST /api/triage             │
        │ (Backend processes)          │
        └──────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│         Data Saved to Multiple Tables                    │
│                                                           │
│  1. triage_sessions                                      │
│     • Basic session info                                 │
│     • Timestamp                                          │
│     • Symptoms                                           │
│                                                           │
│  2. triage_cases                                         │
│     • Patient info                                       │
│     • Risk level                                         │
│     • Status                                             │
│                                                           │
│  3. patients                                             │
│     • Patient record                                     │
│     • Visit count                                        │
│     • Last visit time                                    │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Admin Dashboard              │
        │ (Auto-refresh every 10s)     │
        └──────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│         Admin Views Updated Data                         │
│                                                           │
│  GET /api/admin/dashboard/stats                          │
│  • Total consultations                                   │
│  • Emergency cases                                       │
│  • Pending reviews                                       │
│  • Resolved cases                                        │
│                                                           │
│  GET /api/admin/triage-cases/recent                      │
│  • Latest patient cases                                  │
│  • Real-time updates                                     │
│  • Risk levels                                           │
│  • Timestamps                                            │
└──────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
App.jsx
│
├── Router
│   │
│   ├── Route: / (Login)
│   │   └── Login.jsx
│   │       ├── LoginForm
│   │       ├── SignUpForm
│   │       └── SocialAuth
│   │
│   ├── Route: /user-dashboard
│   │   └── UserDashboard.jsx
│   │       ├── Sidebar
│   │       │   ├── Logo
│   │       │   ├── Navigation
│   │       │   ├── LanguageSelector
│   │       │   └── LogoutButton
│   │       │
│   │       ├── Header
│   │       │   ├── Title
│   │       │   ├── HelpButton
│   │       │   └── UserProfile
│   │       │
│   │       └── MainContent
│   │           ├── SymptomChecker (Tab)
│   │           │   ├── InputSection
│   │           │   │   ├── TextArea
│   │           │   │   ├── VoiceButton
│   │           │   │   ├── SymptomChips
│   │           │   │   └── ActionButtons
│   │           │   │
│   │           │   └── ResultsSection
│   │           │       ├── RiskIndicator
│   │           │       ├── RecommendationCard
│   │           │       ├── AIExplanation
│   │           │       ├── CareTips
│   │           │       ├── SpecialistBadges
│   │           │       └── HealthResources
│   │           │
│   │           ├── History (Tab)
│   │           │   └── HistoryList
│   │           │       └── HistoryItem[]
│   │           │
│   │           ├── HealthInfo (Tab)
│   │           │   └── InfoCards
│   │           │       └── InfoCard[]
│   │           │
│   │           └── Settings (Tab)
│   │               ├── LanguageSettings
│   │               ├── NotificationSettings
│   │               └── DataManagement
│   │
│   └── Route: /dashboard
│       └── Dashboard.jsx (Admin)
│           ├── AdminSidebar
│           ├── AdminHeader
│           └── AdminContent
│               ├── StatsGrid
│               ├── RecentCases
│               └── QuickActions
```

---

## 📦 Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
├─────────────────────────────────────────────────────────┤
│ • React 18.2.0          (UI Framework)                  │
│ • React Router 6.x      (Navigation)                    │
│ • CSS3                  (Styling)                       │
│ • Web Speech API        (Voice Input)                   │
│ • LocalStorage API      (Data Persistence)              │
│ • Vite 5.4.20          (Build Tool)                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    BACKEND                               │
├─────────────────────────────────────────────────────────┤
│ • FastAPI 0.104.0+     (Web Framework)                  │
│ • Python 3.13          (Runtime)                        │
│ • Pydantic 2.4.0+      (Data Validation)                │
│ • PyJWT 2.8.0+         (Authentication)                 │
│ • OpenAI API           (Optional AI)                    │
│ • Uvicorn              (ASGI Server)                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    DATABASE                              │
├─────────────────────────────────────────────────────────┤
│ • SQLite 3             (Database)                       │
│ • 6 Tables             (Structured Data)                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    DEPLOYMENT                            │
├─────────────────────────────────────────────────────────┤
│ • Local Development    (localhost)                      │
│ • Docker               (Containerization - optional)    │
│ • Netlify/Vercel       (Frontend hosting)               │
│ • Heroku/AWS           (Backend hosting)                │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ System Status

```
Component              Status      URL
──────────────────────────────────────────────────────
Frontend Server        ✅ RUNNING  http://localhost:3001
Backend API            ✅ RUNNING  http://localhost:8000
Database               ✅ ACTIVE   triage_sessions.db
User Dashboard         ✅ READY    /user-dashboard
Admin Dashboard        ✅ READY    /dashboard
API Documentation      ✅ AVAILABLE /docs
Voice Recognition      ✅ ENABLED  (Chrome/Edge)
Multilingual Support   ✅ ACTIVE   6 languages
History Tracking       ✅ WORKING  localStorage
AI Analysis            ✅ OPERATIONAL NLP + Rules
```

---

**Architecture Status:** ✅ Production Ready  
**Last Updated:** October 3, 2025  
**Version:** 1.0.0

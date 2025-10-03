# Project Languages & Technologies Overview

## 🎯 Project Summary

**Project Name:** AI-Powered Healthcare Triage Bot  
**Purpose:** Intelligent symptom assessment and medical triage recommendation system  
**Type:** Full-Stack Web Application  
**Status:** Production Ready ✅

---

## 🗣️ Languages Used

### 1. **Python** 🐍 (Backend)
- **Version:** Python 3.13
- **Primary Use:** Backend API server, business logic, rule evaluation
- **Files:** 
  - `geeksforgeeks/triage.py` (412 lines) - Main API application
  - `geeksforgeeks/tests/test_triage.py` - Unit tests

**Why Python?**
- Excellent for AI/ML integration (OpenAI API)
- FastAPI provides modern, fast web framework
- Rich ecosystem for data processing
- Easy to read and maintain

### 2. **JavaScript** ⚡ (Frontend)
- **Variant:** Modern ES6+ JavaScript (JSX)
- **Primary Use:** Frontend web application, user interface
- **Framework:** React 18.3.1
- **Files:**
  - All files in `triage-frontend/src/` directory
  - Components, pages, API integration layer

**Why JavaScript/React?**
- Most popular for modern web UIs
- Component-based architecture
- Virtual DOM for fast rendering
- Huge ecosystem and community

### 3. **YAML** 📋 (Configuration)
- **File:** `geeksforgeeks/rules.yaml`
- **Primary Use:** Triage rules definition
- **Contains:** 12 medical triage rules with conditions

**Why YAML?**
- Human-readable configuration format
- Easy for non-programmers to update rules
- Perfect for structured data
- No code changes needed to update rules

### 4. **SQL** 🗄️ (Database)
- **Type:** SQLite
- **File:** `geeksforgeeks/triage_sessions.db`
- **Primary Use:** Session logging, audit trail

**Why SQLite?**
- Serverless, file-based database
- No setup required
- Perfect for small to medium applications
- Easy to backup and migrate

### 5. **CSS** 🎨 (Styling)
- **Pure CSS3** (No framework like Bootstrap/Tailwind)
- **Files:** Multiple `.css` files in `triage-frontend/src/`
- **Primary Use:** User interface styling, responsive design

**Why Pure CSS?**
- No external dependencies
- Full control over design
- Faster page loads
- Custom, healthcare-appropriate styling

### 6. **JSON** 📦 (Data Format)
- **Files:** 
  - `package.json` - Node.js dependencies
  - `demo_payloads.json` - Test scenarios
- **Primary Use:** Configuration, API data exchange

### 7. **Markdown** 📝 (Documentation)
- **Files:** All `.md` files (README, guides, etc.)
- **Primary Use:** Project documentation

### 8. **PowerShell** 💻 (Automation Scripts)
- **Files:** 
  - `start-servers.ps1`
  - `stop-servers.ps1`
  - `test-integration.ps1`
- **Primary Use:** Server management on Windows

---

## 🏗️ Project Architecture

### Two-Tier Architecture

```
┌─────────────────────────────────────────┐
│         FRONTEND (Client-Side)          │
│  ┌───────────────────────────────────┐  │
│  │   React 18 + Vite                 │  │
│  │   - JavaScript/JSX                │  │
│  │   - CSS for styling               │  │
│  │   - React Router for navigation   │  │
│  └───────────────────────────────────┘  │
│              ↓ HTTP/JSON ↑              │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         BACKEND (Server-Side)           │
│  ┌───────────────────────────────────┐  │
│  │   FastAPI + Uvicorn               │  │
│  │   - Python 3.13                   │  │
│  │   - YAML rules engine             │  │
│  │   - SQLite database               │  │
│  │   - OpenAI integration (optional) │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 📚 Technology Stack Breakdown

### **Backend Technologies**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.13 | Core programming language |
| **FastAPI** | 0.104.0+ | Modern web framework for APIs |
| **Uvicorn** | 0.24.0+ | ASGI server (runs FastAPI) |
| **Pydantic** | 2.4.0+ | Data validation and serialization |
| **PyYAML** | 6.0+ | YAML parsing for rules |
| **SQLite** | Built-in | Database for session storage |
| **OpenAI** | 1.3.0+ | AI explanations (optional) |
| **python-dotenv** | 1.0.0+ | Environment variable management |
| **httpx** | 0.25.0+ | HTTP client for testing |
| **pytest** | 7.4.0+ | Testing framework |

**Backend File Structure:**
```
geeksforgeeks/
├── triage.py              # Main FastAPI application (Python)
├── rules.yaml             # Triage rules (YAML)
├── demo_payloads.json     # Test scenarios (JSON)
├── requirements.txt       # Python dependencies
├── triage_sessions.db     # SQLite database
└── tests/
    └── test_triage.py     # Unit tests (Python)
```

### **Frontend Technologies**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **React DOM** | 18.3.1 | DOM rendering |
| **React Router** | 6.26.0 | Client-side routing |
| **Vite** | 5.4.1 | Build tool & dev server |
| **JavaScript** | ES6+ | Programming language |
| **CSS** | CSS3 | Styling |

**Frontend File Structure:**
```
triage-frontend/
├── src/
│   ├── App.jsx              # Main app & routing (JavaScript)
│   ├── main.jsx             # Entry point (JavaScript)
│   ├── index.css            # Global styles (CSS)
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Symptom form page
│   │   ├── Login.jsx        # Authentication page
│   │   ├── Dashboard.jsx    # Admin dashboard
│   │   ├── Demo.jsx         # Demo scenarios
│   │   └── About.jsx        # Information page
│   ├── components/          # Reusable components
│   │   ├── TriageForm.jsx
│   │   └── TriageResult.jsx
│   └── services/
│       └── api.js           # Backend integration
├── public/                  # Static assets
├── package.json             # Node.js config (JSON)
├── vite.config.js           # Vite config (JavaScript)
└── index.html               # HTML entry point
```

---

## 🎯 What Does This Project Do?

### **Core Functionality**

This is an **AI-powered healthcare triage system** that helps users determine the urgency of their medical symptoms.

### **User Journey:**

1. **User visits website** → http://localhost:3000
2. **Login** → Simple authentication (admin or user role)
3. **Enter symptoms** → Describe symptoms, select from checklist, specify severity
4. **Submit** → Frontend sends data to backend
5. **AI Processing:**
   - Backend receives symptom data (Python)
   - Evaluates against 12 rules in `rules.yaml`
   - Matches symptoms to conditions
   - Determines urgency level
   - Optionally uses OpenAI for detailed explanation
6. **Results Display:**
   - **EMERGENCY (RED)** → Call 911 immediately
   - **URGENT** → Seek care within 4-24 hours
   - **GP (Routine)** → See doctor within days
   - **SELF-CARE** → Monitor at home
7. **Session logged** → SQLite database records the assessment

### **Example Scenarios:**

**Scenario 1: Emergency**
```
Input: "Severe chest pain, shortness of breath"
↓
Backend evaluates → Matches Rule RED_001 (Cardiac Emergency)
↓
Output: "EMERGENCY_911 - Call 911 immediately"
```

**Scenario 2: Self-Care**
```
Input: "Runny nose, sneezing"
↓
Backend evaluates → Matches Rule SELF_CARE_003 (Common Cold)
↓
Output: "SELF_CARE - Rest, hydration, monitor symptoms"
```

---

## 🔬 Technical Features

### **Backend Features (Python/FastAPI)**

1. **RESTful API Endpoints:**
   - `POST /api/triage` - Main triage assessment
   - `GET /api/health` - Health check
   - `GET /api/demo/{id}` - Demo scenarios
   - `GET /docs` - Auto-generated API documentation

2. **Rule-Based Engine:**
   - Loads rules from YAML file
   - Priority-based evaluation (1-12)
   - Pattern matching for symptoms
   - Severity thresholding
   - Confidence scoring

3. **AI Integration:**
   - OpenAI GPT integration for explanations
   - Template-based fallback if API unavailable
   - Smart explanation generation

4. **Data Persistence:**
   - SQLite database for session logging
   - Audit trail of all assessments
   - Session ID tracking

5. **CORS Enabled:**
   - Allows frontend-backend communication
   - Configurable origins for security

### **Frontend Features (React/JavaScript)**

1. **User Interface:**
   - Responsive design (mobile-first)
   - Accessible (WCAG compliant)
   - Clean, medical-appropriate styling
   - Loading states and error handling

2. **Routing:**
   - `/` - Login page
   - `/home` - Symptom assessment form
   - `/dashboard` - Admin view
   - `/demo` - Demo scenarios
   - `/about` - Information page

3. **Authentication:**
   - Role-based routing (admin/user)
   - LocalStorage session management
   - Simple email-based identification

4. **Data Management:**
   - Form state management
   - API integration layer (`services/api.js`)
   - Data transformation (frontend ↔ backend formats)
   - Error handling and validation

5. **Demo Mode:**
   - Pre-configured test scenarios
   - One-click testing
   - No backend required for demos

---

## 🎓 Learning Points

### **Why This Tech Stack?**

1. **Python Backend:**
   - Perfect for AI/ML integration
   - FastAPI is modern, fast, and well-documented
   - Type hints improve code quality
   - Async support for scalability

2. **React Frontend:**
   - Industry standard for web UIs
   - Component reusability
   - Large community and resources
   - Easy to maintain and extend

3. **YAML for Rules:**
   - Non-technical users can modify rules
   - Separates business logic from code
   - Version control friendly
   - Easy to read and understand

4. **SQLite Database:**
   - Zero configuration
   - Perfect for development and small deployments
   - Easy to upgrade to PostgreSQL/MySQL later
   - File-based for easy backup

---

## 📊 Code Statistics

| Component | Language | Lines of Code | Files |
|-----------|----------|---------------|-------|
| Backend | Python | ~500+ | 2 |
| Frontend | JavaScript/JSX | ~1000+ | 10+ |
| Styling | CSS | ~500+ | 5+ |
| Rules | YAML | ~200 | 1 |
| Tests | Python | ~300+ | 1 |
| Docs | Markdown | ~2000+ | 10+ |
| Scripts | PowerShell | ~200 | 3 |

**Total:** ~4,700+ lines of code

---

## 🚀 Deployment & Running

### **Development Mode:**

**Backend:**
```bash
cd GeeksforGeeks
python -m uvicorn geeksforgeeks.triage:app --reload --port 8000
```

**Frontend:**
```bash
cd triage-frontend
npm install
npm run dev
```

### **Production Build:**

**Frontend:**
```bash
npm run build
# Creates optimized static files in dist/
```

**Backend:**
```bash
pip install -r requirements.txt
uvicorn geeksforgeeks.triage:app --host 0.0.0.0 --port 8000
```

---

## 🎯 Project Goals Achieved

✅ **Multi-language full-stack application**  
✅ **AI-powered medical triage**  
✅ **Rule-based decision engine**  
✅ **Modern web technologies**  
✅ **Production-ready code**  
✅ **Comprehensive documentation**  
✅ **Automated testing**  
✅ **Deployment ready**  

---

## 📖 Summary

This project demonstrates expertise in:

- **Backend Development** (Python, FastAPI, APIs, Databases)
- **Frontend Development** (React, JavaScript, CSS, UX/UI)
- **Full-Stack Integration** (RESTful APIs, Data flow)
- **AI Integration** (OpenAI GPT)
- **DevOps** (Scripts, Testing, Deployment)
- **Documentation** (Technical writing, User guides)
- **Healthcare Domain** (Medical triage logic)

**Perfect for showcasing:**
- Modern web development skills
- Full-stack capabilities
- Production-ready code quality
- Professional documentation
- Real-world problem solving

---

**Last Updated:** October 3, 2025  
**Status:** Production Ready ✅

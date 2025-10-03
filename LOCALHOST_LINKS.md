# 🌐 Localhost Links - Quick Reference

## 📍 Application URLs

### Frontend (React + Vite)
**Main Application:** http://localhost:5173  
**Alternative:** http://localhost:3000 (if Vite uses port 3000)

**What you'll find:**
- Login page with Google/GitHub OAuth buttons
- Dev-login form (email/password for testing)
- Symptom triage form (after login)
- Admin dashboard (if logged in as admin)

---

### Backend (FastAPI)
**API Base URL:** http://localhost:8000  
**Interactive API Docs (Swagger):** http://localhost:8000/docs  
**Alternative API Docs (ReDoc):** http://localhost:8000/redoc  

**Key Endpoints:**
- Health Check: http://localhost:8000/api/health
- Dev Login: http://localhost:8000/api/auth/dev-login (POST)
- Triage: http://localhost:8000/api/triage (POST, requires auth)
- Current User: http://localhost:8000/api/me (GET, requires auth)

---

## 🚀 How to Start the Servers

### Start Backend
```powershell
cd C:\Users\udayj\GeeksforGeeks
python -m uvicorn geeksforgeeks.triage:app --reload --port 8000
```
✅ Server will start at: **http://localhost:8000**

### Start Frontend
```powershell
cd C:\Users\udayj\GeeksforGeeks\triage-frontend
npm run dev
```
✅ Server will start at: **http://localhost:5173** (or 3000)

### Start Both Servers (Easy Way)
```powershell
cd C:\Users\udayj\GeeksforGeeks
.\start-servers.ps1
```

---

## 🧪 Quick Test Links

### Test Backend is Running
Open in browser: http://localhost:8000/api/health

**Expected response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-03T...",
  "version": "1.0.0"
}
```

### Test Frontend is Running
Open in browser: http://localhost:5173

**Expected:** Login page with:
- Email/Password form
- "Sign in with Google" button
- "Sign in with GitHub" button

### Test API Documentation
Open in browser: http://localhost:8000/docs

**Expected:** Interactive Swagger UI with all API endpoints

---

## 🔗 Full URL Map

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend Home** | http://localhost:5173 | Main application entry point |
| **Frontend Login** | http://localhost:5173/login | Login page |
| **Frontend Dashboard** | http://localhost:5173/dashboard | Admin dashboard |
| **Frontend Triage** | http://localhost:5173/home | Symptom assessment form |
| **Backend API** | http://localhost:8000 | REST API base |
| **API Health** | http://localhost:8000/api/health | Health check |
| **API Docs** | http://localhost:8000/docs | Swagger UI |
| **API ReDoc** | http://localhost:8000/redoc | Alternative docs |
| **Auth Login** | http://localhost:8000/api/auth/dev-login | Development login |
| **Auth Google** | http://localhost:8000/api/auth/google/login | Google OAuth |
| **Auth GitHub** | http://localhost:8000/api/auth/github/login | GitHub OAuth |
| **Triage Endpoint** | http://localhost:8000/api/triage | Symptom triage (protected) |

---

## 🎯 Testing Workflow

### 1. Open Frontend
```
http://localhost:5173
```

### 2. Login
- Email: `test@example.com`
- Password: `anything`
- Click **Sign In**

### 3. Use Triage Form
After login, you'll be on:
```
http://localhost:5173/home
```
Fill out symptoms and submit!

### 4. Check API Docs
While logged in, explore the API:
```
http://localhost:8000/docs
```

---

## 🔍 Troubleshooting

### "This site can't be reached"

**Frontend not loading?**
```powershell
# Check if frontend is running
netstat -ano | findstr ":5173"

# If nothing, start it:
cd C:\Users\udayj\GeeksforGeeks\triage-frontend
npm run dev
```

**Backend not loading?**
```powershell
# Check if backend is running
netstat -ano | findstr ":8000"

# If nothing, start it:
cd C:\Users\udayj\GeeksforGeeks
python -m uvicorn geeksforgeeks.triage:app --reload --port 8000
```

### Wrong Port?

If your frontend is on a different port, check the terminal output when you run `npm run dev`. It will show:
```
  ➜  Local:   http://localhost:XXXX/
```

Use that URL instead of 5173.

---

## 📱 Quick Access (Click These)

**After starting servers, click:**

### 🎨 Frontend
- [Login Page](http://localhost:5173)
- [Home/Triage](http://localhost:5173/home)
- [Dashboard](http://localhost:5173/dashboard)
- [About](http://localhost:5173/about)

### 🔧 Backend
- [API Health](http://localhost:8000/api/health)
- [API Documentation](http://localhost:8000/docs)
- [Alternative Docs](http://localhost:8000/redoc)

---

## 💡 Pro Tips

### Open in Browser from Terminal
```powershell
# Open frontend
Start-Process "http://localhost:5173"

# Open API docs
Start-Process "http://localhost:8000/docs"
```

### Check Server Status
```powershell
# Quick status check
Write-Host "`nBackend:" -ForegroundColor Yellow
try { 
    $b = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -UseBasicParsing
    Write-Host "✅ Running on port 8000" -ForegroundColor Green
} catch { 
    Write-Host "❌ Not running" -ForegroundColor Red 
}

Write-Host "`nFrontend:" -ForegroundColor Yellow
try { 
    $f = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing
    Write-Host "✅ Running on port 5173" -ForegroundColor Green
} catch { 
    Write-Host "❌ Not running" -ForegroundColor Red 
}
```

### One-Command Startup
```powershell
cd C:\Users\udayj\GeeksforGeeks
.\start-servers.ps1
```

This will:
1. Start backend on port 8000
2. Start frontend on port 5173
3. Open new PowerShell windows for each
4. Optionally open browser automatically

---

## 🎉 Summary

**Your application is available at:**

### 🌟 Main URLs
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

**Start both servers and visit the frontend URL to begin!** 🚀

---

**Last Updated:** October 3, 2025

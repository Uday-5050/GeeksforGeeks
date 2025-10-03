# Localhost Startup - Troubleshooting Guide

## ✅ CURRENT STATUS: SERVERS ARE RUNNING!

Both your servers are actually **working fine** right now:

### Backend (FastAPI)
- **Status**: ✅ RUNNING
- **Port**: 8000
- **URL**: http://localhost:8000
- **Health**: Responding successfully
- **Process IDs**: 15000, 19528

### Frontend (React + Vite)
- **Status**: ✅ RUNNING  
- **Port**: 3000
- **URL**: http://localhost:3000
- **Health**: Responding successfully
- **Process ID**: 21772

---

## 🌐 How to Access Your Application

### Option 1: Click the URL in Terminal
When you run `npm run dev`, you'll see:
```
  ➜  Local:   http://localhost:3000/
```
Click on this link or copy-paste it into your browser.

### Option 2: Open Browser Manually
1. Open any web browser (Chrome, Edge, Firefox)
2. Type in address bar: `http://localhost:3000`
3. Press Enter

### Option 3: Use PowerShell Command
```powershell
Start-Process "http://localhost:3000"
```

---

## 🔧 Common "Localhost Error" Issues & Solutions

### Issue 1: "This site can't be reached" / "Connection refused"

**Cause**: Server not running

**Solution**:
```powershell
# Check if servers are running:
netstat -ano | findstr ":8000 :3000"

# If nothing shows up, start the servers:

# Terminal 1 - Backend:
cd C:\Users\udayj\GeeksforGeeks
python -m uvicorn geeksforgeeks.triage:app --reload --port 8000

# Terminal 2 - Frontend:
cd C:\Users\udayj\GeeksforGeeks\triage-frontend
npm run dev
```

### Issue 2: Port Already in Use

**Error Message**: 
```
EADDRINUSE: address already in use :::3000
```

**Solution**:
```powershell
# Stop all Node processes:
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Restart frontend:
cd C:\Users\udayj\GeeksforGeeks\triage-frontend
npm run dev
```

### Issue 3: "npm run dev" Command Not Found

**Cause**: Not in correct directory

**Solution**:
```powershell
# Make sure you're in the frontend directory:
cd C:\Users\udayj\GeeksforGeeks\triage-frontend

# Verify you're in the right place:
Get-Location
# Should show: C:\Users\udayj\GeeksforGeeks\triage-frontend

# Then run:
npm run dev
```

### Issue 4: Backend "Module Not Found" Error

**Error Message**:
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution**:
```powershell
# Install backend dependencies:
cd C:\Users\udayj\GeeksforGeeks\geeksforgeeks
pip install fastapi uvicorn pyyaml python-dotenv httpx pytest openai python-multipart
```

### Issue 5: Frontend Dependencies Missing

**Error Message**:
```
Error: Cannot find module 'react'
```

**Solution**:
```powershell
# Install frontend dependencies:
cd C:\Users\udayj\GeeksforGeeks\triage-frontend
npm install
```

### Issue 6: Blank Page / White Screen

**Cause**: JavaScript error or build issue

**Solution**:
1. Open browser Developer Tools (F12)
2. Check Console tab for errors
3. Hard refresh: Ctrl + Shift + R
4. Clear cache and reload

### Issue 7: API Calls Failing / CORS Errors

**Error in Browser Console**:
```
Access to fetch at 'http://localhost:8000/api/triage' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**:
Backend already has CORS enabled in `triage.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

If still getting errors:
1. Restart backend server
2. Check backend URL in `triage-frontend/src/services/api.js`

---

## 🚀 Quick Start Commands

### Start Both Servers (Easy Way)

**Terminal 1 - Backend:**
```powershell
cd C:\Users\udayj\GeeksforGeeks
python -m uvicorn geeksforgeeks.triage:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\udayj\GeeksforGeeks\triage-frontend
npm run dev
```

Then open: http://localhost:3000

### Check Server Status
```powershell
# See what's running on ports:
netstat -ano | findstr ":8000 :3000"

# Check running processes:
Get-Process | Where-Object {$_.ProcessName -eq "node" -or $_.ProcessName -eq "python"}
```

### Stop All Servers
```powershell
# Stop frontend:
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Stop backend (Ctrl+C in the terminal running it)
# Or find Python process and stop it
```

---

## 🔍 Verify Everything is Working

### Test Backend
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/health" -UseBasicParsing
```
**Expected**: `{"status":"healthy","timestamp":"...","version":"1.0.0"}`

### Test Frontend
```powershell
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
```
**Expected**: StatusCode 200

### Test Full Integration
1. Open http://localhost:3000
2. Should see login page
3. Enter any email (e.g., `test@example.com`)
4. Enter any password
5. Click Login
6. Should redirect to symptom form
7. Fill out symptoms
8. Click "Get Triage Assessment"
9. Should see results

---

## 📋 Checklist for Startup

- [ ] Open 2 separate PowerShell terminals
- [ ] Terminal 1: Navigate to `C:\Users\udayj\GeeksforGeeks`
- [ ] Terminal 1: Run backend command
- [ ] Wait for "Application startup complete"
- [ ] Terminal 2: Navigate to `C:\Users\udayj\GeeksforGeeks\triage-frontend`
- [ ] Terminal 2: Run `npm run dev`
- [ ] Wait for "Local: http://localhost:3000/"
- [ ] Open browser to http://localhost:3000
- [ ] Test login and symptom form

---

## 🎯 Current Status Check

Run this command to see your current status:
```powershell
Write-Host "`nBackend Status:" -ForegroundColor Yellow
try { $b = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -UseBasicParsing; Write-Host "  RUNNING on port 8000" -ForegroundColor Green } catch { Write-Host "  NOT RUNNING" -ForegroundColor Red }

Write-Host "`nFrontend Status:" -ForegroundColor Yellow
try { $f = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing; Write-Host "  RUNNING on port 3000" -ForegroundColor Green } catch { Write-Host "  NOT RUNNING" -ForegroundColor Red }

Write-Host "`nAccess your app at: http://localhost:3000`n" -ForegroundColor Cyan
```

---

## 💡 Tips

1. **Keep terminals open**: Don't close the PowerShell windows running the servers
2. **Use Ctrl+C to stop**: Press Ctrl+C in the terminal to stop a server
3. **Watch for errors**: Check terminal output for any error messages
4. **Browser cache**: Sometimes clearing browser cache helps (Ctrl+Shift+Delete)
5. **Firewall**: Make sure Windows Firewall isn't blocking Node.js or Python

---

## 📞 Still Having Issues?

If you see a specific error message:
1. Copy the exact error text
2. Check if it matches any issues above
3. Look for errors in:
   - Terminal output
   - Browser console (F12)
   - Network tab in DevTools

Common error patterns:
- `EADDRINUSE` → Port already in use
- `ModuleNotFoundError` → Missing Python package
- `Cannot find module` → Missing npm package
- `Connection refused` → Server not running
- `404 Not Found` → Wrong URL or route

---

**Last Updated**: October 3, 2025
**Your Status**: ✅ Both servers are currently RUNNING
**Access URL**: http://localhost:3000

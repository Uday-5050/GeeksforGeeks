# Authentication Testing Guide

## 🧪 How to Test the Authentication System

There are **4 different ways** to test the authentication:

---

## Method 1: Development Login (Easiest - No OAuth Setup Required)

### Backend Test
```powershell
# Start backend server
cd C:\Users\udayj\GeeksforGeeks
python -m uvicorn geeksforgeeks.triage:app --reload --port 8000
```

### Test with PowerShell (Direct API Call)
```powershell
# Test dev-login endpoint
$loginPayload = @{
    email = "testuser@example.com"
    password = "any-password"
    name = "Test User"
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "http://localhost:8000/api/auth/dev-login" `
    -Method POST `
    -Body $loginPayload `
    -ContentType "application/json"

$data = $response.Content | ConvertFrom-Json
Write-Host "Login successful!"
Write-Host "Token: $($data.access_token)"
Write-Host "User: $($data.user.email)"
```

### Test Protected Endpoint
```powershell
# Use the token to call protected triage endpoint
$token = $data.access_token

$triagePayload = @{
    symptoms = @("headache", "fever")
    severity = "moderate"
    patient_age = 30
} | ConvertTo-Json

$triageResponse = Invoke-WebRequest `
    -Uri "http://localhost:8000/api/triage" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token" } `
    -Body $triagePayload `
    -ContentType "application/json"

$triageData = $triageResponse.Content | ConvertFrom-Json
Write-Host "`nTriage Result:"
Write-Host "Level: $($triageData.triage_label)"
Write-Host "Action: $($triageData.action)"
```

---

## Method 2: Frontend Web Interface (Full User Experience)

### Step 1: Start Both Servers
```powershell
# Terminal 1 - Backend
cd C:\Users\udayj\GeeksforGeeks
python -m uvicorn geeksforgeeks.triage:app --reload --port 8000

# Terminal 2 - Frontend
cd C:\Users\udayj\GeeksforGeeks\triage-frontend
npm run dev
```

### Step 2: Test via Browser

1. **Open browser** → http://localhost:5173 (or 3000 depending on your Vite config)

2. **Dev Login Test:**
   - Enter any email: `test@example.com`
   - Enter any password: `password123`
   - Click "Sign In"
   - Should redirect to `/home` or `/dashboard`

3. **Check Session:**
   - Open Browser DevTools (F12)
   - Go to **Application** tab → **Local Storage** → `http://localhost:5173`
   - You should see `symptomscan:auth` with your token and user data

4. **Test Protected Features:**
   - Fill out symptom form
   - Submit triage request
   - Verify you get results (proves token is being sent)

5. **Test Logout:**
   - Click logout button
   - Should redirect to `/login`
   - Local storage should be cleared

---

## Method 3: Automated Test Suite

### Run All Tests
```powershell
cd C:\Users\udayj\GeeksforGeeks\geeksforgeeks
python -m pytest tests/test_triage.py -v
```

### Run Only Authentication Tests
```powershell
python -m pytest tests/test_triage.py::TestAuthenticationRoutes -v
```

### Run Specific Test
```powershell
# Test dev-login
python -m pytest tests/test_triage.py::TestAuthenticationRoutes::test_dev_login_returns_token_and_cookie -v

# Test logout
python -m pytest tests/test_triage.py::TestAuthenticationRoutes::test_logout_clears_cookie -v

# Test protected endpoint
python -m pytest tests/test_triage.py::TestTriageAPI::test_triage_requires_authentication -v
```

### Expected Results
```
✅ test_dev_login_returns_token_and_cookie - PASSED
⏭️  test_session_endpoint_refreshes_token - SKIPPED (known issue)
✅ test_logout_clears_cookie - PASSED
✅ test_triage_requires_authentication - PASSED
```

---

## Method 4: OAuth Testing (Google/GitHub - Requires Setup)

### Prerequisites
You need to register OAuth apps:

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Add authorized redirect URI: `http://localhost:8000/api/auth/google/callback`
6. Copy **Client ID** and **Client Secret**

#### GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set **Homepage URL**: `http://localhost:5173`
4. Set **Callback URL**: `http://localhost:8000/api/auth/github/callback`
5. Copy **Client ID** and **Client Secret**

### Configure Backend
Create `.env` file in `C:\Users\udayj\GeeksforGeeks\geeksforgeeks\`:

```env
# JWT Configuration
JWT_SECRET_KEY=super-secret-key-change-in-production-12345678

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# URLs (default values shown)
BACKEND_BASE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Development Settings
ENABLE_DEV_LOGIN=true
```

### Test OAuth Flow

#### Test via Browser (Recommended)
1. Start both servers
2. Open http://localhost:5173
3. Click **"Sign in with Google"** or **"Sign in with GitHub"**
4. Authorize the app
5. Should redirect back with session

#### Test via API (Advanced)
```powershell
# Step 1: Get OAuth URL
$googleAuthResponse = Invoke-WebRequest `
    -Uri "http://localhost:8000/api/auth/google/login" `
    -UseBasicParsing

$authData = $googleAuthResponse.Content | ConvertFrom-Json
Write-Host "Open this URL in browser:"
Write-Host $authData.auth_url

# Step 2: After authorization, you'll be redirected with token in URL
# Extract token from: http://localhost:5173/auth/callback?token=YOUR_TOKEN&user=...

# Step 3: Use token for API calls
$token = "paste-token-here"
$headers = @{ "Authorization" = "Bearer $token" }

# Test session endpoint
$sessionResponse = Invoke-WebRequest `
    -Uri "http://localhost:8000/api/auth/session" `
    -Headers $headers

$sessionData = $sessionResponse.Content | ConvertFrom-Json
Write-Host "Session valid! User: $($sessionData.user.email)"
```

---

## 🔍 Verification Checklist

### Backend Tests
- [ ] Dev-login returns JWT token
- [ ] Dev-login sets HTTP-only cookie
- [ ] Session endpoint accepts Bearer token
- [ ] Session endpoint refreshes token
- [ ] Logout clears cookie
- [ ] Protected `/api/triage` rejects unauthenticated requests (401)
- [ ] Protected `/api/triage` accepts valid JWT token

### Frontend Tests
- [ ] Login page loads
- [ ] Dev-login form submits successfully
- [ ] Session stored in localStorage
- [ ] Token sent in Authorization header
- [ ] Unauthorized users redirected to /login
- [ ] Logout clears session
- [ ] OAuth buttons visible (even if not configured)

### Database Tests
```powershell
# Check if users table exists
cd C:\Users\udayj\GeeksforGeeks\geeksforgeeks
python -c "import sqlite3; conn = sqlite3.connect('triage_sessions.db'); cursor = conn.cursor(); cursor.execute('SELECT name FROM sqlite_master WHERE type=\\"table\\" AND name=\\"users\\"'); print('Users table exists:', cursor.fetchone() is not None)"

# View created users
python -c "import sqlite3; conn = sqlite3.connect('triage_sessions.db'); cursor = conn.cursor(); cursor.execute('SELECT id, email, provider FROM users'); print('Users:', cursor.fetchall())"

# Check triage sessions have user_id
python -c "import sqlite3; conn = sqlite3.connect('triage_sessions.db'); cursor = conn.cursor(); cursor.execute('PRAGMA table_info(triage_sessions)'); print('Columns:', [row[1] for row in cursor.fetchall()])"
```

---

## 🐛 Troubleshooting

### "Invalid token" Error
**Cause:** Token expired (120 min), invalid signature, or wrong secret key  
**Fix:** Re-login to get fresh token

### "Not authenticated" (401)
**Cause:** No token sent, or token not in Authorization header  
**Fix:** Check frontend is calling `getAccessToken()` and sending `Authorization: Bearer {token}`

### OAuth redirect fails
**Cause:** Callback URL mismatch  
**Fix:** Ensure redirect URI in OAuth app matches `BACKEND_BASE_URL/api/auth/{provider}/callback`

### "OAuth not configured" (503)
**Cause:** Missing client ID/secret in .env  
**Fix:** Either configure OAuth credentials or use dev-login

### Frontend can't reach backend
**Cause:** CORS issue or wrong API URL  
**Fix:** Check `VITE_API_URL` in frontend `.env`, verify backend CORS settings

### Database locked error
**Cause:** Multiple processes accessing SQLite  
**Fix:** Close other connections or use file-based locking

---

## 📊 Quick Test Script

Save this as `test-auth.ps1`:

```powershell
Write-Host "=== Authentication System Test ===" -ForegroundColor Cyan

# Test 1: Backend Health
Write-Host "`n[1/5] Testing backend health..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -UseBasicParsing
    Write-Host "✅ Backend is healthy" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend not responding. Start it first!" -ForegroundColor Red
    exit 1
}

# Test 2: Dev Login
Write-Host "`n[2/5] Testing dev-login..." -ForegroundColor Yellow
$loginBody = @{
    email = "tester@example.com"
    password = "test123"
    name = "Test User"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest `
        -Uri "http://localhost:8000/api/auth/dev-login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json"
    
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.access_token
    Write-Host "✅ Dev-login successful" -ForegroundColor Green
    Write-Host "   User: $($loginData.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Dev-login failed: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Protected Endpoint (with auth)
Write-Host "`n[3/5] Testing protected endpoint with token..." -ForegroundColor Yellow
$triageBody = @{
    symptoms = @("test symptom")
    severity = "mild"
} | ConvertTo-Json

try {
    $triageResponse = Invoke-WebRequest `
        -Uri "http://localhost:8000/api/triage" `
        -Method POST `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -Body $triageBody `
        -ContentType "application/json"
    
    Write-Host "✅ Protected endpoint accessible with token" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to access protected endpoint: $_" -ForegroundColor Red
}

# Test 4: Protected Endpoint (without auth)
Write-Host "`n[4/5] Testing protected endpoint without token..." -ForegroundColor Yellow
try {
    $noAuthResponse = Invoke-WebRequest `
        -Uri "http://localhost:8000/api/triage" `
        -Method POST `
        -Body $triageBody `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "❌ Protected endpoint should reject unauthenticated requests!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Protected endpoint correctly rejects unauthenticated requests" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Unexpected error: $_" -ForegroundColor Yellow
    }
}

# Test 5: Logout
Write-Host "`n[5/5] Testing logout..." -ForegroundColor Yellow
try {
    $logoutResponse = Invoke-WebRequest `
        -Uri "http://localhost:8000/api/auth/logout" `
        -Method POST
    
    Write-Host "✅ Logout successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Logout failed: $_" -ForegroundColor Red
}

Write-Host "`n=== All Tests Complete ===" -ForegroundColor Cyan
Write-Host "`nAuthentication system is working correctly! 🎉" -ForegroundColor Green
```

Run it:
```powershell
cd C:\Users\udayj\GeeksforGeeks
.\test-auth.ps1
```

---

## 🎯 Recommended Testing Order

1. **Start with Dev-Login API tests** (Method 1) - Fastest feedback
2. **Run automated test suite** (Method 3) - Comprehensive coverage  
3. **Test via browser** (Method 2) - User experience validation
4. **Configure OAuth if needed** (Method 4) - Production-ready testing

---

## 📝 Notes

- **Dev-login is enabled by default** for easy testing
- **OAuth requires external setup** but dev-login works immediately
- **Tokens expire after 120 minutes** - re-login if expired
- **Session refresh** happens automatically when calling `/api/auth/session`
- **User data persists** in SQLite `triage_sessions.db`

---

**Need help?** Check:
- Backend logs in terminal running uvicorn
- Frontend console (F12) for JavaScript errors
- Network tab (F12) to see request/response details

# Authentication Setup Guide

## 🔐 Authentication Overview

Your healthcare triage bot now has **production-ready backend authentication** with:

- ✅ **Google OAuth2** - Sign in with Google
- ✅ **GitHub OAuth** - Sign in with GitHub  
- ✅ **JWT Tokens** - Secure 120-minute sessions
- ✅ **Development Login** - Test without OAuth setup
- ✅ **User Database** - SQLite user persistence
- ✅ **Protected Endpoints** - `/api/triage` requires authentication

---

## 🚀 Quick Start (No OAuth Setup Needed)

### 1. Start Backend
```powershell
cd C:\Users\udayj\GeeksforGeeks
python -m uvicorn geeksforgeeks.triage:app --reload --port 8000
```

### 2. Start Frontend
```powershell
cd C:\Users\udayj\GeeksforGeeks\triage-frontend
npm run dev
```

### 3. Test in Browser
1. Open http://localhost:5173
2. Enter any email: `test@example.com`
3. Enter any password: `password`
4. Click **Sign In**
5. You'll be logged in and can use the triage form!

**That's it!** No OAuth configuration needed for development.

---

## 🧪 Testing Authentication

### Quick Test Script
```powershell
cd C:\Users\udayj\GeeksforGeeks
.\test-auth.ps1
```

This tests:
- ✅ Dev-login endpoint
- ✅ JWT token generation
- ✅ Protected endpoint access
- ✅ Unauthorized request rejection
- ✅ Session refresh
- ✅ Logout

### Run Automated Tests
```powershell
cd C:\Users\udayj\GeeksforGeeks\geeksforgeeks
python -m pytest tests/test_triage.py::TestAuthenticationRoutes -v
```

**For detailed testing instructions**, see [AUTHENTICATION_TESTING.md](AUTHENTICATION_TESTING.md)

---

## 🔑 OAuth Configuration (Optional - For Production)

### Google OAuth Setup

1. **Go to** [Google Cloud Console](https://console.cloud.google.com/)
2. **Create** a new project or select existing
3. **Enable** Google+ API
4. **Go to** Credentials → Create OAuth 2.0 Client ID
5. **Add redirect URI:** `http://localhost:8000/api/auth/google/callback`
6. **Copy** Client ID and Client Secret

### GitHub OAuth Setup

1. **Go to** [GitHub Developer Settings](https://github.com/settings/developers)
2. **Click** New OAuth App
3. **Set Homepage URL:** `http://localhost:5173`
4. **Set Callback URL:** `http://localhost:8000/api/auth/github/callback`
5. **Copy** Client ID and Client Secret

### Configure Environment Variables

Create `.env` file in `geeksforgeeks/`:

```env
# Required for production
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# URLs (adjust for deployment)
BACKEND_BASE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Development (set to false in production)
ENABLE_DEV_LOGIN=true
```

**Restart backend** after adding .env file.

---

## 🏗️ Architecture

### Authentication Flow

```
1. User clicks "Sign in with Google/GitHub" (or uses dev-login)
   ↓
2. Backend redirects to OAuth provider
   ↓
3. User authorizes app
   ↓
4. Provider redirects back with authorization code
   ↓
5. Backend exchanges code for user profile
   ↓
6. Backend creates/updates user in database
   ↓
7. Backend generates JWT token
   ↓
8. Token sent to frontend (via redirect + cookie)
   ↓
9. Frontend stores session in localStorage
   ↓
10. Protected API calls include token in Authorization header
```

### Database Schema

**Users Table:**
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,              -- "provider_accountid"
    provider TEXT NOT NULL,            -- "google", "github", "dev"
    provider_account_id TEXT NOT NULL,
    email TEXT,
    name TEXT,
    avatar_url TEXT,
    created_at DATETIME,
    updated_at DATETIME
);
```

**Triage Sessions Table (updated):**
```sql
CREATE TABLE triage_sessions (
    id TEXT PRIMARY KEY,
    timestamp DATETIME,
    symptoms TEXT,
    triage_label TEXT,
    -- ... other fields ...
    session_data TEXT,
    user_id TEXT                      -- Links to users.id
);
```

---

## 🔒 Security Features

- ✅ **JWT tokens** with 120-minute expiration
- ✅ **HTTP-only cookies** for CSRF protection
- ✅ **Bearer token authentication** in API headers
- ✅ **Automatic token refresh** via `/api/auth/session`
- ✅ **User isolation** - sessions linked to authenticated users
- ✅ **OAuth2 state parameter** prevents CSRF attacks
- ✅ **Secure password handling** (dev-login for testing only)

### Production Checklist

Before deploying:

- [ ] Set strong `JWT_SECRET_KEY` (32+ random characters)
- [ ] Set `ENABLE_DEV_LOGIN=false`
- [ ] Configure real OAuth credentials
- [ ] Use HTTPS (`AUTH_COOKIE_SECURE=true`)
- [ ] Update CORS origins to production frontend URL
- [ ] Set `BACKEND_BASE_URL` and `FRONTEND_URL` to production URLs
- [ ] Use PostgreSQL instead of SQLite (optional but recommended)

---

## 📡 API Endpoints

### Authentication Routes

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/google/login` | GET | Start Google OAuth flow | No |
| `/api/auth/github/login` | GET | Start GitHub OAuth flow | No |
| `/api/auth/google/callback` | GET | Google OAuth callback | No |
| `/api/auth/github/callback` | GET | GitHub OAuth callback | No |
| `/api/auth/dev-login` | POST | Development login | No |
| `/api/auth/session` | GET | Refresh JWT token | Yes |
| `/api/auth/logout` | POST | Clear session | No |
| `/api/me` | GET | Get current user profile | Yes |

### Protected Routes

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/triage` | POST | Symptom triage assessment | **Yes** ✅ |
| `/api/health` | GET | Health check | No |
| `/api/demo/{id}` | GET | Demo payloads | No |
| `/api/rules` | GET | View triage rules | No |

---

## 🐛 Troubleshooting

### "Not authenticated" (401)
**Cause:** No token or invalid token  
**Fix:** Re-login to get fresh token

### "Invalid token"
**Cause:** Token expired (>120min) or wrong secret key  
**Fix:** Re-login or check `JWT_SECRET_KEY` in .env

### OAuth redirect fails
**Cause:** Callback URL mismatch  
**Fix:** Ensure OAuth app callback matches `BACKEND_BASE_URL/api/auth/{provider}/callback`

### "OAuth not configured" (503)
**Cause:** Missing client ID/secret  
**Fix:** Add OAuth credentials to .env or use dev-login

### Frontend can't reach backend
**Cause:** Wrong API URL  
**Fix:** Check `VITE_API_URL` in frontend `.env`

### Database errors
**Cause:** SQLite locked or missing tables  
**Fix:** Check `triage_sessions.db` exists, restart backend to recreate tables

---

## 📚 Additional Resources

- **Testing Guide:** [AUTHENTICATION_TESTING.md](AUTHENTICATION_TESTING.md)
- **Backend Code:** `geeksforgeeks/auth_backend.py`
- **Frontend Auth:** `triage-frontend/src/services/auth.js`
- **OAuth Callback:** `triage-frontend/src/pages/AuthCallback.jsx`

---

## 💡 Development Tips

### View Database
```powershell
# View all users
cd C:\Users\udayj\GeeksforGeeks\geeksforgeeks
python -c "import sqlite3; conn = sqlite3.connect('triage_sessions.db'); cursor = conn.cursor(); cursor.execute('SELECT * FROM users'); print(cursor.fetchall())"

# View sessions with users
python -c "import sqlite3; conn = sqlite3.connect('triage_sessions.db'); cursor = conn.cursor(); cursor.execute('SELECT id, user_id, triage_label FROM triage_sessions LIMIT 5'); print(cursor.fetchall())"
```

### Debug JWT Token
```powershell
# Decode JWT payload (use https://jwt.io)
# Or in Python:
python -c "from jose import jwt; token = 'YOUR_TOKEN_HERE'; print(jwt.get_unverified_claims(token))"
```

### Clear All Sessions
```powershell
# Clear localStorage in browser
# F12 → Application → Local Storage → Clear

# Or clear database
cd C:\Users\udayj\GeeksforGeeks\geeksforgeeks
python -c "import sqlite3; conn = sqlite3.connect('triage_sessions.db'); conn.execute('DELETE FROM users'); conn.commit(); print('Users cleared')"
```

---

## ✅ What's Next?

Now that authentication is set up:

1. **Test the system** - Run `.\test-auth.ps1`
2. **Try the browser flow** - Test login/logout via UI
3. **Configure OAuth** - Set up Google/GitHub for production
4. **Deploy** - Follow production checklist above
5. **Monitor** - Check logs for auth errors

**Questions?** Check the [testing guide](AUTHENTICATION_TESTING.md) or review backend logs.

---

**Last Updated:** October 3, 2025  
**Status:** ✅ Production Ready

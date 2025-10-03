# Google OAuth Setup Guide

## Quick Summary
Your app is currently in **Development Mode** - the email login works perfectly for testing! Google/GitHub OAuth buttons are optional and require external setup with Google Cloud Console.

## Current Status ✅
- ✅ Email/Password Login (Dev Mode) - **Working Now!**
- ⚠️ Google OAuth - Requires setup (optional)
- ⚠️ GitHub OAuth - Requires setup (optional)

## For Testing Right Now
Just use the email login:
- Email: `test@example.com` (or any email)
- Password: `anything` (dev mode accepts any password)

---

## Setting Up Google OAuth (Optional)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name: `SymptomScan` (or your choice)
4. Click **Create**

### Step 2: Enable Google+ API
1. In the left menu, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and click **Enable**

### Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (for testing) or **Internal** (if using Google Workspace)
3. Click **Create**
4. Fill in required fields:
   - **App name**: SymptomScan
   - **User support email**: your email
   - **Developer contact**: your email
5. Click **Save and Continue**
6. Skip **Scopes** (click Save and Continue)
7. Add test users if using External type:
   - Click **Add Users**
   - Enter email addresses that can test the login
   - Click **Save and Continue**
8. Click **Back to Dashboard**

### Step 4: Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Application type**: **Web application**
4. Enter **Name**: `SymptomScan Local Development`
5. Under **Authorized redirect URIs**, click **Add URI**:
   ```
   http://localhost:8000/api/auth/google/callback
   ```
6. Click **Create**
7. **IMPORTANT**: Copy your credentials:
   - **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-abc123...`)

### Step 5: Update Backend Configuration
1. Open `geeksforgeeks\.env` file
2. Uncomment and fill in the Google OAuth lines:
   ```env
   GOOGLE_CLIENT_ID=your_actual_client_id_here
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
   ```
3. Save the file

### Step 6: Restart Backend Server
1. Stop the backend server (Ctrl+C in the terminal)
2. Restart it:
   ```powershell
   python -m uvicorn geeksforgeeks.triage:app --reload --port 8000
   ```

### Step 7: Test Google Login
1. Go to http://localhost:3000
2. Click the **Google** button
3. You should be redirected to Google's login page
4. Sign in with a test user email
5. You'll be redirected back to your app!

---

## Troubleshooting

### "Failed to fetch data" Error
- ✅ **This is expected** if you haven't set up Google OAuth credentials yet
- ℹ️ Just use the email login instead - it works perfectly!

### "Error 400: redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches:
  ```
  http://localhost:8000/api/auth/google/callback
  ```
- No trailing slash, use `http://` not `https://` for localhost

### "Access blocked: This app is not verified"
- This is normal for development
- Click **Advanced** → **Go to SymptomScan (unsafe)**
- Or add your email as a test user in OAuth consent screen

### "Error 401: invalid_client"
- Check that Client ID and Secret are copied correctly
- No extra spaces or quotes in the `.env` file

---

## Production Deployment Notes

When deploying to production (not localhost):

1. Update redirect URIs in Google Console:
   ```
   https://yourdomain.com/api/auth/google/callback
   ```

2. Update `.env` file:
   ```env
   GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
   BACKEND_BASE_URL=https://yourdomain.com
   FRONTEND_URL=https://yourdomain.com
   AUTH_COOKIE_SECURE=true
   ENABLE_DEV_LOGIN=false
   ```

3. Publish your OAuth consent screen (if using External type)

---

## Need Help?

- 📖 See `AUTHENTICATION_SETUP.md` for complete setup guide
- 🧪 See `AUTHENTICATION_TESTING.md` for testing methods
- 🔗 See `LOCALHOST_LINKS.md` for all app URLs

**Remember**: Email login works perfectly for development - OAuth is completely optional! 🎉

# 🔧 DEBUGGING GUIDE - "Failed to get triage assessment" Error

## 🎯 What's Happening

You're seeing this error: **"Failed to get triage assessment. Please check your connection and try again."**

This means the Gemini API call is failing. Let's debug step by step!

---

## 📋 Debugging Steps

### **Step 1: Check Browser Console** 🔍

1. Open your browser (http://localhost:3000)
2. Press **F12** to open Developer Tools
3. Click the **Console** tab
4. Refresh the page
5. Look for these messages:

**✅ If you see:**
```
🔑 Gemini API Key status: Loaded ✅
🔑 API Key length: 39 characters
🔑 API Key starts with: AIzaSyCt-l...
✅ Gemini AI model initialized successfully
```
→ API key is loaded correctly!

**❌ If you see:**
```
🔑 Gemini API Key status: Missing ❌
⚠️ VITE_GEMINI_API_KEY not found in environment variables
```
→ API key is NOT loaded. Go to Step 2.

---

### **Step 2: Verify .env File** 📄

Check that your `.env` file exists and has the correct content:

**Location:** `triage-frontend/.env`

**Should contain:**
```env
VITE_GEMINI_API_KEY=AIzaSyCt-ldaiPCLO1DaOM1q4JKp7UyzvBbBaUk
```

**Common Issues:**
- ❌ Extra spaces around the `=` sign
- ❌ Quotes around the API key
- ❌ File named `.env.example` instead of `.env`
- ❌ File in wrong directory

**Correct Format:**
```env
VITE_GEMINI_API_KEY=AIzaSyCt-ldaiPCLO1DaOM1q4JKp7UyzvBbBaUk
```

**Wrong Formats:**
```env
VITE_GEMINI_API_KEY = AIzaSyCt-ldaiPCLO1DaOM1q4JKp7UyzvBbBaUk  ❌ (spaces)
VITE_GEMINI_API_KEY="AIzaSyCt-ldaiPCLO1DaOM1q4JKp7UyzvBbBaUk"  ❌ (quotes)
```

---

### **Step 3: Restart Dev Server** 🔄

Vite only reads `.env` files on startup!

**Windows PowerShell:**
```powershell
# Stop the server (Ctrl+C in the terminal)
# Then restart:
npm run dev
```

**Alternative (force restart):**
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
npm run dev
```

---

### **Step 4: Test the API Key** 🧪

Open this file in your browser to test the API key directly:

**File:** `triage-frontend/test-gemini.html`

**Or visit:**
```
file:///C:/Users/saran/Desktop/hackathon/GeeksforGeeks/triage-frontend/test-gemini.html
```

**Expected Results:**

✅ **Success:**
```
✅ SUCCESS!
API Key: Valid ✅
Model: gemini-2.0-flash-exp ✅
Response received ✅
```

❌ **API Key Invalid:**
```
❌ ERROR
Error: API_KEY_INVALID
```
→ Get a new API key from https://aistudio.google.com/app/apikey

❌ **Rate Limit:**
```
❌ ERROR
Error: RESOURCE_EXHAUSTED
```
→ Wait 1 minute and try again

---

### **Step 5: Check Network Tab** 🌐

In Browser Developer Tools:

1. Go to **Network** tab
2. Submit the symptom form
3. Look for requests to `generativelanguage.googleapis.com`

**If you see:**
- Status 200 → API call succeeded ✅
- Status 400 → Bad request (API key or format issue) ❌
- Status 401 → Unauthorized (invalid API key) ❌
- Status 403 → Forbidden (API key doesn't have permissions) ❌
- Status 429 → Rate limit exceeded ⚠️

---

## 🐛 Common Issues & Solutions

### Issue 1: API Key Not Loading
**Symptom:** Console shows "Missing ❌"

**Solution:**
1. Verify `.env` file exists in `triage-frontend/` folder
2. Check file name is exactly `.env` (not `.env.txt` or `.env.example`)
3. Restart dev server with `npm run dev`
4. Hard refresh browser (Ctrl + Shift + R)

---

### Issue 2: Invalid API Key
**Symptom:** Error "API_KEY_INVALID"

**Solutions:**

**A. Verify the key is correct:**
```
Your key: AIzaSyCt-ldaiPCLO1DaOM1q4JKp7UyzvBbBaUk
Should start with: AIza
Should be 39 characters long
```

**B. Get a new key:**
1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the new key
4. Update `.env` file
5. Restart server

---

### Issue 3: Model Not Found
**Symptom:** Error "model not found" or "gemini-2.0-flash-exp"

**Solution:** Try using a different model:

Edit `src/services/gemini.js`:
```javascript
// Change this:
model: "gemini-2.0-flash-exp"

// To this:
model: "gemini-1.5-flash"
```

---

### Issue 4: CORS Error
**Symptom:** Console shows "CORS policy" error

**Solution:** This shouldn't happen with the Gemini API, but if it does:
1. API key might be restricted to certain domains
2. Check API key settings in Google AI Studio
3. Remove any domain restrictions

---

### Issue 5: Rate Limit Exceeded
**Symptom:** Error "RESOURCE_EXHAUSTED" or 429 status

**Solution:**
- Wait 1 minute before trying again
- Free tier: 60 requests/minute
- Check usage: https://aistudio.google.com/app/apikey

---

## 🔍 Debug Logs to Check

When you submit the form, you should see these logs in console:

**Normal Flow:**
```
1. 🤖 Using Gemini AI for analysis...
2. 🤖 Sending request to Gemini AI...
3. ✅ Received response from Gemini AI
4. 📝 Parsing AI response...
5. ✅ Gemini analysis successful
```

**If it fails, you'll see:**
```
❌ Gemini API error: [error details]
Error details: [specific message]
⚠️ Gemini analysis failed, falling back to backend
```

---

## 🛠️ Quick Fix Commands

### Verify .env file exists:
```powershell
Get-Content "C:\Users\saran\Desktop\hackathon\GeeksforGeeks\triage-frontend\.env"
```

### Check if API key is in the file:
```powershell
Select-String -Path "C:\Users\saran\Desktop\hackathon\GeeksforGeeks\triage-frontend\.env" -Pattern "VITE_GEMINI_API_KEY"
```

### Force restart everything:
```powershell
# Stop all Node processes
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Navigate to project
Set-Location "C:\Users\saran\Desktop\hackathon\GeeksforGeeks\triage-frontend"

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Start dev server
npm run dev
```

---

## 📊 Verification Checklist

Before testing again, verify:

- [ ] `.env` file exists in `triage-frontend/` folder
- [ ] File contains: `VITE_GEMINI_API_KEY=AIzaSyCt-ldaiPCLO1DaOM1q4JKp7UyzvBbBaUk`
- [ ] No extra spaces or quotes
- [ ] Dev server restarted after adding key
- [ ] Browser console open (F12)
- [ ] Hard refresh done (Ctrl + Shift + R)

---

## 🎯 Test Cases

### Test 1: Simple Symptom
**Input:**
```
Description: "I have a headache"
Age: 25
Severity: Mild
```

**Expected:** Should work!

### Test 2: Complex Symptom
**Input:**
```
Description: "Severe chest pain, difficulty breathing, sweating"
Symptoms: Check "Chest Pain" + "Breathlessness"
Age: 55
Severity: Severe
```

**Expected:** EMERGENCY triage level

---

## 🆘 Still Not Working?

### Try these in order:

1. **Test with HTML file:**
   - Open `test-gemini.html` in browser
   - Click "Test Gemini API" button
   - See if that works

2. **Check API key validity:**
   - Visit: https://aistudio.google.com/app/apikey
   - See if your key is listed
   - Try creating a new key

3. **Check browser console for specific error:**
   - Look for exact error message
   - Google the specific error code
   - Check Gemini API status

4. **Verify model availability:**
   - Some models might be region-restricted
   - Try: `gemini-1.5-flash` instead of `gemini-2.0-flash-exp`

---

## 📞 Where to Get Help

1. **Gemini API Status:**
   - https://status.cloud.google.com/

2. **Community Forum:**
   - https://discuss.ai.google.dev/c/gemini-api/

3. **Documentation:**
   - https://ai.google.dev/gemini-api/docs/troubleshooting

4. **API Key Issues:**
   - Check: https://aistudio.google.com/app/apikey

---

## 💡 Pro Tips

### Enable Verbose Logging:

Add this to `gemini.js`:
```javascript
console.log('Full payload:', JSON.stringify(symptomsData, null, 2));
console.log('Generated prompt:', prompt);
```

### Check Environment Variables in Browser:

Press F12, then type in console:
```javascript
import.meta.env.VITE_GEMINI_API_KEY
```

Should show your API key (or undefined if not loaded)

---

## ✅ Success Indicators

You'll know it's working when you see:

1. ✅ Purple "AI-Powered Diagnosis Active" banner
2. ✅ Console logs: "🤖 Using Gemini AI..."
3. ✅ Results show "AI-Powered Analysis" badge
4. ✅ Response takes 2-3 seconds
5. ✅ Detailed, intelligent recommendations

---

**Good luck! The API key looks valid, so it should work after a proper restart! 🚀**

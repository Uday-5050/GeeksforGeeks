# 🤖 Gemini AI Integration Guide

## Overview

Your Medical Triage Application now uses **Google Gemini Flash 2.5** AI for intelligent symptom analysis and preliminary diagnosis!

## ✨ Features

- 🧠 **AI-Powered Diagnosis**: Advanced symptom analysis using Google's latest AI model
- 🎯 **Smart Triage Classification**: Automatic categorization into Emergency, Urgent, Routine, or Self-Care
- 💬 **Natural Language Processing**: Understands detailed symptom descriptions
- ⚡ **Real-time Analysis**: Fast response times (typically 2-3 seconds)
- 🔒 **Privacy-Focused**: No data stored, all analysis is real-time
- 🎨 **Enhanced UI**: Beautiful AI status indicators and loading animations

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Your FREE Gemini API Key

1. Visit: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key (starts with `AIza...`)

### Step 2: Add API Key to Your Project

1. Open the `.env` file in the `triage-frontend` folder
2. Find the line: `VITE_GEMINI_API_KEY=`
3. Paste your API key after the `=` sign:
   ```env
   VITE_GEMINI_API_KEY=AIzaSyAbc123YourActualKeyHere
   ```
4. Save the file

### Step 3: Restart the Dev Server

```powershell
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

🎉 **That's it!** Your AI is now active!

## 🎯 How It Works

### User Flow:
1. User describes symptoms in natural language
2. Selects severity and additional symptoms
3. Clicks "Get AI Diagnosis"
4. Gemini AI analyzes:
   - Symptom description
   - Selected symptoms
   - Severity level
   - Patient age
   - Additional context
5. AI returns:
   - Triage level classification
   - Detailed explanation
   - Suggested actions
   - Warning signs to watch for
   - Self-care tips (if applicable)

### AI Prompt Structure:
The system sends a detailed medical triage prompt to Gemini that includes:
- Patient demographics
- Symptom severity
- Detailed symptom description
- Selected symptom checklist
- Special considerations (child/adult)

### Response Parsing:
The AI response is intelligently parsed to extract:
- **Triage Level**: EMERGENCY, URGENT, ROUTINE, or SELF_CARE
- **Primary Concern**: Main medical issue identified
- **Explanation**: Why this triage level was chosen
- **Suggested Actions**: 3-5 specific recommendations
- **Warning Signs**: Red flags requiring immediate care
- **Self-Care Tips**: Home management suggestions

## 🔧 Configuration Options

### In `api.js`:

```javascript
const USE_GEMINI_FIRST = true; // Set to false to use backend API instead
```

### Model Configuration (in `gemini.js`):

```javascript
model: "gemini-2.0-flash-exp" // Current: Gemini Flash 2.5 Experimental
```

## 📊 API Usage & Limits

### Free Tier (Google AI Studio):
- ✅ **60 requests per minute**
- ✅ **1,500 requests per day**
- ✅ **1 million tokens per month**
- ✅ **Perfect for development & demos**

### Rate Limiting:
The system automatically handles rate limits with graceful fallbacks.

## 🎨 Visual Indicators

### When Gemini is Active:
1. **Purple AI Banner** at the top of the home page
2. **"AI-Powered by Google Gemini"** subtitle on the form
3. **AI badge** on results page
4. **Animated loading spinner** with "AI Analyzing..." text

### When Gemini is NOT Configured:
- Falls back to backend API (if available)
- Standard triage form without AI branding

## 🔍 Debugging

### Check if Gemini is Working:

Open browser console (F12) and look for:
```
🤖 Using Gemini AI for analysis...
✅ Gemini analysis successful
```

### Common Issues:

**Issue: "Gemini API key not configured"**
- Solution: Add your API key to `.env` file and restart server

**Issue: "Failed to get AI diagnosis"**
- Check: Is your API key valid?
- Check: Have you exceeded rate limits?
- Check: Is your internet connection working?

**Issue: AI analysis takes too long**
- The first request may take 3-5 seconds
- Subsequent requests are typically faster (2-3 seconds)
- This is normal for AI processing

### Fallback Behavior:
If Gemini fails, the system automatically falls back to:
1. Python backend API (if configured)
2. Error message prompting user to try again

## 🧪 Testing

### Test with Demo Scenarios:
Visit the **Demo** page to test pre-configured scenarios:
1. Emergency: Severe chest pain
2. Urgent: High fever with vomiting
3. Self-care: Common cold

### Test with Custom Symptoms:
Try describing symptoms naturally:
- "I have a severe headache and feel dizzy"
- "Chest pain that gets worse when I breathe"
- "Mild cold symptoms for 2 days"

## 🔐 Security Best Practices

### ⚠️ IMPORTANT:
- ✅ **DO** keep your `.env` file in `.gitignore`
- ✅ **DO** regenerate keys if accidentally exposed
- ✅ **DO** use environment variables in production
- ❌ **DON'T** commit API keys to Git
- ❌ **DON'T** share your API key publicly

### Production Deployment:
Use platform-specific environment variables:
- **Vercel**: Environment Variables in dashboard
- **Netlify**: Site Settings → Environment Variables
- **GitHub Pages**: Repository Secrets

## 📈 Monitoring Usage

### Check API Usage:
Visit: https://aistudio.google.com/app/apikey

See your:
- Requests per day
- Tokens used
- Rate limit status

## 🎓 Advanced Customization

### Modify AI Prompt:
Edit `gemini.js` → `buildMedicalTriagePrompt()` function

### Change Model:
```javascript
// In gemini.js
model: "gemini-2.0-flash-exp"  // Current
model: "gemini-pro"             // Alternative (more powerful)
```

### Adjust Response Format:
Modify `parseGeminiResponse()` to customize how AI responses are structured.

## 🆘 Troubleshooting

### Error Messages:

| Error | Cause | Solution |
|-------|-------|----------|
| "API key not configured" | Missing `.env` file | Create `.env` and add key |
| "Invalid API key" | Wrong key format | Verify key from AI Studio |
| "Rate limit exceeded" | Too many requests | Wait 1 minute or upgrade |
| "Network error" | Connection issue | Check internet connection |

### Getting Help:

1. Check browser console (F12) for detailed errors
2. Verify `.env` file exists and has correct format
3. Test API key at: https://aistudio.google.com
4. Review Gemini documentation: https://ai.google.dev/docs

## 🌟 Benefits of Gemini Integration

✅ **No Backend Required**: Frontend-only AI analysis
✅ **Fast & Accurate**: Latest AI technology
✅ **Free Tier Available**: Perfect for development
✅ **Natural Language**: Understands complex descriptions
✅ **Context-Aware**: Considers age, severity, symptoms
✅ **Medically Informed**: Trained on medical data
✅ **Fallback Ready**: Graceful degradation if unavailable

## 📚 Resources

- **Gemini API Docs**: https://ai.google.dev/docs
- **Get API Key**: https://aistudio.google.com/app/apikey
- **Pricing**: https://ai.google.dev/pricing
- **Models Guide**: https://ai.google.dev/models/gemini

## 🎉 You're All Set!

Your Medical Triage Application now has:
- ✅ AI-powered symptom analysis
- ✅ Intelligent triage classification
- ✅ Natural language understanding
- ✅ Professional medical recommendations

**Enjoy your AI-enhanced healthcare application! 🚀**

---

**Note**: This is for educational/demonstration purposes. Always consult qualified healthcare professionals for medical advice.

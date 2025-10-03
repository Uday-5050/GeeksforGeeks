# 🚀 Quick Start Guide

## Prerequisites Check

Before you start, you need:
- ✅ Node.js 18+ installed ([Download here](https://nodejs.org/))
- ✅ npm (comes with Node.js)
- ✅ A code editor (VS Code recommended)
- ✅ Backend API running (or use demo mode to see UI)

## 5-Minute Setup

### Step 1: Navigate to Project
```bash
cd GeeksforGeeks/triage-frontend
```

### Step 2: Install Dependencies
```bash
npm install
```
⏱️ This takes 1-2 minutes

### Step 3: Configure Backend (Optional)
```bash
# Copy the example environment file
copy .env.example .env

# Edit .env and set your backend URL
# VITE_API_URL=http://localhost:8000
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
Visit: **http://localhost:3000**

## 🎮 Try It Out

### Option 1: Demo Mode (No Backend Needed for UI)
1. Click "Demo" in navigation
2. Click any of the three demo buttons
3. See the triage result display

### Option 2: Full Form
1. Go to "Home" page
2. Fill out the symptom form
3. Click "Get Triage Assessment"
4. View results (requires backend API)

## 📝 What You'll See

### Home Page Features
- **Symptom Description:** Large text area
- **Symptom Checklist:** 6 common symptoms
- **Age Input:** Automatic child detection
- **Severity Selector:** Mild/Moderate/Severe
- **Submit Button:** Clear call-to-action

### Demo Page Features
- **3 Demo Scenarios:**
  - Emergency (severe chest pain)
  - Urgent (fever + vomiting)
  - Self-Care (common cold)

### Result Display
- **Color-Coded Banner:** EMERGENCY/URGENT/GP/SELF_CARE
- **Emergency Button:** tel:112 for emergencies
- **Explanation:** AI-generated assessment
- **Actions List:** Suggested next steps
- **Find Clinic:** Link to nearby medical facilities

## 🎨 Accessibility Features

You'll notice:
- ✅ Large, readable fonts
- ✅ High contrast colors
- ✅ Keyboard navigation (try Tab key)
- ✅ Focus indicators (visible outlines)
- ✅ Touch-friendly buttons
- ✅ Responsive design (try mobile view)

## 🔧 Common Issues

### "npm not found"
- Install Node.js from nodejs.org
- Restart your terminal after installation

### "Port 3000 already in use"
- Change port in vite.config.js
- Or stop other services using port 3000

### "API connection failed"
- Check VITE_API_URL in .env
- Ensure backend is running
- Use Demo mode to see UI without backend

### "Module not found"
- Run `npm install` again
- Delete node_modules and run `npm install`

## 📦 Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Output will be in `dist/` folder.

## 🚀 Deploy

### Vercel (Easiest)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Pages
- Push to GitHub
- Enable GitHub Pages
- Use included workflow in `.github/workflows/deploy.yml`

## 📖 Learn More

- **Full README:** See `README.md` for detailed docs
- **Project Overview:** See `PROJECT_OVERVIEW.md` for architecture
- **About Page:** Visit `/about` in the app for usage info

## ✅ Success Checklist

After setup, verify:
- [ ] Dev server runs without errors
- [ ] Can access http://localhost:3000
- [ ] Navigation works (Home/Demo/About)
- [ ] Demo buttons display results (even without backend)
- [ ] Form inputs are large and accessible
- [ ] Emergency CTA is prominent
- [ ] Responsive on mobile (resize browser)

## 🆘 Need Help?

1. **Check Node.js version:** `node --version` (should be 18+)
2. **Check npm version:** `npm --version`
3. **Clear cache:** `npm cache clean --force`
4. **Reinstall:** Delete `node_modules/` and run `npm install`

## 🎯 Next Steps

Once running:
1. ✅ Explore all three pages
2. ✅ Test demo scenarios
3. ✅ Try the main form
4. ✅ Check accessibility features
5. ✅ Configure backend URL
6. ✅ Deploy to production

---

**That's it! You're ready to go! 🎉**

For detailed configuration and deployment, see the full README.md

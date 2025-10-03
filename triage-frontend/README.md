# Medical Triage System - Frontend

A polished single-page application (SPA) for medical symptom triage built with React and Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm installed
- Backend API running (or use demo mode)

### Installation

```bash
# Navigate to the project directory
cd triage-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 🔧 Configuration

### Changing the Backend API URL

The backend API URL can be configured in two ways:

#### 1. Environment Variable (Recommended)

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://your-backend-api.com
```

#### 2. Direct Edit

Edit `src/services/api.js` and change the `API_BASE_URL`:

```javascript
const API_BASE_URL = 'https://your-backend-api.com';
```

**Default:** `http://localhost:8000`

## 📋 Features

### Pages
- **Home (/)** - Main symptom input form
- **Demo (/demo)** - Pre-configured demo scenarios
- **About (/about)** - Information and disclaimers

### Input Features
- Free-text symptom description
- Checklist for common symptoms:
  - Fever
  - Chest Pain
  - Breathlessness
  - Vomiting
  - Drowsy/Confused
  - Runny Nose
- Age input with automatic child detection
- Severity selector (mild/moderate/severe)
- Child toggle (under 18)

### Triage Levels
- **EMERGENCY** - Immediate attention with prominent 112 call button
- **URGENT** - Medical attention within hours
- **GP** - See doctor within 24-48 hours
- **SELF_CARE** - Home management with monitoring

### Accessibility Features
✅ Large fonts (18px base)
✅ High contrast colors
✅ Keyboard navigation
✅ Focus indicators
✅ ARIA labels
✅ Responsive design
✅ Touch-friendly buttons (48px min height)

## 🎯 Demo Mode

Three pre-configured scenarios in `/demo`:

1. **Emergency: Severe Chest Pain** - Demonstrates EMERGENCY triage
2. **Urgent: High Fever with Vomiting** - Demonstrates URGENT triage
3. **Self-Care: Common Cold** - Demonstrates SELF_CARE triage

Demo payloads are defined in `public/demo_payloads.json`

## 📡 API Integration

### Endpoint
```
POST /api/triage
```

### Request Schema
```json
{
  "symptoms_text": "string - detailed symptom description",
  "symptoms_list": ["array", "of", "symptom", "ids"],
  "age": 0,
  "is_child": false,
  "severity": "mild|moderate|severe"
}
```

### Response Schema
```json
{
  "triage_level": "EMERGENCY|URGENT|GP|SELF_CARE",
  "explanation": "string - detailed explanation",
  "suggested_actions": ["array", "of", "suggested", "actions"]
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variable:
```bash
vercel env add VITE_API_URL
```

**Or use the Vercel Dashboard:**
- Import your GitHub repository
- Set `VITE_API_URL` in environment variables
- Deploy automatically on push

### GitHub Pages

1. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

2. Build and deploy:
```bash
npm run build
npm run deploy
```

Add this script to `package.json`:
```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

### Netlify

1. Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy via Netlify CLI or GitHub integration

## 📁 Project Structure

```
triage-frontend/
├── public/
│   └── demo_payloads.json      # Demo scenario payloads
├── src/
│   ├── components/
│   │   ├── TriageForm.jsx      # Main input form
│   │   └── TriageResult.jsx    # Result display
│   ├── pages/
│   │   ├── Home.jsx            # Main page
│   │   ├── Demo.jsx            # Demo page
│   │   └── About.jsx           # About page
│   ├── services/
│   │   └── api.js              # API integration
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## ✅ Acceptance Criteria

- [x] Form submission calls `/api/triage` endpoint
- [x] Response displayed within <2s for demo payloads
- [x] Demo buttons reproduce three scenarios correctly
- [x] Emergency CTA is prominent with tel:112 link
- [x] Large fonts and good contrast throughout
- [x] Keyboard accessible
- [x] Responsive design
- [x] Clear triage level banners
- [x] Suggested actions displayed
- [x] Find clinic link available

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Routing:** React Router 6
- **Styling:** CSS3 (no external UI libraries)
- **Deployment:** Vercel/GitHub Pages/Netlify ready

## ⚠️ Disclaimers

This tool provides guidance only and is NOT a substitute for professional medical advice. Always consult qualified healthcare professionals for medical decisions. In emergencies, call 112 or your local emergency number immediately.

## 📝 License

Built for hackathon demonstration purposes.

## 🤝 Contributing

This is a hackathon project. For the actual backend implementation and integration, ensure proper error handling, rate limiting, and security measures are in place.

---

**Need Help?**
- Check the `/about` page for more information
- Try the `/demo` page to see the system in action
- Ensure your backend API is running and accessible

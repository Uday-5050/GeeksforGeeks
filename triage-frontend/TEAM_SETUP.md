# Team Setup Instructions 🚀

## For Team Members Cloning This Repository

Follow these steps to get the project running on your machine:

### Step 1: Clone the Repository
```bash
git clone https://github.com/Uday-5050/GeeksforGeeks.git
cd GeeksforGeeks/triage-frontend
```

### Step 2: Install Dependencies
```bash
npm install
```
This will install all required packages including `@google/generative-ai`

### Step 3: Setup Environment Variables
**Option A - Copy the shared file (Recommended):**
```bash
# Windows PowerShell
copy env.shared .env

# Linux/Mac
cp env.shared .env
```

**Option B - Create manually:**
Create a file named `.env` in the `triage-frontend` folder with this content:
```
VITE_GEMINI_API_KEY=AIzaSyCt-ldaiPCLO1DaOM1q4JKp7UyzvBbBaUk
VITE_API_URL=http://localhost:8000
```

### Step 4: Start the Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
Navigate to: **http://localhost:3000**

---

## ✅ Verification Checklist

- [ ] `npm install` completed without errors
- [ ] `.env` file exists in `triage-frontend` folder
- [ ] API key is present in `.env` file
- [ ] Server running on http://localhost:3000
- [ ] AI-powered diagnosis banner shows "🤖 AI-Powered Diagnosis Active"

---

## 🔧 Troubleshooting

### Error: "Failed to resolve import @google/generative-ai"
**Solution:** Run `npm install` in the triage-frontend directory

### Error: "Gemini API key not configured"
**Solution:** Create `.env` file with the API key (see Step 3)

### Server won't start
**Solution:** 
1. Check if another process is using port 3000
2. Try killing the process: `npx kill-port 3000`
3. Restart: `npm run dev`

---

## 📞 Need Help?
Contact the team lead or check the documentation files:
- `GEMINI_SETUP.md` - Detailed Gemini integration guide
- `DEBUGGING.md` - Common issues and solutions

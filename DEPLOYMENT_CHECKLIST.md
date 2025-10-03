# 🚀 Deployment Checklist

Use this checklist to ensure your Medical Triage SPA is ready for production deployment.

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All components render without errors
- [ ] No console errors in browser
- [ ] All routes work correctly (/, /demo, /about)
- [ ] Navigation links are functional
- [ ] Form validation works properly

### ✅ Functionality Testing
- [ ] Home page form submits successfully
- [ ] Demo page loads all 3 scenarios
- [ ] Demo buttons trigger correct payloads
- [ ] Result display shows all elements:
  - [ ] Triage banner
  - [ ] Explanation text
  - [ ] Suggested actions
  - [ ] Emergency CTA (for EMERGENCY level)
  - [ ] Find Clinic link
  - [ ] New Assessment button
- [ ] About page displays all information

### ✅ Accessibility
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus indicators visible on all interactive elements
- [ ] All buttons have minimum 48px height
- [ ] Font sizes are large (18px+ base)
- [ ] Color contrast meets WCAG standards
- [ ] Screen reader compatible (test with NVDA/JAWS)

### ✅ Responsive Design
- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] Navigation adapts to screen size
- [ ] Forms are usable on touch devices
- [ ] No horizontal scrolling

### ✅ Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

### ✅ Configuration
- [ ] Backend API URL is configured
- [ ] Environment variables are set
- [ ] demo_payloads.json is in public folder
- [ ] All static assets load correctly

### ✅ Performance
- [ ] Build completes without errors (`npm run build`)
- [ ] Bundle size is reasonable (<500KB)
- [ ] Initial load time <3 seconds
- [ ] API responses <2 seconds for demos

## Deployment Platform Setup

### Vercel Deployment
- [ ] GitHub repository is public or connected
- [ ] Vercel project created
- [ ] Environment variable `VITE_API_URL` set
- [ ] Build settings configured:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`
- [ ] Deploy triggered successfully
- [ ] Custom domain configured (optional)

### Netlify Deployment
- [ ] netlify.toml file present
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Redirects configured for SPA routing
- [ ] Deploy successful
- [ ] Custom domain configured (optional)

### GitHub Pages Deployment
- [ ] GitHub Pages enabled in repo settings
- [ ] Deploy workflow file present (.github/workflows/deploy.yml)
- [ ] `VITE_API_URL` added to GitHub Secrets
- [ ] Workflow runs successfully
- [ ] Site accessible at github.io URL

## Post-Deployment Verification

### ✅ Live Site Testing
- [ ] Site loads successfully
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Demo scenarios work
- [ ] API connection works (if backend deployed)
- [ ] Emergency CTA links to tel:112
- [ ] Find Clinic link works
- [ ] No 404 errors on refresh

### ✅ Mobile Testing
- [ ] Test on actual mobile device
- [ ] Touch targets work correctly
- [ ] Forms are easy to fill out
- [ ] Emergency button is prominent
- [ ] No layout issues

### ✅ Performance Metrics
- [ ] Lighthouse score >90
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3s
- [ ] No console errors
- [ ] No failed network requests

### ✅ SEO & Metadata
- [ ] Page title is descriptive
- [ ] Meta description present (add if needed)
- [ ] Favicon loads correctly
- [ ] Open Graph tags (optional)

## Documentation Checklist

### ✅ Repository
- [ ] README.md is comprehensive
- [ ] PROJECT_OVERVIEW.md explains architecture
- [ ] QUICK_START.md for new users
- [ ] .env.example provided
- [ ] LICENSE file (if needed)
- [ ] .gitignore configured properly

### ✅ Code Documentation
- [ ] Components have clear naming
- [ ] API service documented
- [ ] Configuration options explained
- [ ] Deployment instructions clear

## Security Checklist

### ✅ Basic Security
- [ ] No sensitive data in code
- [ ] No API keys hardcoded
- [ ] Environment variables used correctly
- [ ] HTTPS enabled (deployment platform handles this)
- [ ] CORS configured on backend
- [ ] Input validation present

### ✅ Privacy
- [ ] No user data collected
- [ ] No tracking scripts
- [ ] Privacy policy (if needed)
- [ ] Disclaimers clearly visible

## Final Acceptance Criteria

### ✅ Requirements Met
- [ ] Symptom input form complete
- [ ] POST to /api/triage works
- [ ] Results display clearly
- [ ] Emergency CTA is prominent
- [ ] Three demo scenarios work
- [ ] Large fonts throughout
- [ ] High contrast colors
- [ ] Keyboard accessible
- [ ] Deployed successfully

### ✅ User Experience
- [ ] Intuitive navigation
- [ ] Clear call-to-actions
- [ ] Fast response times
- [ ] Error messages are helpful
- [ ] Loading states visible
- [ ] Success states clear

### ✅ Edge Cases Handled
- [ ] API connection failure
- [ ] Invalid form input
- [ ] Network timeout
- [ ] Empty responses
- [ ] Very long symptom descriptions
- [ ] Special characters in input

## Monitoring & Maintenance

### ✅ Post-Launch
- [ ] Monitor error logs
- [ ] Track API response times
- [ ] Check user feedback
- [ ] Test on new browser versions
- [ ] Update dependencies regularly
- [ ] Keep documentation updated

## Rollback Plan

### ✅ If Issues Arise
- [ ] Previous version URL documented
- [ ] Rollback procedure documented
- [ ] Backend compatibility verified
- [ ] Users notified if downtime expected

---

## Sign-off

**Tested by:** ___________________  
**Date:** ___________________  
**Deployment URL:** ___________________  
**Backend API URL:** ___________________  

**Status:** ⬜ Ready for Production | ⬜ Needs Fixes

**Notes:**
_________________________________
_________________________________
_________________________________

---

## Quick Commands Reference

```bash
# Test locally
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel

# Deploy to Netlify
netlify deploy --prod

# Check bundle size
npm run build -- --mode production
```

---

**Ready to Deploy?** ✅ Complete all checks above before going live!

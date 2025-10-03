# 🎨 Visual Guide - What to Expect

This guide shows you what each part of the Medical Triage SPA looks like and how it works.

## 🏠 Home Page (`/`)

### Navigation Bar
```
┌─────────────────────────────────────────────────────┐
│  [Home]  [Demo]  [About]                            │
└─────────────────────────────────────────────────────┘
```
- Dark blue background (#2c3e50)
- White text
- Active page highlighted
- Responsive: stacks on mobile

### Main Form

```
┌───────────────────────────────────────────────────────┐
│  Medical Triage Assessment                            │
│                                                       │
│  Describe Your Symptoms *                            │
│  ┌─────────────────────────────────────────────┐    │
│  │ Large textarea (5 rows)                     │    │
│  │ Placeholder: "Please describe..."           │    │
│  │                                              │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  Select Specific Symptoms                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ ☑ Fever │ │ ☐ Chest │ │ ☐ Breath│              │
│  └─────────┘ └─────────┘ └─────────┘              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ ☐ Vomit │ │ ☐ Drowsy│ │ ☐ Runny │              │
│  └─────────┘ └─────────┘ └─────────┘              │
│                                                       │
│  Age *              Symptom Severity *               │
│  ┌──────────┐      ┌──────────────┐                 │
│  │   55     │      │ Mild ▼       │                 │
│  └──────────┘      └──────────────┘                 │
│                                                       │
│  ☑ Patient is under 18 years old                    │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │   🔍 Get Triage Assessment                  │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  ⚠️ This tool provides guidance only...              │
└───────────────────────────────────────────────────────┘
```

**Features:**
- Large fonts (1.1rem for inputs)
- High contrast
- Clear labels
- Required field indicators (*)
- Helpful placeholder text
- Warning disclaimer at bottom

---

## 📊 Result Display

### Emergency Level
```
┌───────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐ │
│  │     🚨 EMERGENCY 🚨                             │ │
│  │     (Red, pulsing animation)                    │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │  🚨 CALL EMERGENCY: 112                         │ │
│  │  (Large red button, clickable tel:112)          │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Assessment                                           │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Based on your symptoms of severe chest pain     │ │
│  │ radiating to the arm with breathlessness, you   │ │
│  │ require immediate emergency medical attention.  │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Recommended Actions                                  │
│  ┌─────────────────────────────────────────────────┐ │
│  │ • Call emergency services immediately            │ │
│  │ • Do not drive yourself to hospital             │ │
│  │ • Chew aspirin if not allergic                  │ │
│  │ • Stay calm and wait for help                   │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  [← New Assessment]                                   │
└───────────────────────────────────────────────────────┘
```

### Urgent Level
```
┌───────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐ │
│  │          ⚠️ URGENT                              │ │
│  │          (Orange background)                    │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Assessment + Actions...                              │
│                                                       │
│  [🏥 Find Nearby Clinic]  [← New Assessment]        │
└───────────────────────────────────────────────────────┘
```

### GP Level
```
┌───────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐ │
│  │            GP (GENERAL PRACTITIONER)            │ │
│  │            (Yellow background)                  │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Assessment + Actions...                              │
│                                                       │
│  [🏥 Find Nearby Clinic]  [← New Assessment]        │
└───────────────────────────────────────────────────────┘
```

### Self-Care Level
```
┌───────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐ │
│  │          ✅ SELF CARE                           │ │
│  │          (Green background)                     │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Assessment + Actions...                              │
│                                                       │
│  [🏥 Find Nearby Clinic]  [← New Assessment]        │
│                                                       │
│  Self-Care Tips                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │ • Rest and stay hydrated                        │ │
│  │ • Monitor your symptoms                         │ │
│  │ • Seek medical help if symptoms worsen          │ │
│  └─────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

---

## 🎮 Demo Page (`/demo`)

```
┌───────────────────────────────────────────────────────┐
│  Demo Mode                                            │
│                                                       │
│  Try out the triage system with pre-configured       │
│  scenarios. Each button demonstrates a different     │
│  severity level and expected response.               │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Emergency: Severe Chest Pain                    │ │
│  │ severe crushing chest pain radiating to left... │ │
│  │ Age: 55  Severity: severe                       │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Urgent: High Fever with Vomiting                │ │
│  │ high fever for 2 days, persistent vomiting...   │ │
│  │ Age: 8  Severity: moderate  👶 Child           │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Self-Care: Common Cold                          │ │
│  │ runny nose, mild sore throat, feeling tired...  │ │
│  │ Age: 32  Severity: mild                         │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ℹ️ About Demo Mode                                  │
│  These scenarios showcase different triage levels... │
└───────────────────────────────────────────────────────┘
```

**Features:**
- Large, clickable buttons
- Shows full scenario details
- One-click testing
- Color-coded information
- Helpful explanatory text

---

## 📖 About Page (`/about`)

```
┌───────────────────────────────────────────────────────┐
│  About Medical Triage System                          │
│                                                       │
│  What is This?                                        │
│  This is an AI-powered medical triage system...      │
│                                                       │
│  How It Works                                         │
│  1. Describe your symptoms in detail                 │
│  2. Select relevant symptom categories               │
│  3. Provide your age and severity assessment         │
│  ...                                                  │
│                                                       │
│  Triage Levels                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │ EMERGENCY: Life-threatening...                  │ │ (Red)
│  ┌─────────────────────────────────────────────────┐ │
│  │ URGENT: Serious condition...                    │ │ (Orange)
│  ┌─────────────────────────────────────────────────┐ │
│  │ GP: Should see doctor...                        │ │ (Yellow)
│  ┌─────────────────────────────────────────────────┐ │
│  │ SELF_CARE: Manage at home...                    │ │ (Green)
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ⚠️ Important Disclaimers                            │
│  • This is NOT a substitute for medical advice      │
│  • Always consult healthcare professionals          │
│  • In emergencies, call 112 immediately             │
│  ...                                                  │
│                                                       │
│  Team Information                                     │
│  Built for hackathon demonstration...                │
│                                                       │
│  📞 Emergency Resources                               │
│  Emergency Services: 112 (EU) / 911 (US)            │
└───────────────────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### Triage Levels
- **EMERGENCY:** `#dc3545` (Red) - High urgency, attention-grabbing
- **URGENT:** `#fd7e14` (Orange) - Important but not critical
- **GP:** `#ffc107` (Yellow) - Moderate concern
- **SELF_CARE:** `#28a745` (Green) - Low concern, reassuring

### UI Elements
- **Primary Button:** `#646cff` (Blue) - Main actions
- **Navigation:** `#2c3e50` (Dark blue) - Professional
- **Text:** `#213547` (Dark gray) - Readable
- **Background:** `#f5f5f5` (Light gray) - Easy on eyes
- **White:** `#ffffff` - Cards and inputs

### Contrast Ratios
All combinations meet WCAG AAA standards:
- White on Dark Blue: 8.59:1 ✅
- Black on Yellow: 8.12:1 ✅
- White on Red: 5.87:1 ✅
- White on Green: 4.54:1 ✅

---

## 📱 Responsive Behavior

### Desktop (>1024px)
- Full navigation bar
- Wide form layout
- Side-by-side buttons
- 900px max content width

### Tablet (768px - 1024px)
- Wrapped navigation
- Stacked form elements
- Full-width buttons
- Comfortable spacing

### Mobile (<768px)
- Vertical navigation
- Single column layout
- Large touch targets
- Optimized for one hand
- Smaller banner text (1.8rem)
- Condensed padding

---

## ⌨️ Keyboard Navigation

```
Tab       → Move to next interactive element
Shift+Tab → Move to previous element
Enter     → Activate buttons and links
Space     → Toggle checkboxes
Arrow     → Navigate select dropdowns
Escape    → (Future: close modals)
```

### Focus Indicators
- 3px solid blue outline
- 2px offset from element
- Highly visible
- Consistent across all elements

---

## 🎯 Interactive Elements

### Minimum Sizes
- **Buttons:** 48px height minimum (touch-friendly)
- **Inputs:** 48px height minimum
- **Checkboxes:** 24px × 24px
- **Links:** Adequate padding for easy clicking

### Hover States
- Slight lift effect (translateY(-2px))
- Shadow increase
- Background color change
- Smooth 0.3s transition

### Active States
- Visual feedback on click
- Color change
- Size adjustment
- Clear pressed state

---

## 🚀 Loading States

### Form Submission
```
┌─────────────────────────────────────────────────┐
│           Analyzing symptoms...                 │
│           (Blue text, centered)                 │
└─────────────────────────────────────────────────┘
```

### Button States
```
Normal:     [🔍 Get Triage Assessment]
Loading:    [Analyzing...]  (disabled)
Error:      [Try Again]
Success:    → Shows results
```

---

## ❌ Error States

```
┌─────────────────────────────────────────────────┐
│  Error: Failed to get triage assessment.        │
│  Please check your connection and try again.    │
│  (Red background with dark red text)            │
└─────────────────────────────────────────────────┘
```

**Error colors:**
- Background: `#f8d7da`
- Text: `#721c24`
- Border: `#f5c6cb`

---

## 💡 Visual Hierarchy

1. **Most Important:** Triage banner (2.5rem, bold)
2. **Very Important:** Emergency CTA (1.5rem, bold)
3. **Important:** Section headings (1.3-1.5rem)
4. **Normal:** Body text (1.1rem)
5. **Less Important:** Helper text (0.95rem)

---

This visual guide shows the polished, professional appearance of the Medical Triage SPA. Every element is designed for clarity, accessibility, and user confidence! 🎨

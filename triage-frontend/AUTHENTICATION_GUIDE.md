# 🔐 Authentication Guide - SymptomScan

## Overview
The SymptomScan application now supports role-based authentication that redirects users based on their login credentials.

## 🎭 User Roles

### 👨‍⚕️ Admin Users
- **Access**: Full dashboard with patient management, reports, and analytics
- **Login Criteria**: Email address contains "admin"
- **Example Emails**:
  - `admin@symptomscan.com`
  - `administrator@hospital.com`
  - `admin.user@clinic.org`
  - `john.admin@healthcare.net`

### 🩺 Regular Users (Patients)
- **Access**: Main symptom triage form and self-assessment tools
- **Login Criteria**: Any email that does NOT contain "admin"
- **Example Emails**:
  - `patient@email.com`
  - `john.doe@gmail.com`
  - `jane.smith@yahoo.com`

## 🚀 How It Works

### Login Flow
1. Navigate to `/login`
2. Enter your email and password
3. Click "SIGN IN" button
4. System checks if email contains "admin"
5. **Admin** → Redirected to `/dashboard`
6. **Regular User** → Redirected to `/` (Home - Symptom Form)

### User Session
- Login credentials are stored in `localStorage`:
  - `userRole`: "admin" or "user"
  - `userEmail`: The email address entered
- Session persists across page refreshes
- Logout clears all session data

## 💡 Testing the Application

### Test as Admin
```
Email: admin@symptomscan.com
Password: anything (demo mode)
Result: You'll see the medical dashboard with stats, patient list, and navigation
```

### Test as Regular User
```
Email: patient@example.com
Password: anything (demo mode)
Result: You'll see the symptom triage form to enter health information
```

## 🎨 User Interface Features

### Login Page
- **Hint Box**: Shows which email format gives admin access
- **Loading State**: Button shows "SIGNING IN..." during authentication
- **Animated Logo**: SymptomScan logo with medical symbols
- **Hover Effects**: Interactive button with ripple and glow effects

### Admin Dashboard
- **Statistics Cards**: Total consultations, emergency cases, pending reviews
- **Recent Cases Table**: Live patient triage data
- **Navigation Sidebar**: Access to patients, reports, settings
- **Logout Button**: Clears session and returns to login

### Regular User Home
- **User Info Banner**: Shows logged-in email and role
- **Logout Button**: Returns to login page
- **Symptom Form**: Full triage questionnaire
- **Results Display**: Color-coded assessment with recommendations

## 🔒 Security Notes

> **Important**: This is a demo authentication system for development purposes only.

**Current Implementation:**
- ✅ Client-side role detection
- ✅ Session persistence with localStorage
- ✅ Role-based routing

**For Production, Add:**
- 🔐 Backend authentication API
- 🔑 Secure password hashing
- 🎟️ JWT or session tokens
- 🛡️ Protected route guards
- 📧 Email verification
- 🔄 Password reset functionality
- ⏰ Session timeout
- 🚫 Rate limiting

## 📱 Responsive Design
- Works on desktop, tablet, and mobile devices
- Adaptive layout for all screen sizes
- Touch-friendly on mobile interfaces

## 🆘 Troubleshooting

### Can't Access Dashboard
- Check if your email contains "admin"
- Try: `admin@test.com`

### Stuck on Login
- Clear browser cache and localStorage
- Try refreshing the page (F5)

### Lost Session
- Sessions clear on logout
- Need to login again to restore

## 🎯 Quick Reference

| Email Type | Role | Destination | Features |
|------------|------|-------------|----------|
| Contains "admin" | Admin | `/dashboard` | Full medical dashboard |
| Other | User | `/` | Symptom triage form |

---

**Last Updated**: October 3, 2025  
**Version**: 1.0.0  
**Server**: http://localhost:3000

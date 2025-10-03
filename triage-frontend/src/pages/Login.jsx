import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Simulate authentication delay
    setTimeout(() => {
      // Check if user is admin
      // Admin credentials: admin@symptomscan.com or any email containing 'admin'
      const isAdmin = formData.email.toLowerCase().includes('admin');
      
      if (isAdmin) {
        // Admin user - redirect to dashboard
        console.log('Admin login successful:', formData.email);
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userEmail', formData.email);
        navigate('/dashboard');
      } else {
        // Normal user - redirect to main symptom page
        console.log('User login successful:', formData.email);
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('userEmail', formData.email);
        navigate('/');
      }
      
      setLoading(false);
    }, 800);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div className="decorative-elements">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
          <div className="plus plus-1">+</div>
          <div className="plus plus-2">+</div>
        </div>
        
        <div className="healthcare-branding">
          <div className="symptom-scan-logo">
            <svg viewBox="0 0 200 200" className="logo-svg-main">
              {/* Head outline */}
              <path d="M 80 150 Q 70 120 70 90 Q 70 50 95 35 Q 110 28 125 35 Q 150 50 150 90 Q 150 115 142 140" 
                    fill="#e8e0f7" stroke="#8b7fd1" strokeWidth="3" />
              
              {/* Brain circle */}
              <circle cx="105" cy="75" r="12" fill="#8b7fd1" />
              
              {/* Magnifying glass circle */}
              <circle cx="115" cy="100" r="25" fill="white" stroke="#8b7fd1" strokeWidth="3" />
              
              {/* Medical caduceus symbol */}
              <g transform="translate(115, 100)">
                <line x1="0" y1="-12" x2="0" y2="12" stroke="#8b7fd1" strokeWidth="2.5" />
                <path d="M -8 -8 Q 0 0 -8 8" fill="none" stroke="#8b7fd1" strokeWidth="2" />
                <path d="M 8 -8 Q 0 0 8 8" fill="none" stroke="#8b7fd1" strokeWidth="2" />
                <circle cx="0" cy="-14" r="3" fill="#8b7fd1" />
                <line x1="-4" y1="-18" x2="-1" y2="-14" stroke="#8b7fd1" strokeWidth="1.5" />
                <line x1="4" y1="-18" x2="1" y2="-14" stroke="#8b7fd1" strokeWidth="1.5" />
              </g>
              
              {/* Magnifying glass handle */}
              <line x1="133" y1="118" x2="145" y2="130" stroke="#8b7fd1" strokeWidth="4" strokeLinecap="round" />
              
              {/* Green leaf */}
              <ellipse cx="65" cy="45" rx="12" ry="20" fill="#90c674" transform="rotate(-30 65 45)" />
              <line x1="65" y1="35" x2="65" y2="55" stroke="#7ab05f" strokeWidth="1.5" />
            </svg>
          </div>
          
          <div className="brand-text">
            <h1 className="healthcare-title">
              <span className="symptom-text">Symptom</span>
              <span className="scan-text">Scan</span>
            </h1>
            <div className="heartbeat-line">
              <svg viewBox="0 0 200 20" className="heartbeat-svg">
                <polyline points="0,10 40,10 45,5 50,15 55,10 200,10" 
                          stroke="#8b7fd1" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <p className="healthcare-subtitle">
              <span className="analyze-text">Analyze.</span>
              <span className="remedy-text"> Remedy.</span>
              <span className="heal-text"> Heal.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="login-right-panel">
        <div className="login-card">
          <div className="login-header">
            <div className="user-icon">
              <svg viewBox="0 0 100 100" className="user-svg">
                <circle cx="50" cy="35" r="15" fill="#8b7fd1"/>
                <path d="M30 70 Q30 50 50 50 Q70 50 70 70 L65 80 L35 80 Z" fill="#8b7fd1"/>
              </svg>
            </div>
            <h2 className="welcome-title">Welcome User</h2>
            <p className="welcome-subtitle">Sign In to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <div className="forgot-password">
              <a href="#" onClick={(e) => e.preventDefault()}>
                Forgot Password ?
              </a>
            </div>

            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <div className="signup-link">
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}

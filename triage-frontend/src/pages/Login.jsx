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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // For demo purposes - accept any credentials
    // In production, you would validate against a backend
    console.log('Login attempt:', formData.email);
    
    // Navigate to dashboard after "login"
    navigate('/dashboard');
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
          <div className="healthcare-icon">
            <svg viewBox="0 0 200 200" className="symptom-scan-logo">
              {/* Head outline */}
              <path d="M 100 40 Q 120 45 135 60 Q 145 75 145 95 L 145 110 Q 148 115 150 122 L 150 135 Q 145 145 140 148 L 140 160 Q 138 168 130 170 L 120 175 Q 100 180 80 175 L 70 170 Q 62 168 60 160 L 60 148 Q 55 145 50 135 L 50 122 Q 52 115 55 110 L 55 95 Q 55 75 65 60 Q 80 45 100 40 Z" 
                    fill="#e8e0ff" stroke="#8b7fd1" strokeWidth="3" opacity="0.9"/>
              
              {/* Brain/person inside head */}
              <circle cx="100" cy="75" r="12" fill="#8b7fd1"/>
              <path d="M 75 95 Q 75 85 85 83 L 100 83 L 115 83 Q 125 85 125 95 Q 125 110 120 120 L 115 130 L 85 130 L 80 120 Q 75 110 75 95 Z" 
                    fill="#c7b8f3" opacity="0.8"/>
              
              {/* Medical symbol (caduceus) in magnifying glass */}
              <circle cx="110" cy="110" r="22" fill="white" stroke="#8b7fd1" strokeWidth="3"/>
              <circle cx="110" cy="110" r="18" fill="#f8f9fb"/>
              
              {/* Caduceus staff */}
              <line x1="110" y1="100" x2="110" y2="120" stroke="#8b7fd1" strokeWidth="2"/>
              {/* Caduceus wings */}
              <path d="M 105 100 Q 100 98 98 100" fill="none" stroke="#9dc88d" strokeWidth="1.5"/>
              <path d="M 115 100 Q 120 98 122 100" fill="none" stroke="#9dc88d" strokeWidth="1.5"/>
              {/* Caduceus snakes */}
              <path d="M 108 105 Q 106 110 108 115" fill="none" stroke="#8b7fd1" strokeWidth="1.5"/>
              <path d="M 112 105 Q 114 110 112 115" fill="none" stroke="#8b7fd1" strokeWidth="1.5"/>
              
              {/* Magnifying glass handle */}
              <line x1="128" y1="128" x2="142" y2="142" stroke="#8b7fd1" strokeWidth="4" strokeLinecap="round"/>
              
              {/* Green leaf */}
              <ellipse cx="75" cy="50" rx="10" ry="15" fill="#9dc88d" transform="rotate(-30 75 50)"/>
              <path d="M 75 45 Q 75 55 75 60" stroke="#7fa876" strokeWidth="1.5"/>
            </svg>
          </div>
          <h1 className="healthcare-title">
            <span className="title-symptom">Symptom</span>
            <span className="title-scan">Scan</span>
          </h1>
          <div className="tagline-container">
            <svg className="heartbeat-line" viewBox="0 0 200 20">
              <path d="M 0 10 L 40 10 L 50 5 L 60 15 L 70 10 L 200 10" 
                    stroke="#8b7fd1" strokeWidth="2" fill="none" opacity="0.6"/>
            </svg>
            <p className="healthcare-subtitle">Analyze. Remedy. Heal.</p>
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

            <button type="submit" className="signin-button">
              SIGN IN
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

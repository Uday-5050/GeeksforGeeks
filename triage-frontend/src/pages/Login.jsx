import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { devLogin, startOAuthLogin, getStoredAuth } from '../services/auth';

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = getStoredAuth();
    if (session?.user?.email) {
      navigate(session.user.role === 'admin' ? '/dashboard' : '/home', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Sign up validation
    if (activeTab === 'signup' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const session = await devLogin({
        email: formData.email,
        password: formData.password,
        name: formData.email.split('@')[0],
      });

      if (activeTab === 'signup') {
        console.log('Account created:', session.user.email);
      } else {
        console.log('Login successful:', session.user.email);
      }

      navigate(session.user.role === 'admin' ? '/dashboard' : '/home');
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setLoading(true);
    
    console.log(`[OAuth] Starting ${provider} login...`);
    console.log(`[OAuth] API_BASE_URL: http://localhost:8000`);
    
    try {
      console.log(`[OAuth] Calling startOAuthLogin for ${provider}...`);
      const result = await startOAuthLogin(provider.toLowerCase());
      console.log(`[OAuth] Success! Got auth_url:`, result);
      
      const { auth_url: authUrl } = result;
      if (!authUrl) {
        throw new Error('No auth_url received from backend');
      }
      
      console.log(`[OAuth] Redirecting to Google...`);
      window.location.href = authUrl;
    } catch (err) {
      console.error(`[OAuth] ${provider} login failed:`, err);
      console.error(`[OAuth] Error type:`, err.constructor.name);
      console.error(`[OAuth] Error message:`, err.message);
      console.error(`[OAuth] Error stack:`, err.stack);
      
      // Check if it's a 503 error (OAuth not configured)
      if (err.message?.includes('not configured') || err.message?.includes('503')) {
        setError(
          `${provider} login is not configured yet. ` +
          `Please use the email login above or configure ${provider} OAuth in the backend .env file. ` +
          `See AUTHENTICATION_SETUP.md for instructions.`
        );
      } else if (err.message?.includes('fetch')) {
        setError(
          `Cannot connect to backend server. ` +
          `Make sure both frontend and backend servers are running. ` +
          `Backend should be at http://localhost:8000`
        );
      } else {
        setError(err.message || `${provider} login is currently unavailable. Please use email login above.`);
      }
      setLoading(false);
    }
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
          {/* Logo */}
          <div className="card-logo">
            <svg viewBox="0 0 120 120" className="card-logo-svg">
              <path d="M 40 90 Q 35 70 35 50 Q 35 25 55 15 Q 65 10 75 15 Q 95 25 95 50 Q 95 67 89 83" 
                    fill="#e8e0f7" stroke="#8b7fd1" strokeWidth="2.5" />
              <circle cx="60" cy="42" r="8" fill="#8b7fd1" />
              <circle cx="68" cy="58" r="15" fill="white" stroke="#8b7fd1" strokeWidth="2.5" />
              <g transform="translate(68, 58)">
                <line x1="0" y1="-7" x2="0" y2="7" stroke="#8b7fd1" strokeWidth="2" />
                <path d="M -5 -5 Q 0 0 -5 5" fill="none" stroke="#8b7fd1" strokeWidth="1.5" />
                <path d="M 5 -5 Q 0 0 5 5" fill="none" stroke="#8b7fd1" strokeWidth="1.5" />
                <circle cx="0" cy="-9" r="2" fill="#8b7fd1" />
              </g>
              <line x1="79" y1="69" x2="88" y2="78" stroke="#8b7fd1" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="35" cy="25" rx="8" ry="13" fill="#90c674" transform="rotate(-30 35 25)" />
            </svg>
          </div>

          {/* Welcome Text */}
          <div className="card-welcome">
            <h1 className="card-welcome-title">
              Welcome to <span className="gradient-text">SymptomScan</span>
            </h1>
            <p className="card-welcome-subtitle">
              💚 Analyze. Remedy. Heal.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
              type="button"
            >
              Login
            </button>
            <button 
              className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
              type="button"
            >
              Sign Up
            </button>
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
                placeholder="your.email@example.com"
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
                placeholder="••••••••"
                autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {activeTab === 'signup' && (
              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            )}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {activeTab === 'login' && (
              <div className="forgot-password">
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>
            )}

            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  {activeTab === 'login' ? 'Signing In...' : 'Creating Account...'}
                </span>
              ) : (
                activeTab === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          {/* Social Login Buttons */}
          <div className="social-buttons">
            <button 
              type="button" 
              className="social-btn google-btn"
              onClick={() => handleSocialLogin('Google')}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" className="social-icon">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button 
              type="button" 
              className="social-btn github-btn"
              onClick={() => handleSocialLogin('GitHub')}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" className="social-icon">
                <path fill="#181717" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Development Note */}
          <div className="dev-login-note" style={{ 
            marginTop: '12px', 
            padding: '10px', 
            backgroundColor: '#f0f7ff', 
            borderRadius: '8px',
            fontSize: '13px',
            color: '#555',
            border: '1px solid #d0e7ff'
          }}>
            💡 <strong>Development Mode:</strong> Use email login above for quick testing. OAuth providers require setup (see AUTHENTICATION_SETUP.md).
          </div>

          {/* Terms */}
          <div className="auth-terms">
            By continuing, you agree to our <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}

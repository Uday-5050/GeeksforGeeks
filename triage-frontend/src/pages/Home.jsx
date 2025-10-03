import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TriageForm from '../components/TriageForm';
import TriageResult from '../components/TriageResult';
import { callTriageAPI, buildTriagePayload } from '../services/api';
import { isGeminiConfigured } from '../services/gemini';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [geminiEnabled, setGeminiEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userRole && userEmail) {
      setUserInfo({ role: userRole, email: userEmail });
    }
    
    // Check if Gemini is configured
    setGeminiEnabled(isGeminiConfigured());
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const payload = buildTriagePayload(formData);
      // Pass both payload (for backend) and original formData (for Gemini)
      const response = await callTriageAPI(payload, formData);
      setResult(response);
    } catch (err) {
      let errorMessage = 'Failed to get triage assessment. ';
      
      if (err.message.includes('Gemini API key')) {
        errorMessage = '🔑 Gemini API key not configured. Please add your API key to the .env file to enable AI diagnosis. See GEMINI_SETUP.md for instructions.';
      } else if (err.message.includes('Failed to get AI diagnosis')) {
        errorMessage = '⚠️ AI analysis temporarily unavailable. Please try again or check your API key configuration.';
      } else {
        errorMessage += 'Please check your connection and try again.';
      }
      
      setError(errorMessage);
      console.error('Triage error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setUserInfo(null);
    navigate('/login');
  };

  return (
    <div className="container">
      {/* AI Status Banner */}
      {geminiEnabled && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '12px 20px',
          borderRadius: '12px',
          marginBottom: '15px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          animation: 'slideDown 0.5s ease-out'
        }}>
          <span style={{ fontSize: '24px' }}>🤖</span>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '16px', display: 'block', marginBottom: '2px' }}>
              AI-Powered Diagnosis Active
            </strong>
            <span style={{ fontSize: '13px', opacity: 0.9 }}>
              Using Google Gemini Flash 2.5 for intelligent symptom analysis
            </span>
          </div>
          <span style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '4px 12px', 
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            ⚡ LIVE
          </span>
        </div>
      )}
      
      {/* Setup Instructions Banner */}
      {!geminiEnabled && (
        <div style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          padding: '15px 20px',
          borderRadius: '12px',
          marginBottom: '15px',
          color: '#78350f',
          border: '2px solid #fcd34d',
          boxShadow: '0 4px 15px rgba(251, 191, 36, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>💡</span>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '16px', display: 'block', marginBottom: '6px' }}>
                Enable AI-Powered Diagnosis
              </strong>
              <p style={{ fontSize: '14px', margin: '0 0 8px 0', lineHeight: '1.5' }}>
                Get instant, intelligent symptom analysis with Google Gemini AI!
              </p>
              <ol style={{ fontSize: '13px', margin: '8px 0 0 0', paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>Get your FREE API key: <a href="https://aistudio.google.com/app/apikey" target="_blank" style={{ color: '#78350f', fontWeight: '600', textDecoration: 'underline' }}>aistudio.google.com</a></li>
                <li>Add it to <code style={{ background: '#fed7aa', padding: '2px 6px', borderRadius: '3px' }}>.env</code> file</li>
                <li>Restart the server</li>
              </ol>
              <p style={{ fontSize: '12px', margin: '8px 0 0 0', fontStyle: 'italic', opacity: 0.9 }}>
                📖 See GEMINI_SETUP.md for detailed instructions
              </p>
            </div>
          </div>
        </div>
      )}
      
      {userInfo && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 127, 209, 0.1), rgba(255, 155, 122, 0.1))',
          padding: '15px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid rgba(139, 127, 209, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <div>
            <p style={{ margin: 0, fontSize: '14px', color: '#666', fontWeight: '500' }}>
              👤 Logged in as: <strong style={{ color: '#8b7fd1' }}>{userInfo.email}</strong>
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888' }}>
              {userInfo.role === 'user' ? '🩺 Patient Portal' : '👨‍⚕️ Admin Portal'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #8b7fd1, #7269bb)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(139, 127, 209, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(139, 127, 209, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(139, 127, 209, 0.3)';
            }}
          >
            Logout
          </button>
        </div>
      )}
      
      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!result ? (
        <TriageForm onSubmit={handleSubmit} loading={loading} />
      ) : (
        <TriageResult result={result} onReset={handleReset} />
      )}
    </div>
  );
}

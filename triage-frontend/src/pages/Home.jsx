import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TriageForm from '../components/TriageForm';
import TriageResult from '../components/TriageResult';
import { callTriageAPI, buildTriagePayload } from '../services/api';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userRole && userEmail) {
      setUserInfo({ role: userRole, email: userEmail });
    }
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const payload = buildTriagePayload(formData);
      const response = await callTriageAPI(payload);
      setResult(response);
    } catch (err) {
      setError('Failed to get triage assessment. Please check your connection and try again.');
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

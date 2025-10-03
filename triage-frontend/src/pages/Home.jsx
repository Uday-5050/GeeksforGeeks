import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TriageForm from '../components/TriageForm';
import TriageResult from '../components/TriageResult';
import { callTriageAPI, buildTriagePayload } from '../services/api';
import './Home.css';

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
    <div className="home-container">
      {/* Floating Logout Button */}
      {userInfo && (
        <button onClick={handleLogout} className="floating-logout-btn" title="Logout">
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Logout</span>
        </button>
      )}

      {/* User Header */}
      {userInfo && (
        <header className="user-header">
          <div className="user-header-content">
            <div className="user-info-section">
              <div className="user-avatar">
                👤
              </div>
              <div className="user-details">
                <h2>{userInfo.email}</h2>
                <p>
                  <span>{userInfo.role === 'user' ? '🩺 Patient Portal' : '👨‍⚕️ Admin Portal'}</span>
                </p>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="home-main">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <h1>Welcome to SymptomScan</h1>
          <p>Get a quick medical assessment based on your symptoms. Our AI-powered system will help determine the urgency of your condition and recommend the appropriate level of care.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {/* Triage Form or Results */}
        {!result ? (
          <TriageForm onSubmit={handleSubmit} loading={loading} />
        ) : (
          <TriageResult result={result} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}

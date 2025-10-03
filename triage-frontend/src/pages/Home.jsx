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
  const [patientData, setPatientData] = useState({
    name: 'John Doe',
    age: 32,
    bloodType: 'O+',
    height: '175 cm',
    weight: '72 kg',
    allergies: ['Penicillin', 'Peanuts'],
    chronicConditions: ['Asthma'],
    currentMedications: [
      { name: 'Albuterol Inhaler', dosage: '2 puffs as needed', frequency: 'As needed' },
      { name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Daily' }
    ],
    lastVisit: '2025-09-15',
    upcomingAppointment: '2025-10-20',
    emergencyContact: {
      name: 'Jane Doe',
      relation: 'Spouse',
      phone: '+1 (555) 123-4567'
    }
  });
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

      {/* Main Content with Sidebar */}
      <div className="home-layout">
        {/* Left Sidebar - Patient Profile */}
        <aside className="patient-sidebar">
          <div className="sidebar-header">
            <div className="profile-image">
              👤
            </div>
            <h3>{patientData.name}</h3>
            <p className="patient-id">Patient ID: #P{Math.floor(Math.random() * 10000)}</p>
          </div>

          {/* Personal Info */}
          <div className="sidebar-section">
            <h4>📋 Personal Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Age</span>
                <span className="info-value">{patientData.age} years</span>
              </div>
              <div className="info-item">
                <span className="info-label">Blood Type</span>
                <span className="info-value">{patientData.bloodType}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Height</span>
                <span className="info-value">{patientData.height}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Weight</span>
                <span className="info-value">{patientData.weight}</span>
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="sidebar-section">
            <h4>⚠️ Allergies</h4>
            <div className="tag-list">
              {patientData.allergies.map((allergy, idx) => (
                <span key={idx} className="tag tag-warning">{allergy}</span>
              ))}
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="sidebar-section">
            <h4>🏥 Chronic Conditions</h4>
            <div className="tag-list">
              {patientData.chronicConditions.map((condition, idx) => (
                <span key={idx} className="tag tag-info">{condition}</span>
              ))}
            </div>
          </div>

          {/* Current Medications */}
          <div className="sidebar-section">
            <h4>💊 Current Medications</h4>
            <div className="medication-list">
              {patientData.currentMedications.map((med, idx) => (
                <div key={idx} className="medication-item">
                  <div className="med-name">{med.name}</div>
                  <div className="med-details">
                    <span>{med.dosage}</span>
                    <span className="med-frequency">{med.frequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointments */}
          <div className="sidebar-section">
            <h4>📅 Appointments</h4>
            <div className="appointment-item">
              <span className="appt-label">Last Visit</span>
              <span className="appt-date">{new Date(patientData.lastVisit).toLocaleDateString()}</span>
            </div>
            <div className="appointment-item upcoming">
              <span className="appt-label">Upcoming</span>
              <span className="appt-date">{new Date(patientData.upcomingAppointment).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="sidebar-section">
            <h4>🚨 Emergency Contact</h4>
            <div className="emergency-contact">
              <div className="contact-name">{patientData.emergencyContact.name}</div>
              <div className="contact-detail">{patientData.emergencyContact.relation}</div>
              <div className="contact-phone">{patientData.emergencyContact.phone}</div>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
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
    </div>
  );
}

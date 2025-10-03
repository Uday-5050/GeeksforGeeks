import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('symptom-checker');
  const [symptoms, setSymptoms] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const recognitionRef = useRef(null);

  // Common symptoms for quick selection
  const commonSymptoms = [
    { id: 'fever', label: 'Fever', icon: '🌡️' },
    { id: 'headache', label: 'Headache', icon: '🤕' },
    { id: 'cough', label: 'Cough', icon: '😷' },
    { id: 'sore-throat', label: 'Sore Throat', icon: '🗣️' },
    { id: 'body-ache', label: 'Body Ache', icon: '💪' },
    { id: 'fatigue', label: 'Fatigue', icon: '😴' },
    { id: 'nausea', label: 'Nausea', icon: '🤢' },
    { id: 'dizziness', label: 'Dizziness', icon: '😵' },
    { id: 'chest-pain', label: 'Chest Pain', icon: '❤️' },
    { id: 'shortness-breath', label: 'Shortness of Breath', icon: '😮‍💨' },
    { id: 'abdominal-pain', label: 'Abdominal Pain', icon: '🫃' },
    { id: 'runny-nose', label: 'Runny Nose', icon: '🤧' },
  ];

  // Language options
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage === 'en' ? 'en-US' : 
                                      selectedLanguage === 'hi' ? 'hi-IN' :
                                      selectedLanguage === 'ta' ? 'ta-IN' :
                                      selectedLanguage === 'te' ? 'te-IN' :
                                      selectedLanguage === 'kn' ? 'kn-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms(prev => prev + ' ' + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    // Load history from localStorage
    const savedHistory = localStorage.getItem('symptom-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, [selectedLanguage]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => {
      if (prev.some(s => s.id === symptom.id)) {
        return prev.filter(s => s.id !== symptom.id);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const analyzeSymptoms = async () => {
    // Combine text and selected symptoms
    const allSymptoms = [
      ...selectedSymptoms.map(s => s.label),
      ...symptoms.split(',').map(s => s.trim()).filter(s => s)
    ];

    if (allSymptoms.length === 0) {
      alert('Please enter or select at least one symptom');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Call the triage API
      const response = await fetch('http://localhost:8000/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: allSymptoms,
          severity: 'moderate', // You can add a selector for this
          duration: '2 days', // You can add a selector for this
          additional_factors: [],
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      
      // Enhanced result with recommendations
      const enhancedResult = {
        ...result,
        timestamp: new Date().toISOString(),
        symptoms: allSymptoms,
      };

      setAnalysisResult(enhancedResult);

      // Save to history
      const newHistory = [enhancedResult, ...history].slice(0, 10); // Keep last 10
      setHistory(newHistory);
      localStorage.setItem('symptom-history', JSON.stringify(newHistory));

    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevel = (triageLabel) => {
    if (triageLabel.includes('EMERGENCY') || triageLabel.includes('911')) {
      return { level: 'High', color: 'red', icon: '🚨' };
    } else if (triageLabel.includes('URGENT')) {
      return { level: 'Moderate', color: 'orange', icon: '⚠️' };
    } else if (triageLabel.includes('DOCTOR')) {
      return { level: 'Moderate', color: 'yellow', icon: '🩺' };
    } else {
      return { level: 'Low', color: 'green', icon: '✅' };
    }
  };

  const getRecommendation = (triageLabel) => {
    if (triageLabel.includes('EMERGENCY') || triageLabel.includes('911')) {
      return {
        title: '🚨 Emergency Alert',
        action: 'Call 911 or go to the nearest Emergency Room immediately',
        tips: [
          'Do not drive yourself',
          'Call emergency services',
          'Have someone stay with you',
          'Prepare a list of your medications'
        ],
        specialists: ['Emergency Medicine']
      };
    } else if (triageLabel.includes('URGENT')) {
      return {
        title: '🩺 Doctor Visit Recommended',
        action: 'Visit urgent care or schedule a doctor appointment within 24 hours',
        tips: [
          'Document your symptoms',
          'Check your temperature regularly',
          'Stay hydrated',
          'Avoid strenuous activities'
        ],
        specialists: ['General Physician', 'Internal Medicine']
      };
    } else if (triageLabel.includes('DOCTOR')) {
      return {
        title: '🩺 Doctor Visit Recommended',
        action: 'Schedule an appointment with your doctor within 48 hours',
        tips: [
          'Keep track of symptom changes',
          'Rest and stay hydrated',
          'Take over-the-counter medications as needed',
          'Monitor for worsening symptoms'
        ],
        specialists: ['General Physician', 'Family Medicine']
      };
    } else {
      return {
        title: '✅ Home Remedy / Self-care',
        action: 'These symptoms can typically be managed at home',
        tips: [
          'Get plenty of rest',
          'Stay hydrated - drink water, herbal tea',
          'Use over-the-counter medications if needed',
          'Monitor symptoms - seek help if they worsen',
          'Maintain good nutrition'
        ],
        specialists: []
      };
    }
  };

  const clearForm = () => {
    setSymptoms('');
    setSelectedSymptoms([]);
    setAnalysisResult(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="user-dashboard-container">
      {/* Sidebar */}
      <aside className="user-sidebar">
        <div className="sidebar-header">
          <div className="logo-user-dashboard">
            <svg viewBox="0 0 100 100" className="logo-svg-user">
              <path d="M50 20 L65 35 L50 50 L35 35 Z" fill="white" opacity="0.9"/>
              <path d="M35 35 L50 50 L35 65 L20 50 Z" fill="white" opacity="0.7"/>
              <path d="M50 50 L65 65 L50 80 L35 65 Z" fill="white" opacity="0.9"/>
              <path d="M65 35 L80 50 L65 65 L50 50 Z" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <h2>HEALTH CHECK</h2>
        </div>

        <nav className="user-nav">
          <button 
            className={activeTab === 'symptom-checker' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('symptom-checker')}
          >
            <span className="nav-icon">🔍</span>
            <span>Symptom Checker</span>
          </button>
          <button 
            className={activeTab === 'history' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('history')}
          >
            <span className="nav-icon">📋</span>
            <span>My History</span>
          </button>
          <button 
            className={activeTab === 'health-info' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('health-info')}
          >
            <span className="nav-icon">📚</span>
            <span>Health Info</span>
          </button>
          <button 
            className={activeTab === 'settings' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="language-selector">
            <span className="nav-icon">🌍</span>
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-dropdown"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="user-main">
        {/* Header */}
        <header className="user-header">
          <div className="header-left">
            <h1>
              {activeTab === 'symptom-checker' && '🔍 Symptom Checker'}
              {activeTab === 'history' && '📋 My Health History'}
              {activeTab === 'health-info' && '📚 Health Information'}
              {activeTab === 'settings' && '⚙️ Settings'}
            </h1>
            <p className="header-subtitle">AI-Powered Health Assessment</p>
          </div>
          <div className="header-right">
            <button className="help-btn" title="Help">❓</button>
            <div className="user-profile-small">
              <div className="avatar-small">
                {localStorage.getItem('userEmail')?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Symptom Checker Tab */}
        {activeTab === 'symptom-checker' && (
          <div className="symptom-checker-content">
            <div className="checker-grid">
              {/* Input Section */}
              <section className="input-section">
                <div className="section-card">
                  <h2>📝 Describe Your Symptoms</h2>
                  
                  {/* Text Input */}
                  <div className="input-group">
                    <label>Type your symptoms (in natural language)</label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Example: I have a fever and sore throat, feeling very tired..."
                      rows="4"
                      className="symptom-textarea"
                    />
                  </div>

                  {/* Voice Input */}
                  <div className="voice-input-section">
                    <button 
                      className={`voice-btn ${isRecording ? 'recording' : ''}`}
                      onClick={toggleVoiceInput}
                    >
                      {isRecording ? '⏹️ Stop Recording' : '🎤 Voice Input'}
                    </button>
                    {isRecording && (
                      <span className="recording-indicator">🔴 Listening...</span>
                    )}
                  </div>

                  {/* Quick Select Symptoms */}
                  <div className="quick-select-section">
                    <label>Or select from common symptoms</label>
                    <div className="symptoms-grid">
                      {commonSymptoms.map(symptom => (
                        <button
                          key={symptom.id}
                          className={`symptom-chip ${selectedSymptoms.some(s => s.id === symptom.id) ? 'selected' : ''}`}
                          onClick={() => toggleSymptom(symptom)}
                        >
                          <span className="symptom-icon">{symptom.icon}</span>
                          <span className="symptom-label">{symptom.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Symptoms Display */}
                  {selectedSymptoms.length > 0 && (
                    <div className="selected-symptoms">
                      <label>Selected symptoms:</label>
                      <div className="selected-chips">
                        {selectedSymptoms.map(symptom => (
                          <span key={symptom.id} className="selected-chip">
                            {symptom.icon} {symptom.label}
                            <button onClick={() => toggleSymptom(symptom)}>×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    <button 
                      className="analyze-btn"
                      onClick={analyzeSymptoms}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? '⏳ Analyzing...' : '🔬 Analyze Symptoms'}
                    </button>
                    <button 
                      className="clear-btn"
                      onClick={clearForm}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </section>

              {/* Results Section */}
              {analysisResult && (
                <section className="results-section">
                  <div className="section-card">
                    <h2>📊 Analysis Results</h2>
                    
                    {/* Risk Level */}
                    <div className={`risk-indicator risk-${getRiskLevel(analysisResult.triage_label).color}`}>
                      <span className="risk-icon">{getRiskLevel(analysisResult.triage_label).icon}</span>
                      <div className="risk-content">
                        <h3>Risk Level: {getRiskLevel(analysisResult.triage_label).level}</h3>
                        <p className="urgency-text">{analysisResult.urgency}</p>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="recommendation-card">
                      <h3>{getRecommendation(analysisResult.triage_label).title}</h3>
                      <p className="recommendation-action">
                        {getRecommendation(analysisResult.triage_label).action}
                      </p>
                      
                      {/* Timeframe */}
                      <div className="timeframe-badge">
                        ⏰ {analysisResult.timeframe}
                      </div>
                    </div>

                    {/* AI Explanation */}
                    <div className="explanation-card">
                      <h4>🤖 AI Assessment</h4>
                      <p>{analysisResult.explanation}</p>
                      <div className="confidence-meter">
                        <label>Confidence: {Math.round(analysisResult.confidence_score * 100)}%</label>
                        <div className="confidence-bar">
                          <div 
                            className="confidence-fill"
                            style={{ width: `${analysisResult.confidence_score * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Care Tips */}
                    <div className="tips-card">
                      <h4>💡 Care Tips</h4>
                      <ul className="tips-list">
                        {getRecommendation(analysisResult.triage_label).tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Specialist Recommendations */}
                    {getRecommendation(analysisResult.triage_label).specialists.length > 0 && (
                      <div className="specialists-card">
                        <h4>👨‍⚕️ Recommended Specialists</h4>
                        <div className="specialists-list">
                          {getRecommendation(analysisResult.triage_label).specialists.map((specialist, index) => (
                            <span key={index} className="specialist-badge">{specialist}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Health Resources */}
                    <div className="resources-card">
                      <h4>🔗 Trusted Health Resources</h4>
                      <div className="resources-links">
                        <a href="https://www.who.int" target="_blank" rel="noopener noreferrer" className="resource-link">
                          🌍 WHO - World Health Organization
                        </a>
                        <a href="https://www.cdc.gov" target="_blank" rel="noopener noreferrer" className="resource-link">
                          🏛️ CDC - Centers for Disease Control
                        </a>
                        <a href="https://www.mohfw.gov.in" target="_blank" rel="noopener noreferrer" className="resource-link">
                          🇮🇳 Ministry of Health - India
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="history-content">
            <section className="section-card">
              <h2>📋 Your Symptom Check History</h2>
              
              {history.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>No history yet. Start checking your symptoms!</p>
                </div>
              ) : (
                <div className="history-list">
                  {history.map((item, index) => (
                    <div key={index} className="history-item">
                      <div className="history-header">
                        <span className="history-date">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                        <span className={`history-risk risk-${getRiskLevel(item.triage_label).color}`}>
                          {getRiskLevel(item.triage_label).icon} {getRiskLevel(item.triage_label).level}
                        </span>
                      </div>
                      <div className="history-symptoms">
                        <strong>Symptoms:</strong> {item.symptoms.join(', ')}
                      </div>
                      <div className="history-recommendation">
                        <strong>Recommendation:</strong> {item.action}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Health Info Tab */}
        {activeTab === 'health-info' && (
          <div className="health-info-content">
            <section className="section-card">
              <h2>📚 Health Information & Education</h2>
              
              <div className="info-categories">
                <div className="info-card">
                  <span className="info-icon">🤒</span>
                  <h3>Common Cold</h3>
                  <p>Learn about symptoms, treatment, and prevention of common cold.</p>
                  <ul>
                    <li>Rest and stay hydrated</li>
                    <li>Use over-the-counter medications</li>
                    <li>Usually resolves in 7-10 days</li>
                    <li>Wash hands frequently</li>
                  </ul>
                </div>

                <div className="info-card">
                  <span className="info-icon">🌡️</span>
                  <h3>Fever Management</h3>
                  <p>Understanding fever and when to seek medical help.</p>
                  <ul>
                    <li>Normal: 98.6°F (37°C)</li>
                    <li>Low-grade fever: 99-100.4°F</li>
                    <li>High fever: Above 103°F - seek help</li>
                    <li>Stay hydrated, rest, use fever reducers</li>
                  </ul>
                </div>

                <div className="info-card">
                  <span className="info-icon">🤢</span>
                  <h3>Food Poisoning</h3>
                  <p>Symptoms and care for foodborne illness.</p>
                  <ul>
                    <li>Nausea, vomiting, diarrhea</li>
                    <li>Usually resolves in 24-48 hours</li>
                    <li>Drink clear fluids, avoid solid foods initially</li>
                    <li>Seek help if severe dehydration occurs</li>
                  </ul>
                </div>

                <div className="info-card">
                  <span className="info-icon">💊</span>
                  <h3>Medication Safety</h3>
                  <p>Important guidelines for safe medication use.</p>
                  <ul>
                    <li>Always follow prescribed dosages</li>
                    <li>Don't share prescription medications</li>
                    <li>Check expiration dates</li>
                    <li>Be aware of drug interactions</li>
                  </ul>
                </div>

                <div className="info-card warning-card">
                  <span className="info-icon">⚠️</span>
                  <h3>When to Seek Emergency Care</h3>
                  <p>Know the warning signs that require immediate attention.</p>
                  <ul>
                    <li>Chest pain or pressure</li>
                    <li>Difficulty breathing</li>
                    <li>Severe bleeding</li>
                    <li>Loss of consciousness</li>
                    <li>Severe allergic reactions</li>
                    <li>Signs of stroke (FAST test)</li>
                  </ul>
                </div>

                <div className="info-card">
                  <span className="info-icon">🏃</span>
                  <h3>Preventive Care</h3>
                  <p>Tips for maintaining good health.</p>
                  <ul>
                    <li>Regular exercise (30 min/day)</li>
                    <li>Balanced, nutritious diet</li>
                    <li>7-9 hours of sleep</li>
                    <li>Regular health checkups</li>
                    <li>Stress management</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="settings-content">
            <section className="section-card">
              <h2>⚙️ Settings</h2>
              
              <div className="settings-group">
                <h3>🌍 Language Preferences</h3>
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="settings-select"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="settings-group">
                <h3>🔔 Notifications</h3>
                <label className="settings-toggle">
                  <input type="checkbox" defaultChecked />
                  <span>Enable health reminders</span>
                </label>
                <label className="settings-toggle">
                  <input type="checkbox" defaultChecked />
                  <span>Symptom tracking notifications</span>
                </label>
              </div>

              <div className="settings-group">
                <h3>🎤 Voice Input</h3>
                <label className="settings-toggle">
                  <input type="checkbox" defaultChecked />
                  <span>Enable voice recognition</span>
                </label>
              </div>

              <div className="settings-group">
                <h3>📊 Data & Privacy</h3>
                <button className="settings-btn">Export My Data</button>
                <button className="settings-btn danger">Clear History</button>
              </div>

              <div className="settings-group">
                <h3>ℹ️ About</h3>
                <p className="settings-info">
                  <strong>AI Healthcare Triage Bot v1.0.0</strong><br/>
                  This tool provides preliminary health assessment only.<br/>
                  Always consult healthcare professionals for medical advice.
                </p>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import TriageResult from '../components/TriageResult';
import { callTriageAPI } from '../services/api';

export default function Demo() {
  const [demoPayloads, setDemoPayloads] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load demo payloads
    fetch('/demo_payloads.json')
      .then(res => res.json())
      .then(data => setDemoPayloads(data))
      .catch(err => console.error('Failed to load demo payloads:', err));
  }, []);

  const handleDemoClick = async (payload) => {
    setLoading(true);
    setError(null);
    
    try {
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

  if (result) {
    return (
      <div className="container">
        <TriageResult result={result} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
          Demo Mode
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1.5rem' }}>
          Try out the triage system with pre-configured scenarios. Each button demonstrates
          a different severity level and expected response.
        </p>

        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            Analyzing symptoms...
          </div>
        )}

        {!loading && (
          <div className="demo-buttons">
            {demoPayloads.map((demo, index) => (
              <button
                key={index}
                className="demo-button"
                onClick={() => handleDemoClick(demo.payload)}
              >
                <strong>{demo.name}</strong>
                <div style={{ fontSize: '1rem', color: '#666', marginTop: '0.5rem' }}>
                  {demo.payload.symptoms_text}
                </div>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: '#888', 
                  marginTop: '0.5rem',
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <span>Age: {demo.payload.age}</span>
                  <span>Severity: {demo.payload.severity}</span>
                  {demo.payload.is_child && <span>👶 Child</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ background: '#fff3cd', borderLeft: '4px solid #ffc107' }}>
        <h3>ℹ️ About Demo Mode</h3>
        <p style={{ marginTop: '1rem' }}>
          These scenarios are designed to showcase the different triage levels:
        </p>
        <ul style={{ marginTop: '1rem', paddingLeft: '2rem', lineHeight: '1.8' }}>
          <li><strong>EMERGENCY:</strong> Requires immediate medical attention (call 112)</li>
          <li><strong>URGENT:</strong> Needs prompt medical care within hours</li>
          <li><strong>GP:</strong> Should see a doctor within 24-48 hours</li>
          <li><strong>SELF_CARE:</strong> Can be managed at home with monitoring</li>
        </ul>
      </div>
    </div>
  );
}

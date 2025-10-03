export default function TriageResult({ result, onReset }) {
  if (!result) return null;

  const getBannerClass = () => {
    return `triage-banner banner-${result.triage_level}`;
  };

  const shouldShowEmergencyCTA = () => {
    return result.triage_level === 'EMERGENCY';
  };

  return (
    <div className="triage-result">
      {result.ai_powered && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
          border: '2px solid rgba(102, 126, 234, 0.3)',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.95rem'
        }}>
          <span style={{ fontSize: '20px' }}>✨</span>
          <span style={{ color: '#5b21b6', fontWeight: '600' }}>
            AI-Powered Analysis by Google Gemini Flash 2.5
          </span>
        </div>
      )}
      
      <div className={getBannerClass()}>
        {result.triage_level.replace('_', ' ')}
      </div>

      {shouldShowEmergencyCTA() && (
        <a href="tel:112" style={{ textDecoration: 'none', display: 'block' }}>
          <button className="emergency-cta">
            🚨 CALL EMERGENCY: 112
          </button>
        </a>
      )}

      <div className="card">
        <h2>Assessment</h2>
        <p style={{ fontSize: '1.2rem', marginTop: '1rem', lineHeight: '1.8' }}>
          {result.explanation}
        </p>
      </div>

      {result.suggested_actions && result.suggested_actions.length > 0 && (
        <div className="card">
          <h2>Recommended Actions</h2>
          <ul style={{ 
            fontSize: '1.1rem', 
            marginTop: '1rem', 
            paddingLeft: '2rem',
            lineHeight: '2'
          }}>
            {result.suggested_actions.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        {result.triage_level !== 'EMERGENCY' && (
          <a 
            href="https://www.google.com/maps/search/medical+clinic+near+me" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', flex: 1, minWidth: '200px' }}
          >
            <button className="btn-primary" style={{ width: '100%' }}>
              🏥 Find Nearby Clinic
            </button>
          </a>
        )}
        
        <button 
          onClick={onReset} 
          className="btn-secondary"
          style={{ flex: 1, minWidth: '200px' }}
        >
          ← New Assessment
        </button>
      </div>

      {result.triage_level === 'SELF_CARE' && (
        <div className="card" style={{ marginTop: '2rem', background: '#e7f5ff' }}>
          <h3>Self-Care Tips</h3>
          <p style={{ marginTop: '1rem' }}>
            • Rest and stay hydrated<br />
            • Monitor your symptoms<br />
            • Seek medical help if symptoms worsen<br />
            • Consider over-the-counter medications as appropriate
          </p>
        </div>
      )}
    </div>
  );
}

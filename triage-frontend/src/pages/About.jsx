export default function About() {
  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
          About Medical Triage System
        </h1>
        
        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#646cff' }}>What is This?</h2>
          <p style={{ fontSize: '1.1rem', marginTop: '1rem', lineHeight: '1.8' }}>
            This is an AI-powered medical triage system designed to help assess the urgency
            of medical symptoms and provide guidance on the appropriate level of care needed.
            The system analyzes your symptoms and provides a triage recommendation along with
            suggested next steps.
          </p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#646cff' }}>How It Works</h2>
          <ol style={{ fontSize: '1.1rem', marginTop: '1rem', paddingLeft: '2rem', lineHeight: '2' }}>
            <li>Describe your symptoms in detail</li>
            <li>Select relevant symptom categories</li>
            <li>Provide your age and severity assessment</li>
            <li>Submit for AI-powered triage analysis</li>
            <li>Receive guidance on appropriate care level</li>
          </ol>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#646cff' }}>Triage Levels</h2>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              margin: '0.5rem 0', 
              borderLeft: '4px solid #dc3545',
              background: '#f8d7da'
            }}>
              <strong>EMERGENCY:</strong> Life-threatening condition requiring immediate medical attention.
              Call emergency services (112) immediately.
            </div>
            <div style={{ 
              padding: '1rem', 
              margin: '0.5rem 0', 
              borderLeft: '4px solid #fd7e14',
              background: '#fff3cd'
            }}>
              <strong>URGENT:</strong> Serious condition requiring medical attention within hours.
              Visit an urgent care facility or emergency room.
            </div>
            <div style={{ 
              padding: '1rem', 
              margin: '0.5rem 0', 
              borderLeft: '4px solid #ffc107',
              background: '#fff8e1'
            }}>
              <strong>GP (General Practitioner):</strong> Should see a doctor within 24-48 hours.
              Schedule an appointment with your doctor.
            </div>
            <div style={{ 
              padding: '1rem', 
              margin: '0.5rem 0', 
              borderLeft: '4px solid #28a745',
              background: '#d4edda'
            }}>
              <strong>SELF_CARE:</strong> Can likely be managed at home with monitoring.
              Rest, hydrate, and monitor symptoms.
            </div>
          </div>
        </section>
      </div>

      <div className="card" style={{ background: '#fff3cd', borderLeft: '4px solid #ffc107' }}>
        <h2 style={{ color: '#856404' }}>⚠️ Important Disclaimers</h2>
        <ul style={{ marginTop: '1rem', paddingLeft: '2rem', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <li><strong>This is NOT a substitute for professional medical advice.</strong></li>
          <li>Always consult with qualified healthcare professionals for medical decisions.</li>
          <li>In case of emergency, call 112 or your local emergency number immediately.</li>
          <li>This system provides guidance only and should not be relied upon exclusively.</li>
          <li>The AI assessment may not account for all medical factors and history.</li>
          <li>If you're unsure about your symptoms, always err on the side of caution and seek professional help.</li>
        </ul>
      </div>

      <div className="card">
        <h2 style={{ color: '#646cff' }}>Team Information</h2>
        <p style={{ fontSize: '1.1rem', marginTop: '1rem', lineHeight: '1.8' }}>
          This medical triage system was developed as part of a hackathon project to demonstrate
          the practical application of AI in healthcare triage. The system uses natural language
          processing and machine learning to analyze symptoms and provide appropriate care recommendations.
        </p>
        <p style={{ fontSize: '1.1rem', marginTop: '1rem', lineHeight: '1.8' }}>
          <strong>Technology Stack:</strong> React, Vite, React Router
        </p>
        <p style={{ fontSize: '1.1rem', marginTop: '1rem', lineHeight: '1.8' }}>
          <strong>Accessibility Features:</strong> Large fonts, high contrast, keyboard navigation,
          ARIA labels, and responsive design for all devices.
        </p>
      </div>

      <div className="card" style={{ background: '#e7f5ff', borderLeft: '4px solid #646cff' }}>
        <h2 style={{ color: '#1864ab' }}>📞 Emergency Resources</h2>
        <p style={{ fontSize: '1.1rem', marginTop: '1rem', lineHeight: '1.8' }}>
          <strong>Emergency Services:</strong> 112 (EU) / 911 (US)<br />
          <strong>Poison Control:</strong> Contact your local poison control center<br />
          <strong>Crisis Helpline:</strong> Contact your local mental health crisis line
        </p>
      </div>
    </div>
  );
}

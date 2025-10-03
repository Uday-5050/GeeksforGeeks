import { useState } from 'react';

const SYMPTOM_OPTIONS = [
  { id: 'fever', label: 'Fever' },
  { id: 'chest_pain', label: 'Chest Pain' },
  { id: 'breathlessness', label: 'Breathlessness' },
  { id: 'vomiting', label: 'Vomiting' },
  { id: 'drowsy', label: 'Drowsy/Confused' },
  { id: 'runny_nose', label: 'Runny Nose' },
];

const SEVERITY_OPTIONS = ['mild', 'moderate', 'severe'];

export default function TriageForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    symptoms_text: '',
    symptoms_list: [],
    age: '',
    is_child: false,
    severity: 'mild',
  });

  const handleCheckboxChange = (symptomId) => {
    setFormData(prev => ({
      ...prev,
      symptoms_list: prev.symptoms_list.includes(symptomId)
        ? prev.symptoms_list.filter(s => s !== symptomId)
        : [...prev.symptoms_list, symptomId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAgeChange = (e) => {
    const age = parseInt(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      age: e.target.value,
      is_child: age < 18
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h1 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>
        Medical Triage Assessment
      </h1>
      <p style={{ 
        fontSize: '0.95rem', 
        color: '#7c3aed', 
        marginBottom: '1.5rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>🤖</span> AI-Powered by Google Gemini Flash 2.5
      </p>
      
      <div className="form-group">
        <label htmlFor="symptoms_text">
          Describe Your Symptoms *
        </label>
        <textarea
          id="symptoms_text"
          rows="5"
          value={formData.symptoms_text}
          onChange={(e) => setFormData({ ...formData, symptoms_text: e.target.value })}
          placeholder="Please describe what you're experiencing in detail..."
          required
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>

      <div className="form-group">
        <label>Select Specific Symptoms</label>
        <div className="checkbox-group">
          {SYMPTOM_OPTIONS.map(symptom => (
            <div key={symptom.id} className="checkbox-item">
              <input
                type="checkbox"
                id={symptom.id}
                checked={formData.symptoms_list.includes(symptom.id)}
                onChange={() => handleCheckboxChange(symptom.id)}
              />
              <label htmlFor={symptom.id}>{symptom.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="age">Age *</label>
          <input
            type="number"
            id="age"
            value={formData.age}
            onChange={handleAgeChange}
            min="0"
            max="120"
            required
            placeholder="Enter age"
            style={{ width: '100%' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="severity">Symptom Severity *</label>
          <select
            id="severity"
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
            required
            style={{ width: '100%' }}
          >
            {SEVERITY_OPTIONS.map(sev => (
              <option key={sev} value={sev}>
                {sev.charAt(0).toUpperCase() + sev.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group" style={{ 
        background: '#f0f0f0', 
        padding: '1rem', 
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <input
          type="checkbox"
          id="is_child"
          checked={formData.is_child}
          onChange={(e) => setFormData({ ...formData, is_child: e.target.checked })}
          style={{ width: '24px', height: '24px', minHeight: 'auto' }}
        />
        <label htmlFor="is_child" style={{ margin: 0, cursor: 'pointer' }}>
          Patient is under 18 years old
        </label>
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{ 
          width: '100%', 
          marginTop: '1rem',
          fontSize: '1.3rem',
          padding: '1rem',
          background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ 
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '3px solid rgba(255,255,255,0.3)',
              borderTop: '3px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></span>
            AI Analyzing Your Symptoms...
          </span>
        ) : (
          '🤖 Get AI Diagnosis'
        )}
      </button>

      <p style={{ 
        marginTop: '1.5rem', 
        fontSize: '0.95rem', 
        color: '#666',
        textAlign: 'center'
      }}>
        ⚠️ This tool provides guidance only. Always seek professional medical advice for serious concerns.
      </p>
    </form>
  );
}

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
    <div className="triage-card">
      <div className="triage-header">
        <h2>Medical Triage Assessment</h2>
        <p>Please provide detailed information about your symptoms</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="symptoms_text" className="form-label">
            Describe Your Symptoms <span className="required">*</span>
          </label>
          <textarea
            id="symptoms_text"
            className="form-textarea"
            rows="5"
            value={formData.symptoms_text}
            onChange={(e) => setFormData({ ...formData, symptoms_text: e.target.value })}
            placeholder="Please describe what you're experiencing in detail..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Select Specific Symptoms</label>
          <div className="symptoms-grid">
            {SYMPTOM_OPTIONS.map(symptom => (
              <div key={symptom.id} className="symptom-checkbox">
                <input
                  type="checkbox"
                  id={symptom.id}
                  checked={formData.symptoms_list.includes(symptom.id)}
                  onChange={() => handleCheckboxChange(symptom.id)}
                />
                <label htmlFor={symptom.id} className="symptom-label">
                  <span className="symptom-icon"></span>
                  {symptom.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age" className="form-label">
              Age <span className="required">*</span>
            </label>
            <input
              type="number"
              id="age"
              className="form-input"
              value={formData.age}
              onChange={handleAgeChange}
              min="0"
              max="120"
              required
              placeholder="Enter age"
            />
          </div>

          <div className="form-group">
            <label htmlFor="severity" className="form-label">
              Symptom Severity <span className="required">*</span>
            </label>
            <select
              id="severity"
              className="form-select"
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              required
            >
              {SEVERITY_OPTIONS.map(sev => (
                <option key={sev} value={sev}>
                  {sev.charAt(0).toUpperCase() + sev.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              Analyzing Symptoms<span className="loading-spinner">⏳</span>
            </>
          ) : (
            '🔍 Get Triage Assessment'
          )}
        </button>

        <p style={{ 
          marginTop: '1.5rem', 
          fontSize: '0.95rem', 
          color: '#888',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          ⚠️ <strong>Disclaimer:</strong> This tool provides guidance only. Always seek professional medical advice for serious concerns.
        </p>
      </form>
    </div>
  );
}

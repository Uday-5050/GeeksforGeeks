import { useState } from 'react';
import TriageForm from '../components/TriageForm';
import TriageResult from '../components/TriageResult';
import { callTriageAPI, buildTriagePayload } from '../services/api';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="container">
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

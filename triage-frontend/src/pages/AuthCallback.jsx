import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { storeAuthSession, fetchSession, clearAuthStorage } from '../services/auth';

function decodeUserPayload(encoded) {
  if (!encoded) {
    return null;
  }

  try {
    const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode user payload', error);
    return null;
  }
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Completing sign-in...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const provider = params.get('provider');
    const encodedUser = params.get('user');

    console.log('[AuthCallback] Received params:', { token: token?.substring(0, 20) + '...', provider, encodedUser: encodedUser?.substring(0, 20) + '...' });

    if (!token || !encodedUser) {
      console.error('[AuthCallback] Missing token or user');
      setError('Missing authentication details. Please try signing in again.');
      return;
    }

    const user = decodeUserPayload(encodedUser);
    if (!user) {
      console.error('[AuthCallback] Failed to decode user payload');
      setError('We could not verify your account details.');
      return;
    }

    console.log('[AuthCallback] User decoded successfully:', user);

    // Store the session - don't call fetchSession, we already have a valid token!
    const session = storeAuthSession({ token, user, provider });
    console.log('[AuthCallback] Session stored:', session);

    setStatus('Signed in successfully. Redirecting...');
    
    // Navigate immediately without fetching session again
    setTimeout(() => {
      const destination = session.user.role === 'admin' ? '/dashboard' : '/home';
      console.log('[AuthCallback] Redirecting to:', destination);
      navigate(destination, { replace: true });
    }, 1000);
    
  }, [location.search, navigate]);

  return (
    <div className="auth-callback-screen">
      <div className="auth-callback-card">
        <h1>SymptomScan</h1>
        {!error ? (
          <>
            <p>{status}</p>
            <p>Please wait while we finalize your login.</p>
          </>
        ) : (
          <>
            <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
            <button
              type="button"
              className="signin-button"
              onClick={() => navigate('/login', { replace: true })}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

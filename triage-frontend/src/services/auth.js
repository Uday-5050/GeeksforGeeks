import { API_BASE_URL, FRONTEND_BASE_URL, AUTH_STORAGE_KEY } from './config';

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  const role = user.email && user.email.toLowerCase().includes('admin') ? 'admin' : 'user';
  return { ...user, role };
}

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse auth session from storage', error);
    return null;
  }
}

export function getAccessToken() {
  const stored = getStoredAuth();
  return stored?.token || null;
}

export function storeAuthSession({ token, user, provider }) {
  const normalizedUser = normalizeUser(user);
  const payload = {
    token,
    user: normalizedUser,
    provider: provider || normalizedUser?.provider,
    stored_at: Date.now(),
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function clearAuthStorage() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function startOAuthLogin(provider, redirectPath = '/auth/callback') {
  const redirectUrl = `${FRONTEND_BASE_URL}${redirectPath}`;
  const response = await fetch(
    `${API_BASE_URL}/api/auth/${provider}/login?client_redirect_url=${encodeURIComponent(redirectUrl)}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    let errorMessage = 'Unable to initiate OAuth login';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData?.detail || errorMessage;
    } catch {
      // If JSON parsing fails, try to get text
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch {
        // Use default error message
      }
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function devLogin({ email, password, name }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/dev-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.detail || 'Unable to log in with email and password');
  }

  const data = await response.json();
  return storeAuthSession({ token: data.access_token, user: data.user, provider: data.user?.provider });
}

export async function fetchSession() {
  const token = getAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
    method: 'GET',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    clearAuthStorage();
    throw new Error('Session expired');
  }

  const data = await response.json();
  return storeAuthSession({ token: data.access_token, user: data.user, provider: data.user?.provider });
}

export async function logout() {
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  clearAuthStorage();
}

export function isAuthenticated() {
  return !!getAccessToken();
}

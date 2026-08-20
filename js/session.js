const SESSION_KEY = 'libreta_session';

export function startSession(username) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username, startedAt: Date.now() }));
}

export function getSession() {
  const savedSession = sessionStorage.getItem(SESSION_KEY);
  if (!savedSession) return null;
  try { return JSON.parse(savedSession); } catch { clearSession(); return null; }
}

export function clearSession() { sessionStorage.removeItem(SESSION_KEY); }

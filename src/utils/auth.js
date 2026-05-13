// ─── Authentication System ───
// localStorage-based secure auth with hashed passwords

const AUTH_STORAGE_KEY = 'hunter_auth';
const USERS_STORAGE_KEY = 'hunter_users';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'hunter_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function saveUsers(users) { localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users)); }

function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null');
    if (session && session.expiresAt > Date.now()) return session;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  } catch { return null; }
}

function saveSession(session) { localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session)); }

export async function register(name, email, password) {
  if (!name.trim() || !email.trim() || !password) return { success: false, error: 'All fields are required' };
  if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Invalid email address' };

  const users = getUsers();
  const emailKey = email.toLowerCase().trim();
  if (users[emailKey]) return { success: false, error: 'Email already registered' };

  const hashedPw = await hashPassword(password);
  users[emailKey] = {
    name: name.trim(), email: emailKey, passwordHash: hashedPw,
    createdAt: Date.now(), language: 'en-IN',
    progress: { topicIdx: 0, emotions: [], mastered: [], badges: [], responseTimes: [], retryCount: 0 },
  };
  saveUsers(users);

  const session = { email: emailKey, name: name.trim(), loggedInAt: Date.now(), expiresAt: Date.now() + 7 * 24 * 3600000 };
  saveSession(session);
  return { success: true, user: users[emailKey], session };
}

export async function login(email, password) {
  if (!email.trim() || !password) return { success: false, error: 'Email and password required' };
  const users = getUsers();
  const emailKey = email.toLowerCase().trim();
  const user = users[emailKey];
  if (!user) return { success: false, error: 'No account found with this email' };
  const hashedPw = await hashPassword(password);
  if (hashedPw !== user.passwordHash) return { success: false, error: 'Incorrect password' };
  const session = { email: emailKey, name: user.name, loggedInAt: Date.now(), expiresAt: Date.now() + 7 * 24 * 3600000 };
  saveSession(session);
  return { success: true, user, session };
}

export function logout() { localStorage.removeItem(AUTH_STORAGE_KEY); }
export function getCurrentSession() { return getSession(); }

export function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  return users[session.email] || null;
}

export function updateUserProgress(email, progress) {
  const users = getUsers();
  if (users[email]) { users[email].progress = { ...users[email].progress, ...progress }; saveUsers(users); }
}

export function updateUserLanguage(email, language) {
  const users = getUsers();
  if (users[email]) { users[email].language = language; saveUsers(users); }
}

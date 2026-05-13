// ─── Authentication System ───
// Secure localStorage-based auth with Web Crypto API hashing

const USERS_KEY = 'hunter_users';
const SESSION_KEY = 'hunter_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Hash password using Web Crypto API (SHA-256 + salt)
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSessionToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch { return {}; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Register a new user
export async function registerUser(name, email, password) {
  const users = getUsers();
  const emailKey = email.toLowerCase().trim();

  if (users[emailKey]) {
    return { success: false, error: 'Account already exists with this email' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }
  if (!name.trim()) {
    return { success: false, error: 'Name is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailKey)) {
    return { success: false, error: 'Please enter a valid email' };
  }

  const salt = generateSalt();
  const hash = await hashPassword(password, salt);

  users[emailKey] = {
    name: name.trim(),
    email: emailKey,
    salt,
    hash,
    createdAt: Date.now(),
    preferences: { language: 'en-IN' },
    progress: { topicIdx: 0, emotions: [], mastered: [], badges: [] },
  };

  saveUsers(users);

  const token = generateSessionToken();
  const session = { email: emailKey, token, expiresAt: Date.now() + SESSION_DURATION };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, user: { name: users[emailKey].name, email: emailKey } };
}

// Login
export async function loginUser(email, password) {
  const users = getUsers();
  const emailKey = email.toLowerCase().trim();
  const user = users[emailKey];

  if (!user) return { success: false, error: 'No account found with this email' };

  const hash = await hashPassword(password, user.salt);
  if (hash !== user.hash) return { success: false, error: 'Incorrect password' };

  const token = generateSessionToken();
  const session = { email: emailKey, token, expiresAt: Date.now() + SESSION_DURATION };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, user: { name: user.name, email: emailKey } };
}

// Check session
export function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (!session || Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    const users = getUsers();
    const user = users[session.email];
    if (!user) return null;
    return { name: user.name, email: session.email, preferences: user.preferences, progress: user.progress };
  } catch { return null; }
}

// Logout
export function logout() { localStorage.removeItem(SESSION_KEY); }

// Update preferences
export function updatePreferences(email, prefs) {
  const users = getUsers();
  if (users[email]) {
    users[email].preferences = { ...users[email].preferences, ...prefs };
    saveUsers(users);
  }
}

// Save progress
export function saveProgress(email, progress) {
  const users = getUsers();
  if (users[email]) {
    users[email].progress = { ...users[email].progress, ...progress };
    saveUsers(users);
  }
}

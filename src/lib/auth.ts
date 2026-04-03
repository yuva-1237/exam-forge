import { users, generateId } from './db';
import type { User } from '@/types';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  return sha256(salt + password + salt);
}

export async function verifyPassword(password: string, salt: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password, salt);
  return computed === hash;
}

// JWT-like token: base64 encoded JSON with expiry
export function createToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  return btoa(JSON.stringify(payload));
}

export function verifyToken(token: string): { id: string; email: string; name: string; role: 'admin' | 'user' } | null {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) return null;
    return { id: payload.id, email: payload.email, name: payload.name, role: payload.role };
  } catch {
    return null;
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
  if (users.getByEmail(email)) {
    throw new Error('Email already registered');
  }

  // Validate
  if (!name || name.length < 2) throw new Error('Name must be at least 2 characters');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email address');
  if (password.length < 8) throw new Error('Password must be at least 8 characters');
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) throw new Error('Password must contain uppercase, lowercase, and number');

  const salt = generateSalt();
  const hashedPassword = await hashPassword(password, salt);

  const user: User = {
    id: generateId(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    salt,
    name: name.trim(),
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  users.add(user);
  const token = createToken(user);
  return { user, token };
}

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  const user = users.getByEmail(email.toLowerCase().trim());
  if (!user) throw new Error('Invalid email or password');

  const valid = await verifyPassword(password, user.salt, user.password);
  if (!valid) throw new Error('Invalid email or password');

  const token = createToken(user);
  return { user, token };
}

const TOKEN_KEY = 'mcq_auth_token';
export const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);
export const getCurrentUser = (): { id: string; email: string; name: string; role: 'admin' | 'user' } | null => {
  const token = getToken();
  if (!token) return null;
  return verifyToken(token);
};

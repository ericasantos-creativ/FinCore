import { DB } from './db.js';
import { Utils } from './utils.js';
import { Store } from './store.js';

const STORAGE_KEY = 'fincore_session';

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${password}:${salt}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function findUserByEmail(email) {
  const users = await DB.getAll('users');
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function createSession(userId, remember) {
  const expiresAt = new Date(Date.now() + (remember ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 2));
  const token = Utils.generateId();
  const session = { userId, token, expiresAt: expiresAt.toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export const Auth = {
  async login(email, password, remember = false) {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const hash = await hashPassword(password, user.password_salt || '');
    if (hash !== user.password_hash) {
      throw new Error('Senha inválida');
    }

    const session = createSession(user.id, remember);
    Store.setState({ user, activeCompany: user.default_company || null });
    return session;
  },

  async register({ name, email, password }) {
    const existing = await findUserByEmail(email);
    if (existing) {
      throw new Error('Já existe uma conta com esse e-mail');
    }

    const salt = Utils.generateId();
    const hash = await hashPassword(password, salt);
    const user = {
      id: Utils.generateId(),
      nome: name,
      email,
      password_hash: hash,
      password_salt: salt,
      avatar: '',
      moeda: 'BRL',
      idioma: 'pt-BR',
      tema: 'dark',
      notificacoes: true,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };

    await DB.add('users', user);
    const session = createSession(user.id, true);
    Store.setState({ user, activeCompany: null });
    return session;
  },

  logout() {
    console.log('[Auth] Fazendo logout...');
    localStorage.removeItem(STORAGE_KEY);
    Store.reset();
    console.log('[Auth] Logout completado e Store resetado');
  },

  isAuthenticated() {
    const session = this.getSession();
    if (!session) return false;
    const expiresAt = new Date(session.expiresAt);
    return expiresAt > new Date();
  },

  getSession() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;
    const user = await DB.get('users', session.userId);
    return user;
  },

  async updatePassword(oldPassword, newPassword) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const oldHash = await hashPassword(oldPassword, user.password_salt || '');
    if (oldHash !== user.password_hash) {
      throw new Error('Senha atual incorreta');
    }

    const salt = Utils.generateId();
    const newHash = await hashPassword(newPassword, salt);
    await DB.update('users', user.id, {
      password_hash: newHash,
      password_salt: salt,
      atualizado_em: new Date().toISOString()
    });
  }
};

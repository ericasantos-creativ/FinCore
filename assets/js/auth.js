import { supabase } from './supabase.js';
import { Store } from './store.js';

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

function mapProfileToUser(profile) {
  if (!profile) return null;
  return {
    id: profile.id,
    nome: profile.full_name || 'Usuario',
    email: profile.email || '',
    moeda: profile.currency || 'BRL',
    idioma: profile.locale || 'pt-BR',
    tema: profile.theme || 'dark',
    notificacoes: profile.notifications_enabled ?? true,
    avatar: profile.avatar_url || '',
    slogan: profile.slogan_image_base64 || '',
    default_company: profile.active_company_id || null
  };
}

export const Auth = {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    const userId = data?.user?.id;
    if (!userId) return null;

    const profile = await fetchProfile(userId);
    const user = mapProfileToUser(profile);
    Store.setState({
      user,
      activeCompany: user?.default_company || null,
      slogan: user?.slogan || ''
    });
    return data.session;
  },

  async register({ name, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });

    if (error) throw error;

    const userId = data?.user?.id;
    if (userId) {
      await supabase.from('profiles').upsert({
        id: userId,
        full_name: name,
        email
      });
    }

    if (!data.session) {
      const login = await supabase.auth.signInWithPassword({ email, password });
      if (login.error) throw login.error;
      return login.data.session;
    }

    return data.session;
  },

  async logout() {
    await supabase.auth.signOut();
    Store.reset();
  },

  async isAuthenticated() {
    const { data } = await supabase.auth.getSession();
    return Boolean(data?.session);
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;
    if (!userId) return null;

    const profile = await fetchProfile(userId);
    return mapProfileToUser(profile);
  },

  async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },

  async updateEmail(newEmail) {
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) throw error;
  },

  async requestPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
};

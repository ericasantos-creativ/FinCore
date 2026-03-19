import { Theme } from './theme.js';
import { Router } from './router.js';
import { Auth } from './auth.js';
import { DB } from './db.js';
import { Store } from './store.js';
import { Dashboard } from './modules/dashboard.js';
import { Reports } from './modules/reports.js';
import { Transactions } from './modules/transactions.js';
import { Accounts } from './modules/accounts.js';
import { Profile } from './modules/profile.js';
import { Utils } from './utils.js';

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service Worker registrado:', reg);
  } catch (error) {
    console.warn('Falha ao registrar Service Worker:', error);
  }
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach((el) => {
    el.hidden = el.id !== screenId;
  });
}

function showAppShell() {
  document.getElementById('auth-screen').hidden = true;
  document.getElementById('app-shell').hidden = false;
}

function showAuthScreen() {
  console.log('[FinCore] Exibindo tela de autenticação');
  document.getElementById('app-shell').hidden = true;
  document.getElementById('auth-screen').hidden = false;
  
  // Limpar formulários
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  if (loginForm) {
    loginForm.reset();
    loginForm.querySelectorAll('.form-message').forEach(el => el.textContent = '');
  }
  
  if (registerForm) {
    registerForm.reset();
    registerForm.querySelectorAll('.form-message').forEach(el => el.textContent = '');
  }
}

function updateHeaderUser(user) {
  const initials = (user?.nome || 'Usuário')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
  const el = document.getElementById('user-initials');
  if (el) el.textContent = initials;
}

function setupAuthListeners() {
  console.log('[FinCore] setupAuthListeners() chamada - usando event delegation');
  
  // Login form submit - usando event delegation
  document.addEventListener('submit', async (event) => {
    const form = event.target;
    if (!form.id) return;

    // ===== LOGIN FORM =====
    if (form.id === 'login-form') {
      console.log('[FinCore] Evento submit do login disparado');
      event.preventDefault();
      
      const email = form.email.value.trim();
      const password = form.password.value.trim();
      const remember = form['remember-me'].checked;
      console.log('[FinCore] Data do formulário:', { email, password: '***', remember });

      const emailError = form.querySelector('#login-email + .form-message');
      const passwordError = form.querySelector('#login-password + .form-message');
      
      if (emailError) emailError.textContent = '';
      if (passwordError) passwordError.textContent = '';

      if (!Utils.validateEmail(email)) {
        if (emailError) emailError.textContent = 'Digite um e-mail válido.';
        form.email.focus();
        return;
      }

      if (!Utils.validatePassword(password)) {
        if (passwordError) passwordError.textContent = 'A senha precisa ter ao menos 8 caracteres.';
        form.password.focus();
        return;
      }

      try {
        console.log('[FinCore] Tentando fazer login...');
        await Auth.login(email, password, remember);
        console.log('[FinCore] Login bem-sucedido!');
        const user = await Auth.getCurrentUser();
        Store.setState({ user });
        updateHeaderUser(user);
        showAppShell();
        Router.init();
        console.log('[FinCore] Inicializando Dashboard...');
        Dashboard.init();
        console.log('[FinCore] Inicializando Reports...');
        Reports.init();
        console.log('[FinCore] Inicializando Transactions...');
        Transactions.init();
        console.log('[FinCore] Inicializando Accounts...');
        Accounts.init();
        console.log('[FinCore] Inicializando Profile...');
        Profile.init();
        console.log('[FinCore] Módulos inicializados com sucesso');
        Utils.showToast('Login realizado com sucesso!', 'success');
      } catch (error) {
        console.error('[FinCore] Erro no login:', error);
        Utils.showToast(error.message, 'error');
      }
      return;
    }

    // ===== REGISTER FORM =====
    if (form.id === 'register-form') {
      console.log('[FinCore] Evento submit do registro disparado');
      event.preventDefault();
      
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value.trim();

      const nameError = form.querySelector('#register-name + .form-message');
      const emailError = form.querySelector('#register-email + .form-message');
      const passwordError = form.querySelector('#register-password + .form-message');

      if (nameError) nameError.textContent = '';
      if (emailError) emailError.textContent = '';
      if (passwordError) passwordError.textContent = '';

      if (!name) {
        if (nameError) nameError.textContent = 'Informe seu nome.';
        form.name.focus();
        return;
      }

      if (!Utils.validateEmail(email)) {
        if (emailError) emailError.textContent = 'Digite um e-mail válido.';
        form.email.focus();
        return;
      }

      if (!Utils.validatePassword(password)) {
        if (passwordError) passwordError.textContent = 'A senha precisa ter ao menos 8 caracteres.';
        form.password.focus();
        return;
      }

      try {
        console.log('[FinCore] Criando nova conta...');
        await Auth.register({ name, email, password });
        const user = await Auth.getCurrentUser();
        Store.setState({ user });
        updateHeaderUser(user);
        showAppShell();
        Router.init();
        Dashboard.init();
        Transactions.init();
        Accounts.init();
        Utils.showToast('Conta criada com sucesso!', 'success');
      } catch (error) {
        console.error('[FinCore] Erro no registro:', error);
        Utils.showToast(error.message, 'error');
      }
      return;
    }

    // ===== RESET PASSWORD FORM =====
    if (form.id === 'reset-password-form') {
      console.log('[FinCore] Evento submit do reset de senha disparado');
      event.preventDefault();
      
      const email = form.email.value.trim();
      const emailError = form.querySelector('#reset-email + .form-message');
      
      if (emailError) emailError.textContent = '';

      if (!Utils.validateEmail(email)) {
        if (emailError) emailError.textContent = 'Digite um e-mail válido.';
        form.email.focus();
        return;
      }

      try {
        console.log('[FinCore] Buscando usuário...');
        const users = await DB.getAll('users');
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          Utils.showToast('Nenhuma conta encontrada com este e-mail.', 'error');
          return;
        }

        // Gera nova senha temporária
        const newPassword = Utils.generateId().substring(0, 12);
        const salt = Utils.generateId();
        const hash = newPassword; // Simplificado para MVP
        
        await DB.update('users', user.id, {
          password_hash: hash,
          password_salt: salt,
          atualizado_em: new Date().toISOString()
        });

        Utils.showToast(`Link de recuperação enviado para ${email}. Nova senha: ${newPassword}`, 'success');
        setTimeout(() => {
          document.getElementById('reset-password-screen').hidden = true;
          document.getElementById('login-form').hidden = false;
          form.reset();
        }, 3000);
      } catch (error) {
        console.error('[FinCore] Erro no reset de senha:', error);
        Utils.showToast('Erro ao redefinir senha.', 'error');
      }
      return;
    }
  }, true); // Usar capture phase

  // Click events - usando event delegation
  document.addEventListener('click', (event) => {
    const btn = event.target.closest('button, a');
    if (!btn) return;

    const id = btn.id;

    // Link "Criar conta"
    if (id === 'register-link') {
      event.preventDefault();
      document.getElementById('login-form').hidden = true;
      document.getElementById('register-screen').hidden = false;
      return;
    }

    // Link "Voltar ao login"
    if (id === 'login-link') {
      event.preventDefault();
      document.getElementById('register-screen').hidden = true;
      document.getElementById('reset-password-screen').hidden = true;
      document.getElementById('login-form').hidden = false;
      return;
    }

    // Link "Esqueci minha senha"
    if (id === 'forgot-password') {
      event.preventDefault();
      document.getElementById('login-form').hidden = true;
      document.getElementById('register-screen').hidden = true;
      document.getElementById('reset-password-screen').hidden = false;
      return;
    }

    // Link "Voltar ao login" (do reset)
    if (id === 'back-to-login') {
      event.preventDefault();
      document.getElementById('reset-password-screen').hidden = true;
      document.getElementById('login-form').hidden = false;
      return;
    }

    // Toggle password visibility
    if (id === 'toggle-password') {
      const input = document.getElementById('login-password');
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
      return;
    }
  });
}

function setupAppListeners() {
  const logoutBtn = document.getElementById('logout');
  const themeToggle = document.getElementById('toggle-theme');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');

  logoutBtn?.addEventListener('click', () => {
    console.log('[FinCore] Botão Sair clicado');
    Auth.logout();
    showAuthScreen();
    setupAuthListeners(); // Re-configurar listeners para tela de login
    Utils.showToast('Desconectado com sucesso!', 'success');
  });

  themeToggle?.addEventListener('click', () => {
    Theme.toggle();
  });

  sidebarToggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
  });

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      const searchOverlay = document.getElementById('search-overlay');
      if (searchOverlay) {
        searchOverlay.hidden = !searchOverlay.hidden;
      }
    }
  });
}

async function runSplash() {
  const progress = document.getElementById('splash-progress');
  const splash = document.getElementById('splash-screen');
  console.log('[FinCore] runSplash() chamado');
  console.log('[FinCore] Elementos splash encontrados:', { progress: !!progress, splash: !!splash });
  
  if (!progress || !splash) {
    console.warn('[FinCore] Elementos de splash não encontrados');
    return;
  }

  console.log('[FinCore] Splash animação iniciada');
  let value = 0;
  const interval = setInterval(() => {
    value = Math.min(100, value + Math.floor(Math.random() * 12) + 8);
    console.log('[FinCore] Splash progress:', value + '%');
    progress.style.width = `${value}%`;
    if (value >= 100) {
      clearInterval(interval);
      console.log('[FinCore] Splash carregamento 100%, começando fade-out');
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.hidden = true;
        console.log('[FinCore] Splash escondido');
      }, 500);
    }
  }, 200);

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('[FinCore] Splash Promise resolvida - saindo do splash');
      resolve();
    }, 2600);
  });
}

async function init() {
  try {
    console.log('[FinCore] Iniciando aplicação...');
    
    Theme.init();
    console.log('[FinCore] Tema inicializado');
    
    await DB.init();
    console.log('[FinCore] IndexedDB inicializado');
    
    await registerServiceWorker();
    console.log('[FinCore] Service Worker registrado');

    const authenticated = Auth.isAuthenticated();
    console.log('[FinCore] Autenticação verificada:', authenticated);
    
    await runSplash();
    console.log('[FinCore] Splash finalizado');

    if (authenticated) {
      console.log('[FinCore] Carregando app para usuário autenticado...');
      const user = await Auth.getCurrentUser();
      Store.setState({ user });
      updateHeaderUser(user);
      showAppShell();
      Router.init();
      Dashboard.init();
      Transactions.init();
      Accounts.init();
      console.log('[FinCore] App carregado!');
    } else {
      console.log('[FinCore] Exibindo tela de login...');
      showAuthScreen();
      setupAuthListeners();
      Router.init();
      console.log('[FinCore] Tela de login pronta!');
    }

    setupAppListeners();
    console.log('[FinCore] Listeners da app configurados. App pronto!');
  } catch (error) {
    console.error('[FinCore] ERRO FATAL:', error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('[FinCore] DOMContentLoaded disparado!');
  init();
});

console.log('[FinCore] Script app.js carregado');

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
import { Companies } from './modules/companies.js';
import { Categories } from './modules/categories.js';
import { Goals } from './modules/goals.js';
import { Investments } from './modules/investments.js';
import { Suppliers } from './modules/suppliers.js';
import { Utils } from './utils.js';
import { LocalData } from './local-data.js';

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
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.hidden = true;
    splash.classList.remove('fade-out');
  }
  document.getElementById('auth-screen').hidden = true;
  document.getElementById('app-shell').hidden = false;
}

function showAuthScreen() {
  console.log('[FinCore] Exibindo tela de autenticação');
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.hidden = true;
    splash.classList.remove('fade-out');
  }
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

async function loadCompanies() {
  try {
    const companies = await DB.getAll('companies');
    Store.setState({ companies });

    const current = Store.getState().activeCompany;
    if (!current) {
      const active = companies.find((company) => company.ativa) || companies[0];
      Store.setState({ activeCompany: active?.id ?? null });
    }
  } catch (error) {
    console.error('[FinCore] Erro ao carregar empresas:', error);
  }
}

function refreshAfterCompanyChange() {
  Dashboard.refreshAll?.();
  Reports.loadReports?.();
  Transactions.loadList?.();
  Accounts.loadList?.();
  Companies.loadList?.();
  Categories.loadList?.();
  Goals.loadList?.();
  Investments.loadList?.();
  Suppliers.loadList?.();
}

function renderCompanyMenu() {
  const menu = document.getElementById('company-menu');
  const label = document.getElementById('company-pill-label');
  if (!menu || !label) return;

  const { companies = [], activeCompany } = Store.getState();
  const active = companies.find((company) => company.id === activeCompany);
  label.textContent = active?.nome || 'Todas empresas';

  const items = [
    { id: null, nome: 'Todas empresas' },
    ...companies
  ];

  menu.innerHTML = items
    .map((company) => {
      const isActive = (company.id || null) === (activeCompany || null);
      return `
        <div class="company-menu__item ${isActive ? 'active' : ''}" data-id="${company.id ?? ''}">
          <span>${company.nome || 'Todas empresas'}</span>
          ${isActive ? '<span>✓</span>' : ''}
        </div>
      `;
    })
    .join('');

  menu.querySelectorAll('.company-menu__item').forEach((item) => {
    item.addEventListener('click', async () => {
      const id = item.getAttribute('data-id') || null;
      const currentUser = Store.getState().user;
      Store.setState({
        activeCompany: id,
        user: currentUser ? { ...currentUser, default_company: id } : currentUser
      });

      if (currentUser?.id) {
        try {
          await DB.update('users', currentUser.id, { default_company: id });
        } catch (error) {
          console.error('[FinCore] Erro ao salvar empresa ativa:', error);
        }
      }

      renderCompanyMenu();
      refreshAfterCompanyChange();
      menu.hidden = true;
      const pill = document.getElementById('company-pill');
      if (pill) pill.setAttribute('aria-expanded', 'false');
    });
  });
}

function initCompanySwitcher() {
  const pill = document.getElementById('company-pill');
  const menu = document.getElementById('company-menu');
  const wrapper = document.getElementById('company-switcher');
  if (!pill || !menu || !wrapper) return;

  if (pill.dataset.initialized === 'true') {
    renderCompanyMenu();
    return;
  }

  pill.dataset.initialized = 'true';

  pill.addEventListener('click', () => {
    const isHidden = menu.hidden;
    menu.hidden = !isHidden;
    pill.setAttribute('aria-expanded', String(isHidden));
  });

  document.addEventListener('click', (event) => {
    if (!wrapper.contains(event.target)) {
      menu.hidden = true;
      pill.setAttribute('aria-expanded', 'false');
    }
  });

  Store.subscribe(() => {
    renderCompanyMenu();
  });
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
        Store.setState({ user, slogan: user?.slogan || '' });
        await loadCompanies();
        updateHeaderUser(user);
        showAppShell();
        initCompanySwitcher();
        Router.init();
        console.log('[FinCore] Inicializando Dashboard...');
        Dashboard.init();
        console.log('[FinCore] Inicializando Reports...');
        Reports.init();
        console.log('[FinCore] Inicializando Transactions...');
        Transactions.init();
        console.log('[FinCore] Inicializando Accounts...');
        Accounts.init();
        console.log('[FinCore] Inicializando Companies...');
        Companies.init();
        console.log('[FinCore] Inicializando Categories...');
        Categories.init();
        console.log('[FinCore] Inicializando Goals...');
        Goals.init();
        console.log('[FinCore] Inicializando Investments...');
        Investments.init();
        console.log('[FinCore] Inicializando Suppliers...');
        Suppliers.init();
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
        Store.setState({ user, slogan: user?.slogan || '' });
        await loadCompanies();
        updateHeaderUser(user);
        showAppShell();
        initCompanySwitcher();
        Router.init();
        Dashboard.init();
        Reports.init();
        Transactions.init();
        Accounts.init();
        Companies.init();
        Categories.init();
        Goals.init();
        Investments.init();
        Suppliers.init();
        Profile.init();
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
        await Auth.requestPasswordReset(email);
        Utils.showToast(`Link de recuperação enviado para ${email}.`, 'success');
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

  const handleLogout = async () => {
    console.log('[FinCore] Botão Sair clicado');
    try {
      await Auth.logout();
      Utils.showToast('Desconectado com sucesso!', 'success');
    } catch (error) {
      console.error('[FinCore] Erro ao sair:', error);
      Utils.showToast('Erro ao sair. Tente novamente.', 'error');
    } finally {
      showAuthScreen();
      setupAuthListeners();
      window.location.hash = '';
    }
  };

  logoutBtn?.addEventListener('click', handleLogout);

  document.addEventListener('click', (event) => {
    const target = event.target;
    const button = target?.closest('#logout');
    if (button) {
      event.preventDefault();
      handleLogout();
    }
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
      splash.hidden = true;
      resolve();
    }, 2600);
  });
}

async function init() {
  try {
    console.log('[FinCore] Iniciando aplicação...');

    LocalData.init();

    // Fallback global para não travar na splash
    const splashFallback = setTimeout(() => {
      const splash = document.getElementById('splash-screen');
      if (splash && !splash.hidden) {
        splash.hidden = true;
        showAuthScreen();
      }
    }, 4500);
    
    Theme.init();
    console.log('[FinCore] Tema inicializado');
    
    await registerServiceWorker();
    console.log('[FinCore] Service Worker registrado');

    let authenticated = false;
    try {
      authenticated = await Auth.isAuthenticated();
    } catch (authError) {
      console.error('[FinCore] Erro ao verificar autenticação:', authError);
    }
    console.log('[FinCore] Autenticação verificada:', authenticated);
    
    await runSplash();
    console.log('[FinCore] Splash finalizado');

    if (authenticated) {
      console.log('[FinCore] Carregando app para usuário autenticado...');
      const user = await Auth.getCurrentUser();
      Store.setState({ user, slogan: user?.slogan || '' });
      await loadCompanies();
      updateHeaderUser(user);
      showAppShell();
      initCompanySwitcher();
      Router.init();
      Dashboard.init();
      Reports.init();
      Transactions.init();
      Accounts.init();
      Companies.init();
      Categories.init();
      Goals.init();
      Investments.init();
      Suppliers.init();
      Profile.init();
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
    clearTimeout(splashFallback);
  } catch (error) {
    console.error('[FinCore] ERRO FATAL:', error);
    const splash = document.getElementById('splash-screen');
    if (splash) splash.hidden = true;
    showAuthScreen();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('[FinCore] DOMContentLoaded disparado!');
  init();
});

console.log('[FinCore] Script app.js carregado');

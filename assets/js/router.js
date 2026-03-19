import { Store } from './store.js';

const SCREEN_SELECTOR = '.screen';
const handlers = {}; // Map de handlers para cada screen

export const Router = {
  init() {
    window.addEventListener('hashchange', () => {
      const screen = window.location.hash.replace('#', '') || 'dashboard';
      this.navigate(screen, { replace: true });
    });

    document.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-screen]');
      if (!btn) return;
      const screen = btn.getAttribute('data-screen');
      if (!screen) return;
      event.preventDefault();
      this.navigate(screen);
    });

    const initial = window.location.hash.replace('#', '') || Store.getState().activeScreen;
    this.navigate(initial, { replace: true });
  },

  navigate(screen, options = {}) {
    const allScreens = document.querySelectorAll(SCREEN_SELECTOR);
    allScreens.forEach((node) => node.classList.remove('active'));

    const target = document.getElementById(`screen-${screen}`);
    if (target) {
      target.classList.add('active');
      Store.setState({ activeScreen: screen });
      if (!options.replace) {
        window.location.hash = `#${screen}`;
      }
      this.updateNav(screen);
      
      // Chama o handler de renderização se existir
      if (handlers[screen]) {
        console.log(`[Router] Ativando renderer para: ${screen}`);
        handlers[screen]();
      }
    }
  },

  registerScreenHandler(screen, handler) {
    handlers[screen] = handler;
    console.log(`[Router] Handler registrado para: ${screen}`);
  },

  updateNav(screen) {
    document.querySelectorAll('[data-screen]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-screen') === screen);
    });
  },

  getCurrentScreen() {
    return Store.getState().activeScreen;
  },

  back() {
    window.history.back();
  },

  onBeforeNavigate() {
    // Placeholder for hook
  },

  onAfterNavigate() {
    // Placeholder for hook
  }
};

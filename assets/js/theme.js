const STORAGE_KEY = 'fincore_theme';

export const Theme = {
  init() {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');

    this.setTheme(theme);
  },

  toggle() {
    const current = this.getCurrent();
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    this.persist(next);
  },

  setTheme(name) {
    const root = document.documentElement;
    root.setAttribute('data-theme', name);
  },

  getCurrent() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  },

  persist(name) {
    localStorage.setItem(STORAGE_KEY, name);
  },
};

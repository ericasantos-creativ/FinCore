export const Utils = {
  formatCurrency(value, currency = 'BRL') {
    const number = Number(value);
    if (Number.isNaN(number)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(number);
  },

  formatDate(date, format = 'dd/MM/yyyy') {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());
    return format.replace('dd', day).replace('MM', month).replace('yyyy', year);
  },

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  validatePassword(password) {
    return typeof password === 'string' && password.length >= 8;
  },

  generateId() {
    // UUID v4
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  },

  debounce(fn, delay = 250) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  },

  throttle(fn, delay = 250) {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn(...args);
      }
    };
  },

  showToast(message, type = 'success', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const text = document.createElement('div');
    text.textContent = message;
    toast.appendChild(text);

    const button = document.createElement('button');
    button.className = 'toast__close';
    button.type = 'button';
    button.setAttribute('aria-label', 'Fechar notificação');
    button.textContent = '✕';
    button.addEventListener('click', () => {
      toast.remove();
    });

    toast.appendChild(button);
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, duration);
  },

  async showConfirm(message) {
    return new Promise((resolve) => {
      const overlay = document.getElementById('confirm-dialog');
      if (!overlay) {
        resolve(false);
        return;
      }

      overlay.innerHTML = `
        <div class="confirm">
          <p class="confirm__message">${message}</p>
          <div class="confirm__actions">
            <button class="btn btn--secondary" data-action="cancel">Cancelar</button>
            <button class="btn btn--primary" data-action="confirm">Confirmar</button>
          </div>
        </div>
      `;

      overlay.hidden = false;

      const onClick = (event) => {
        const action = event.target.closest('[data-action]')?.getAttribute('data-action');
        if (!action) return;
        overlay.hidden = true;
        overlay.innerHTML = '';
        overlay.removeEventListener('click', onClick);
        resolve(action === 'confirm');
      };

      overlay.addEventListener('click', onClick);
    });
  },

  lerp(start, end, t) {
    return start + (end - start) * t;
  },

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
};

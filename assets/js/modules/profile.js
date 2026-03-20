import { Store } from '../store.js';
import { Router } from '../router.js';
import { Utils } from '../utils.js';
import { DB } from '../db.js';
import { Theme } from '../theme.js';
import { Auth } from '../auth.js';

export const Profile = {
  init() {
    Router.registerScreenHandler('profile', () => this.loadProfile());
    this.setupListeners();
    this.loadProfile();

    Store.subscribe((state) => {
      this.updateSloganBall(state.slogan);
    });
  },

  setupListeners() {
    const fileInput = document.getElementById('profile-slogan-input');
    const fileLabel = document.querySelector('.file-input-label');
    const sloganBall = document.getElementById('profile-slogan-ball');
    const form = document.getElementById('profile-settings-form');
    const passwordForm = document.getElementById('profile-password-form');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        this.handleFileSelect(e);
      });
    }

    if (fileLabel) {
      fileLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileLabel.classList.add('dragging');
      });

      fileLabel.addEventListener('dragleave', () => {
        fileLabel.classList.remove('dragging');
      });

      fileLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        fileLabel.classList.remove('dragging');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          fileInput.files = files;
          this.handleFileSelect({ target: { files } });
        }
      });
    }

    if (sloganBall) {
      sloganBall.addEventListener('click', () => {
        fileInput?.click();
      });
    }

    if (form) {
      form.addEventListener('submit', (event) => this.handleSettingsSubmit(event));
    }

    if (passwordForm) {
      passwordForm.addEventListener('submit', (event) => this.handlePasswordSubmit(event));
    }
  },

  handleFileSelect(event) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    if (!file.type.startsWith('image/')) {
      Utils.showToast('Selecione uma imagem válida', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Utils.showToast('Imagem muito grande (máximo 2MB)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      const currentUser = Store.getState().user;
      Store.setState({
        slogan: base64,
        user: currentUser ? { ...currentUser, slogan: base64 } : currentUser
      });
      this.persistSlogan(base64);
    };

    reader.onerror = () => {
      Utils.showToast('Erro ao processar a imagem', 'error');
    };

    reader.readAsDataURL(file);
  },

  async persistSlogan(base64) {
    const user = Store.getState().user;
    if (!user?.id) return;

    try {
      await DB.update('users', user.id, { slogan: base64 });
      Utils.showToast('Slogan atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('[Profile] Erro ao salvar slogan:', error);
      Utils.showToast('Erro ao salvar slogan.', 'error');
    }
  },

  loadProfile() {
    const state = Store.getState();
    const user = state.user || {};
    const slogan = state.slogan || user.slogan || '';

    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const avatarEl = document.getElementById('profile-avatar');

    const displayName = user.nome || user.name || 'Usuario';

    if (nameEl) {
      nameEl.textContent = displayName;
    }

    if (emailEl) {
      emailEl.textContent = user.email || 'email@exemplo.com';
    }

    if (avatarEl && displayName) {
      const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      avatarEl.textContent = initials;
    }

    this.populateSettingsForm(user);
    this.updateSloganBall(slogan);
  },

  populateSettingsForm(user) {
    const nameInput = document.getElementById('profile-full-name');
    const emailInput = document.getElementById('profile-email-input');
    const currencySelect = document.getElementById('profile-currency');
    const localeSelect = document.getElementById('profile-locale');
    const themeSelect = document.getElementById('profile-theme');
    const notificationsToggle = document.getElementById('profile-notifications');

    if (nameInput) nameInput.value = user?.nome || '';
    if (emailInput) emailInput.value = user?.email || '';
    if (currencySelect) currencySelect.value = user?.moeda || 'BRL';
    if (localeSelect) localeSelect.value = user?.idioma || 'pt-BR';
    if (themeSelect) themeSelect.value = user?.tema || Theme.getCurrent();
    if (notificationsToggle) notificationsToggle.checked = user?.notificacoes ?? true;
  },

  async handleSettingsSubmit(event) {
    event.preventDefault();
    const state = Store.getState();
    const user = state.user;
    if (!user?.id) {
      Utils.showToast('Usuario nao autenticado.', 'error');
      return;
    }

    const nameInput = document.getElementById('profile-full-name');
    const emailInput = document.getElementById('profile-email-input');
    const currencySelect = document.getElementById('profile-currency');
    const localeSelect = document.getElementById('profile-locale');
    const themeSelect = document.getElementById('profile-theme');
    const notificationsToggle = document.getElementById('profile-notifications');

    const nextEmail = emailInput?.value.trim() || user.email;

    const nextProfile = {
      nome: nameInput?.value.trim() || user.nome,
      email: nextEmail,
      moeda: currencySelect?.value || user.moeda,
      idioma: localeSelect?.value || user.idioma,
      tema: themeSelect?.value || user.tema,
      notificacoes: notificationsToggle?.checked ?? user.notificacoes
    };

    try {
      if (nextEmail && nextEmail !== user.email) {
        await Auth.updateEmail(nextEmail);
        Utils.showToast('Email atualizado. Confirme no inbox.', 'success');
      }
      await DB.update('users', user.id, nextProfile);
      const updatedUser = { ...user, ...nextProfile };
      Store.setState({ user: updatedUser });
      if (nextProfile.tema) {
        Theme.setTheme(nextProfile.tema);
        Theme.persist(nextProfile.tema);
      }
      Utils.showToast('Perfil atualizado com sucesso!', 'success');
      this.loadProfile();
    } catch (error) {
      console.error('[Profile] Erro ao salvar perfil:', error);
      Utils.showToast('Erro ao salvar perfil.', 'error');
    }
  },

  async handlePasswordSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const newPassword = form.querySelector('#profile-new-password')?.value || '';
    const confirmPassword = form.querySelector('#profile-confirm-password')?.value || '';

    if (!Utils.validatePassword(newPassword)) {
      Utils.showToast('A senha precisa ter ao menos 8 caracteres.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      Utils.showToast('As senhas nao conferem.', 'error');
      return;
    }

    try {
      await Auth.updatePassword(newPassword);
      Utils.showToast('Senha atualizada com sucesso!', 'success');
      form.reset();
    } catch (error) {
      console.error('[Profile] Erro ao atualizar senha:', error);
      Utils.showToast('Erro ao atualizar senha.', 'error');
    }
  },

  updateSloganBall(slogan) {
    const ball = document.getElementById('profile-slogan-ball');
    const icon = document.getElementById('profile-slogan-icon');

    if (!ball) {
      console.error('[Profile] Ball not found');
      return;
    }

    const oldImg = ball.querySelector('img');
    if (oldImg) {
      oldImg.remove();
    }

    if (slogan && slogan.startsWith('data:image')) {
      const img = document.createElement('img');
      img.src = slogan;
      img.alt = 'Slogan image';
      ball.appendChild(img);

      if (icon) {
        icon.style.display = 'none';
      }

      ball.style.backgroundColor = 'transparent';
    } else {
      if (icon) {
        icon.style.display = 'block';
        icon.textContent = '✨';
      }
      ball.style.backgroundColor = 'rgba(26, 107, 255, 0.16)';
    }
  }
};

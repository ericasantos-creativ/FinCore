import { Store } from '../store.js';
import { Router } from '../router.js';
import { Utils } from '../utils.js';

export const Profile = {
  init() {
    Router.registerScreenHandler('profile', () => this.loadProfile());
    this.setupListeners();
    this.loadProfile();
    
    // Subscribe para atualizar a bola quando slogan muda
    Store.subscribe((state) => {
      this.updateSloganBall(state.slogan);
    });
  },

  setupListeners() {
    const fileInput = document.getElementById('profile-slogan-input');
    const fileLabel = document.querySelector('.file-input-label');
    const sloganBall = document.getElementById('profile-slogan-ball');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        console.log('[Profile] Change event');
        this.handleFileSelect(e);
      });
    }

    // Drag and drop
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
        console.log('[Profile] Ball clicked');
        fileInput?.click();
      });
    }
  },

  handleFileSelect(event) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.log('[Profile] No file');
      return;
    }

    const file = files[0];
    console.log('[Profile] File selected:', file.name, file.type, file.size);

    // Validar se é uma imagem
    if (!file.type.startsWith('image/')) {
      Utils.showToast('Selecione uma imagem válida', 'error');
      return;
    }

    // Validar tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      Utils.showToast('Imagem muito grande (máximo 2MB)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      console.log('[Profile] Base64 length:', base64.length);
      Store.setState({ slogan: base64 });
      console.log('[Profile] Store updated');
      Utils.showToast('Slogan atualizado com sucesso!', 'success');
    };

    reader.onerror = () => {
      console.error('[Profile] Error reading file');
      Utils.showToast('Erro ao processar a imagem', 'error');
    };

    reader.readAsDataURL(file);
  },

  loadProfile() {
    const state = Store.getState();
    const user = state.user || {};
    const slogan = state.slogan || '';

    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const avatarEl = document.getElementById('profile-avatar');

    if (nameEl) {
      nameEl.textContent = user.name || 'Usuário';
    }

    if (emailEl) {
      emailEl.textContent = user.email || 'email@exemplo.com';
    }

    if (avatarEl && user.name) {
      const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      avatarEl.textContent = initials;
    }

    this.updateSloganBall(slogan);
  },

  updateSloganBall(slogan) {
    const ball = document.getElementById('profile-slogan-ball');
    const icon = document.getElementById('profile-slogan-icon');
    
    if (!ball) {
      console.error('[Profile] Ball not found');
      return;
    }

    console.log('[Profile] Updating ball. Has slogan?', !!slogan);

    // Remove imagem anterior se existir
    const oldImg = ball.querySelector('img');
    if (oldImg) {
      console.log('[Profile] Removing old img');
      oldImg.remove();
    }

    if (slogan && slogan.startsWith('data:image')) {
      console.log('[Profile] Creating img element');
      const img = document.createElement('img');
      img.src = slogan;
      img.alt = 'Slogan image';
      
      ball.appendChild(img);
      
      if (icon) {
        icon.style.display = 'none';
      }
      
      ball.style.backgroundColor = 'transparent';
      console.log('[Profile] Image added to ball');
    } else {
      console.log('[Profile] Showing icon');
      if (icon) {
        icon.style.display = 'block';
        icon.textContent = '✨';
      }
      ball.style.backgroundColor = 'rgba(26, 107, 255, 0.16)';
    }
  }
};

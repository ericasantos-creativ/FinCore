import { DB } from '../db.js';
import { Store } from '../store.js';
import { Router } from '../router.js';
import { Utils } from '../utils.js';

function buildRow(category) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${category.nome || '-'}</td>
    <td>${category.tipo === 'receita' ? 'Receita' : 'Despesa'}</td>
    <td>${category.icone || '-'}</td>
    <td>${category.cor || '-'}</td>
    <td>
      <button class="btn btn--ghost" data-action="edit" data-id="${category.id}">Editar</button>
      <button class="btn btn--ghost" data-action="delete" data-id="${category.id}">Excluir</button>
    </td>
  `;
  return tr;
}

function createCategoriesTable(categories) {
  const wrapper = document.createElement('div');
  wrapper.className = 'data-table';
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>Tipo</th>
      <th>Icone</th>
      <th>Cor</th>
      <th></th>
    </tr>
  `;
  const tbody = document.createElement('tbody');
  categories.forEach((category) => tbody.appendChild(buildRow(category)));
  table.appendChild(thead);
  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}

function openModal(category = null) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const isEdit = Boolean(category);
  const title = isEdit ? 'Editar Categoria' : 'Nova Categoria';

  container.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal__content">
        <header class="modal__header">
          <h2 class="modal__title">${title}</h2>
          <button class="btn btn--icon btn--ghost" data-action="close" aria-label="Fechar">✕</button>
        </header>
        <form id="category-form" class="modal__body">
          <div class="form-group">
            <label for="category-name">Nome</label>
            <input id="category-name" name="name" type="text" required value="${category?.nome ?? ''}" />
          </div>
          <div class="form-group">
            <label for="category-type">Tipo</label>
            <select id="category-type" name="type" required>
              <option value="receita" ${category?.tipo === 'receita' ? 'selected' : ''}>Receita</option>
              <option value="despesa" ${category?.tipo === 'despesa' ? 'selected' : ''}>Despesa</option>
            </select>
          </div>
          <div class="form-group">
            <label for="category-icon">Icone</label>
            <input id="category-icon" name="icon" type="text" placeholder="Ex: 🧾" value="${category?.icone ?? ''}" />
          </div>
          <div class="form-group">
            <label for="category-color">Cor</label>
            <input id="category-color" name="color" type="color" value="${category?.cor ?? '#1A6BFF'}" />
          </div>
          <div class="modal__footer">
            <button type="button" class="btn btn--secondary" data-action="close">Cancelar</button>
            <button type="submit" class="btn btn--primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `;

  container.hidden = false;

  const form = document.getElementById('category-form');
  const closeButtons = container.querySelectorAll('[data-action="close"]');

  function close() {
    container.hidden = true;
    container.innerHTML = '';
  }

  closeButtons.forEach((btn) => btn.addEventListener('click', close));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);

    const record = {
      id: category?.id ?? Utils.generateId(),
      nome: data.get('name'),
      tipo: data.get('type'),
      icone: data.get('icon'),
      cor: data.get('color'),
      sistema: false,
      pai_id: null,
      criado_em: category?.criado_em ?? new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };

    try {
      if (isEdit) {
        await DB.update('categories', record.id, record);
      } else {
        await DB.add('categories', record);
      }
      Utils.showToast('Categoria salva com sucesso!', 'success');
      close();
      await Categories.loadList();
    } catch (error) {
      console.error(error);
      Utils.showToast('Erro ao salvar categoria.', 'error');
    }
  });
}

export const Categories = {
  async init() {
    const btn = document.getElementById('btn-new-category');
    btn?.addEventListener('click', () => openModal());
    Router.registerScreenHandler('categories', () => this.loadList());
    await this.loadList();
  },

  async loadList() {
    const container = document.getElementById('categories-list');
    if (!container) return;

    const categories = await DB.getAll('categories');
    Store.setState({ categories });

    if (!categories || categories.length === 0) {
      container.innerHTML = `<div class="placeholder">Nenhuma categoria cadastrada ainda.</div>`;
      return;
    }

    const sorted = categories.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
    const table = createCategoriesTable(sorted);
    container.innerHTML = '';
    container.appendChild(table);

    container.querySelectorAll('button[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const category = categories.find((item) => item.id === id);
        if (category) openModal(category);
      });
    });

    container.querySelectorAll('button[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const confirmed = await Utils.showConfirm('Tem certeza que deseja excluir esta categoria?');
        if (!confirmed) return;
        await DB.delete('categories', id);
        Utils.showToast('Categoria excluida.', 'success');
        await Categories.loadList();
      });
    });
  }
};

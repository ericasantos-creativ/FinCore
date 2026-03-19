import { DB } from '../db.js';
import { Store } from '../store.js';
import { Router } from '../router.js';
import { Utils } from '../utils.js';

function buildRow(supplier) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${supplier.nome || '-'}</td>
    <td>${supplier.cnpj_cpf || '-'}</td>
    <td>${supplier.categoria || '-'}</td>
    <td>${supplier.email || '-'}</td>
    <td>${supplier.telefone || '-'}</td>
    <td>${supplier.ativo ? 'Ativo' : 'Inativo'}</td>
    <td>
      <button class="btn btn--ghost" data-action="edit" data-id="${supplier.id}">Editar</button>
      <button class="btn btn--ghost" data-action="delete" data-id="${supplier.id}">Excluir</button>
    </td>
  `;
  return tr;
}

function createSuppliersTable(suppliers) {
  const wrapper = document.createElement('div');
  wrapper.className = 'data-table';
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>Documento</th>
      <th>Categoria</th>
      <th>E-mail</th>
      <th>Telefone</th>
      <th>Status</th>
      <th></th>
    </tr>
  `;
  const tbody = document.createElement('tbody');
  suppliers.forEach((supplier) => tbody.appendChild(buildRow(supplier)));
  table.appendChild(thead);
  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}

function openModal(supplier = null) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const isEdit = Boolean(supplier);
  const title = isEdit ? 'Editar Fornecedor' : 'Novo Fornecedor';

  container.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal__content">
        <header class="modal__header">
          <h2 class="modal__title">${title}</h2>
          <button class="btn btn--icon btn--ghost" data-action="close" aria-label="Fechar">✕</button>
        </header>
        <form id="supplier-form" class="modal__body">
          <div class="form-group">
            <label for="supplier-name">Nome</label>
            <input id="supplier-name" name="name" type="text" required value="${supplier?.nome ?? ''}" />
          </div>
          <div class="form-group">
            <label for="supplier-doc">Documento (CPF/CNPJ)</label>
            <input id="supplier-doc" name="document" type="text" value="${supplier?.cnpj_cpf ?? ''}" />
          </div>
          <div class="form-group">
            <label for="supplier-category">Categoria</label>
            <input id="supplier-category" name="category" type="text" value="${supplier?.categoria ?? ''}" />
          </div>
          <div class="form-group">
            <label for="supplier-email">E-mail</label>
            <input id="supplier-email" name="email" type="email" value="${supplier?.email ?? ''}" />
          </div>
          <div class="form-group">
            <label for="supplier-phone">Telefone</label>
            <input id="supplier-phone" name="phone" type="text" value="${supplier?.telefone ?? ''}" />
          </div>
          <div class="form-group">
            <label class="checkbox">
              <input type="checkbox" id="supplier-active" name="active" ${supplier?.ativo !== false ? 'checked' : ''} />
              <span>Fornecedor ativo</span>
            </label>
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

  const form = document.getElementById('supplier-form');
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
      id: supplier?.id ?? Utils.generateId(),
      nome: data.get('name'),
      cnpj_cpf: data.get('document'),
      categoria: data.get('category'),
      email: data.get('email'),
      telefone: data.get('phone'),
      ativo: data.get('active') === 'on',
      criado_em: supplier?.criado_em ?? new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };

    try {
      if (isEdit) {
        await DB.update('suppliers', record.id, record);
      } else {
        await DB.add('suppliers', record);
      }
      Utils.showToast('Fornecedor salvo com sucesso!', 'success');
      close();
      await Suppliers.loadList();
    } catch (error) {
      console.error(error);
      Utils.showToast('Erro ao salvar fornecedor.', 'error');
    }
  });
}

export const Suppliers = {
  async init() {
    const btn = document.getElementById('btn-new-supplier');
    btn?.addEventListener('click', () => openModal());
    Router.registerScreenHandler('suppliers', () => this.loadList());
    await this.loadList();
  },

  async loadList() {
    const container = document.getElementById('suppliers-list');
    if (!container) return;

    const suppliers = await DB.getAll('suppliers');
    const activeCompany = Store.getState().activeCompany;
    const filtered = activeCompany
      ? suppliers.filter((sup) => sup.empresa_id === activeCompany)
      : suppliers;
    Store.setState({ suppliers: filtered });

    if (!filtered || filtered.length === 0) {
      container.innerHTML = `<div class="placeholder">Nenhum fornecedor cadastrado ainda.</div>`;
      return;
    }

    const sorted = filtered.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
    const table = createSuppliersTable(sorted);
    container.innerHTML = '';
    container.appendChild(table);

    container.querySelectorAll('button[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const supplier = filtered.find((item) => item.id === id);
        if (supplier) openModal(supplier);
      });
    });

    container.querySelectorAll('button[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const confirmed = await Utils.showConfirm('Tem certeza que deseja excluir este fornecedor?');
        if (!confirmed) return;
        await DB.delete('suppliers', id);
        Utils.showToast('Fornecedor excluido.', 'success');
        await Suppliers.loadList();
      });
    });
  }
};

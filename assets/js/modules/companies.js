import { DB } from '../db.js';
import { Store } from '../store.js';
import { Router } from '../router.js';
import { Utils } from '../utils.js';

function buildRow(company) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${company.nome || '-'}</td>
    <td>${company.cnpj || '-'}</td>
    <td>${company.segmento || '-'}</td>
    <td>${company.ativa ? 'Ativa' : 'Inativa'}</td>
    <td>
      <button class="btn btn--ghost" data-action="edit" data-id="${company.id}">Editar</button>
      <button class="btn btn--ghost" data-action="delete" data-id="${company.id}">Excluir</button>
    </td>
  `;
  return tr;
}

function createCompaniesTable(companies) {
  const wrapper = document.createElement('div');
  wrapper.className = 'data-table';
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>CNPJ</th>
      <th>Segmento</th>
      <th>Status</th>
      <th></th>
    </tr>
  `;
  const tbody = document.createElement('tbody');
  companies.forEach((company) => tbody.appendChild(buildRow(company)));
  table.appendChild(thead);
  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}

function renderCompanySummary(companies) {
  const container = document.getElementById('companies-summary');
  if (!container) return;

  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  if (!companies || companies.length <= 1) {
    container.innerHTML = '';
    return;
  }

  const state = Store.getState();
  const activeCompany = state.activeCompany;
  const query = container.querySelector('input[data-role="company-search"]')?.value || '';
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCompanies = normalizedQuery
    ? companies.filter((company) => {
        const name = (company.nome || '').toLowerCase();
        const cnpj = (company.cnpj || '').toLowerCase();
        const segment = (company.segmento || '').toLowerCase();
        return name.includes(normalizedQuery) || cnpj.includes(normalizedQuery) || segment.includes(normalizedQuery);
      })
    : companies;

  container.innerHTML = `
    <div class="companies-summary__header">
      <h3 class="companies-summary__title">Empresas logadas</h3>
      <span class="companies-summary__count">${companies.length}</span>
    </div>
    <div class="companies-summary__search">
      <input type="search" placeholder="Buscar empresa..." value="${escapeHtml(query)}" data-role="company-search" />
    </div>
    <div class="companies-summary__list">
      ${filteredCompanies.length
        ? filteredCompanies
        .map((company) => {
          const isActive = company.id === activeCompany;
          const color = company.cor || '#2e7bff';
          const safeName = escapeHtml(company.nome || 'Sem nome');
          const safeSegment = escapeHtml(company.segmento || 'Sem segmento');
          const safeCnpj = escapeHtml(company.cnpj || 'CNPJ nao informado');
          return `
            <div class="companies-summary__item ${isActive ? 'is-active' : ''}" data-id="${company.id}">
              <div class="companies-summary__info">
                <span class="companies-summary__dot" style="background:${color}"></span>
                <div>
                  <div class="companies-summary__name">${safeName}</div>
                  <div class="companies-summary__meta">${safeSegment}</div>
                  <div class="companies-summary__meta">${safeCnpj}</div>
                </div>
              </div>
              <button class="btn btn--ghost" type="button" data-action="activate" data-id="${company.id}">
                ${isActive ? 'Ativa' : 'Ativar'}
              </button>
            </div>
          `;
        })
        .join('')
        : '<div class="placeholder">Nenhuma empresa encontrada.</div>'}
    </div>
  `;

  const searchInput = container.querySelector('input[data-role="company-search"]');
  searchInput?.addEventListener('input', () => {
    renderCompanySummary(companies);
  });

  container.querySelectorAll('[data-action="activate"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
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

      renderCompanySummary(companies);
      Utils.showToast('Empresa ativa atualizada.', 'success');
    });
  });
}

function openModal(company = null) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const isEdit = Boolean(company);
  const title = isEdit ? 'Editar Empresa' : 'Nova Empresa';

  container.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal__content">
        <header class="modal__header">
          <h2 class="modal__title">${title}</h2>
          <button class="btn btn--icon btn--ghost" data-action="close" aria-label="Fechar">✕</button>
        </header>
        <form id="company-form" class="modal__body">
          <div class="form-group">
            <label for="company-name">Nome</label>
            <input id="company-name" name="name" type="text" required value="${company?.nome ?? ''}" />
          </div>
          <div class="form-group">
            <label for="company-cnpj">CNPJ</label>
            <input id="company-cnpj" name="cnpj" type="text" value="${company?.cnpj ?? ''}" />
          </div>
          <div class="form-group">
            <label for="company-segment">Segmento</label>
            <input id="company-segment" name="segment" type="text" value="${company?.segmento ?? ''}" />
          </div>
          <div class="form-group">
            <label for="company-color">Cor</label>
            <input id="company-color" name="color" type="color" value="${company?.cor ?? '#1A6BFF'}" />
          </div>
          <div class="form-group">
            <label class="checkbox">
              <input type="checkbox" id="company-active" name="active" ${company?.ativa !== false ? 'checked' : ''} />
              <span>Empresa ativa</span>
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

  const form = document.getElementById('company-form');
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
      id: company?.id ?? Utils.generateId(),
      nome: data.get('name'),
      cnpj: data.get('cnpj'),
      segmento: data.get('segment'),
      cor: data.get('color'),
      ativa: data.get('active') === 'on',
      criado_em: company?.criado_em ?? new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };

    try {
      if (isEdit) {
        await DB.update('companies', record.id, record);
      } else {
        await DB.add('companies', record);
      }
      Utils.showToast('Empresa salva com sucesso!', 'success');
      close();
      await Companies.loadList();
    } catch (error) {
      console.error(error);
      Utils.showToast('Erro ao salvar empresa.', 'error');
    }
  });
}

export const Companies = {
  async init() {
    const btn = document.getElementById('btn-new-company');
    btn?.addEventListener('click', () => openModal());
    Router.registerScreenHandler('companies', () => this.loadList());
    await this.loadList();
  },

  async loadList() {
    const container = document.getElementById('companies-list');
    if (!container) return;

    const companies = await DB.getAll('companies');
    Store.setState({ companies });

    renderCompanySummary(companies);

    if (!companies || companies.length === 0) {
      container.innerHTML = `<div class="placeholder">Nenhuma empresa cadastrada ainda.</div>`;
      return;
    }

    const sorted = companies.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
    const table = createCompaniesTable(sorted);
    container.innerHTML = '';
    container.appendChild(table);

    container.querySelectorAll('button[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const company = companies.find((item) => item.id === id);
        if (company) openModal(company);
      });
    });

    container.querySelectorAll('button[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const confirmed = await Utils.showConfirm('Tem certeza que deseja excluir esta empresa?');
        if (!confirmed) return;
        await DB.delete('companies', id);
        Utils.showToast('Empresa excluida.', 'success');
        await Companies.loadList();
      });
    });
  }
};

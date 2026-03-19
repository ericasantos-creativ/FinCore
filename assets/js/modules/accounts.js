import { DB } from '../db.js';
import { Store } from '../store.js';
import { Router } from '../router.js';
import { Utils } from '../utils.js';

function buildRow(account) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${account.nome || '-'}</td>
    <td>${account.tipo || '-'}</td>
    <td>${account.banco || '-'}</td>
    <td>${account.numero || '-'}</td>
    <td>${Utils.formatCurrency(account.saldo_atual ?? account.saldo_inicial)}</td>
    <td>${account.ativa ? 'Ativa' : 'Inativa'}</td>
    <td>
      <button class="btn btn--ghost" data-action="edit" data-id="${account.id}">Editar</button>
      <button class="btn btn--ghost" data-action="delete" data-id="${account.id}">Excluir</button>
    </td>
  `;
  return tr;
}

function createAccountsTable(accounts) {
  const wrapper = document.createElement('div');
  wrapper.className = 'data-table';
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>Tipo</th>
      <th>Banco</th>
      <th>Conta</th>
      <th>Saldo</th>
      <th>Status</th>
      <th></th>
    </tr>
  `;
  const tbody = document.createElement('tbody');
  accounts.forEach((acc) => tbody.appendChild(buildRow(acc)));
  table.appendChild(thead);
  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}

function openModal(account = null) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const isEdit = Boolean(account);
  const title = isEdit ? 'Editar Conta' : 'Nova Conta';

  container.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal__content">
        <header class="modal__header">
          <h2 class="modal__title">${title}</h2>
          <button class="btn btn--icon btn--ghost" data-action="close" aria-label="Fechar">✕</button>
        </header>
        <form id="account-form" class="modal__body">
          <div class="form-group">
            <label for="acc-name">Nome</label>
            <input id="acc-name" name="name" type="text" required value="${account?.nome ?? ''}" />
          </div>
          <div class="form-group">
            <label for="acc-type">Tipo</label>
            <select id="acc-type" name="type" required>
              <option value="corrente" ${account?.tipo === 'corrente' ? 'selected' : ''}>Conta Corrente</option>
              <option value="poupanca" ${account?.tipo === 'poupanca' ? 'selected' : ''}>Conta Poupança</option>
              <option value="cartao" ${account?.tipo === 'cartao' ? 'selected' : ''}>Cartão de Crédito</option>
              <option value="carteira" ${account?.tipo === 'carteira' ? 'selected' : ''}>Carteira</option>
              <option value="caixa" ${account?.tipo === 'caixa' ? 'selected' : ''}>Caixa</option>
              <option value="investimento" ${account?.tipo === 'investimento' ? 'selected' : ''}>Investimento</option>
            </select>
          </div>
          <div class="form-group">
            <label for="acc-bank">Banco</label>
            <input id="acc-bank" name="bank" type="text" value="${account?.banco ?? ''}" />
          </div>
          <div class="form-group">
            <label for="acc-agency">Agência</label>
            <input id="acc-agency" name="agency" type="text" value="${account?.agencia ?? ''}" />
          </div>
          <div class="form-group">
            <label for="acc-number">Número</label>
            <input id="acc-number" name="number" type="text" value="${account?.numero ?? ''}" />
          </div>
          <div class="form-group">
            <label for="acc-initial">Saldo Inicial</label>
            <input id="acc-initial" name="initial" type="number" step="0.01" required value="${account?.saldo_inicial ?? 0}" />
          </div>
          <div class="form-group">
            <label class="checkbox">
              <input type="checkbox" id="acc-active" name="active" ${account?.ativa !== false ? 'checked' : ''} />
              <span>Conta ativa</span>
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

  const form = document.getElementById('account-form');
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
      id: account?.id ?? Utils.generateId(),
      user_id: Store.getState().user?.id ?? null,
      empresa_id: Store.getState().activeCompany ?? null,
      nome: data.get('name'),
      tipo: data.get('type'),
      banco: data.get('bank'),
      agencia: data.get('agency'),
      numero: data.get('number'),
      saldo_inicial: Number(data.get('initial')) || 0,
      saldo_atual: Number(data.get('initial')) || 0,
      limite_credito: 0,
      cor: '#1A6BFF',
      icone: 'bank',
      ativa: data.get('active') === 'on',
      criado_em: account?.criado_em ?? new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };

    try {
      if (isEdit) {
        await DB.update('accounts', record.id, record);
      } else {
        await DB.add('accounts', record);
      }
      Utils.showToast('Conta salva com sucesso!', 'success');
      close();
      await Accounts.loadList();
    } catch (error) {
      console.error(error);
      Utils.showToast('Erro ao salvar conta.', 'error');
    }
  });
}

export const Accounts = {
  async init() {
    const btn = document.getElementById('btn-new-account');
    btn?.addEventListener('click', () => openModal());
    Router.registerScreenHandler('accounts', () => this.loadList());
    await this.loadList();
  },

  async loadList() {
    const container = document.getElementById('accounts-list');
    if (!container) return;

    const accounts = await DB.getAll('accounts');
    const activeCompany = Store.getState().activeCompany;
    const filtered = activeCompany
      ? accounts.filter((acc) => acc.empresa_id === activeCompany)
      : accounts;
    Store.setState({ accounts: filtered });

    if (!filtered || filtered.length === 0) {
      container.innerHTML = `<div class="placeholder">Nenhuma conta cadastrada ainda.</div>`;
      return;
    }

    const sorted = filtered.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
    const table = createAccountsTable(sorted);
    container.innerHTML = '';
    container.appendChild(table);

    container.querySelectorAll('button[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const acc = filtered.find((a) => a.id === id);
        if (acc) openModal(acc);
      });
    });

    container.querySelectorAll('button[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const confirmed = await Utils.showConfirm('Tem certeza que deseja excluir esta conta?');
        if (!confirmed) return;
        await DB.delete('accounts', id);
        Utils.showToast('Conta excluída.', 'success');
        await Accounts.loadList();
      });
    });
  }
};

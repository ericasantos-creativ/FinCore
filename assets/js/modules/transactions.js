import { Store } from '../store.js';
import { Router } from '../router.js';
import { Utils } from '../utils.js';
import { LocalData } from '../local-data.js';

function formatDate(date) {
  return Utils.formatDate(date);
}

function buildRow(tx, accountMap) {
  const accountName = accountMap.get(tx.conta_id) || '-';
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${formatDate(tx.data)}</td>
    <td>${tx.descricao || '-'}</td>
    <td>${tx.categoria || '-'}</td>
    <td>${accountName}</td>
    <td>${tx.tipo === 'receita' ? 'Receita' : tx.tipo === 'despesa' ? 'Despesa' : 'Transferência'}</td>
    <td>${Utils.formatCurrency(tx.valor)}</td>
    <td>${tx.status || 'pendente'}</td>
  `;
  return tr;
}

function createTransactionTable(transactions, accounts) {
  const wrapper = document.createElement('div');
  wrapper.className = 'data-table';
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Data</th>
      <th>Descrição</th>
      <th>Categoria</th>
      <th>Conta</th>
      <th>Tipo</th>
      <th>Valor</th>
      <th>Status</th>
    </tr>
  `;
  const tbody = document.createElement('tbody');
  const accountMap = new Map((accounts || []).map((acc) => [acc.id, acc.nome]));
  transactions.forEach((tx) => tbody.appendChild(buildRow(tx, accountMap)));
  table.appendChild(thead);
  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}

function openModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const accounts = Store.getState().accounts || [];
  const options = accounts
    .map((acc) => `<option value="${acc.id}">${acc.nome}</option>`)
    .join('');

  container.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Nova transação">
      <div class="modal__content">
        <header class="modal__header">
          <h2 class="modal__title">Nova Transação</h2>
          <button class="btn btn--icon btn--ghost" data-action="close" aria-label="Fechar">✕</button>
        </header>
        <form id="transaction-form" class="modal__body">
          <div class="form-group">
            <label for="tx-account">Conta</label>
            <select id="tx-account" name="account" required>
              <option value="">Selecione</option>
              ${options}
            </select>
          </div>
          <div class="form-group">
            <label for="tx-date">Data</label>
            <input id="tx-date" name="date" type="date" required value="${new Date().toISOString().slice(0, 10)}" />
          </div>
          <div class="form-group">
            <label for="tx-description">Descrição</label>
            <input id="tx-description" name="description" type="text" required maxlength="120" />
          </div>
          <div class="form-group">
            <label for="tx-value">Valor</label>
            <input id="tx-value" name="value" type="number" step="0.01" required placeholder="0,00" />
          </div>
          <div class="form-group">
            <label for="tx-type">Tipo</label>
            <select id="tx-type" name="type" required>
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>
          <div class="form-group">
            <label for="tx-status">Status</label>
            <select id="tx-status" name="status" required>
              <option value="efetivada">Efetivada</option>
              <option value="pendente">Pendente</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div class="form-group">
            <label for="tx-category">Categoria</label>
            <input id="tx-category" name="category" type="text" placeholder="Ex: Alimentação" />
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

  const form = document.getElementById('transaction-form');
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
      id: Utils.generateId(),
      empresa_id: Store.getState().activeCompany || null,
      conta_id: data.get('account'),
      contaId: data.get('account'),
      tipo: data.get('type'),
      descricao: data.get('description'),
      valor: Number(data.get('value')) || 0,
      data: data.get('date'),
      status: data.get('status'),
      categoria: data.get('category')
    };

    if (!record.conta_id) {
      Utils.showToast('Selecione uma conta.', 'error');
      return;
    }

    try {
      LocalData.addTransacao(record);
      await Transactions.loadList();
      Utils.showToast('Transação salva!', 'success');
      close();
    } catch (error) {
      Utils.showToast('Erro ao salvar transação.', 'error');
      console.error(error);
    }
  });
}

export const Transactions = {
  async init() {
    console.log('[Transactions] Inicializando módulo de transações...');
    const btn = document.getElementById('btn-new-transaction');
    console.log('[Transactions] Botão "Nova Transação":', btn);
    btn?.addEventListener('click', () => this.openModal());
    Router.registerScreenHandler('transactions', () => this.loadList());
    await this.loadList();
    console.log('[Transactions] Módulo inicializado');
  },

  async loadList() {
    console.log('[Transactions] loadList() chamado');
    const transactions = Store.getState().transactions || [];
    const accounts = Store.getState().accounts || [];
    console.log('[Transactions] Total de transações:', transactions ? transactions.length : 0);
    Store.setState({ transactions });

    const container = document.getElementById('transactions-list') || document.getElementById('recent-transactions');
    console.log('[Transactions] Container encontrado:', !!container);
    if (!container) {
      return;
    }

    if (!transactions || transactions.length === 0) {
      console.log('[Transactions] Exibindo placeholder (nenhuma transação)');
      container.innerHTML = `<div class="placeholder">Nenhuma transação registrada ainda.</div>`;
      return;
    }

    console.log('[Transactions] Renderizando tabela com', transactions.length, 'transações');
    const sorted = transactions.sort((a, b) => new Date(b.data) - new Date(a.data));
    const table = createTransactionTable(sorted, accounts);
    container.innerHTML = '';
    container.appendChild(table);
    console.log('[Transactions] Tabela renderizada com sucesso');
  },

  openModal,
  async save(data) {
    // placeholder for future
  }
};

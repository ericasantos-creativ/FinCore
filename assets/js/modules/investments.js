import { DB } from '../db.js';
import { Store } from '../store.js';
import { Router } from '../router.js';
import { Utils } from '../utils.js';

function buildRow(investment) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${investment.nome || '-'}</td>
    <td>${investment.tipo || '-'}</td>
    <td>${investment.ticker || '-'}</td>
    <td>${Utils.formatCurrency(investment.valor_aportado || 0)}</td>
    <td>${investment.quantidade ?? '-'}</td>
    <td>
      <button class="btn btn--ghost" data-action="edit" data-id="${investment.id}">Editar</button>
      <button class="btn btn--ghost" data-action="delete" data-id="${investment.id}">Excluir</button>
    </td>
  `;
  return tr;
}

function createInvestmentsTable(investments) {
  const wrapper = document.createElement('div');
  wrapper.className = 'data-table';
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>Tipo</th>
      <th>Ticker</th>
      <th>Aportado</th>
      <th>Quantidade</th>
      <th></th>
    </tr>
  `;
  const tbody = document.createElement('tbody');
  investments.forEach((investment) => tbody.appendChild(buildRow(investment)));
  table.appendChild(thead);
  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}

async function openModal(investment = null) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const accounts = Store.getState().accounts?.length
    ? Store.getState().accounts
    : await DB.getAll('accounts');

  const isEdit = Boolean(investment);
  const title = isEdit ? 'Editar Investimento' : 'Novo Investimento';

  const accountOptions = accounts
    .map((acc) => `<option value="${acc.id}" ${investment?.conta_id === acc.id ? 'selected' : ''}>${acc.nome}</option>`)
    .join('');

  container.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal__content">
        <header class="modal__header">
          <h2 class="modal__title">${title}</h2>
          <button class="btn btn--icon btn--ghost" data-action="close" aria-label="Fechar">✕</button>
        </header>
        <form id="investment-form" class="modal__body">
          <div class="form-group">
            <label for="investment-name">Nome</label>
            <input id="investment-name" name="name" type="text" required value="${investment?.nome ?? ''}" />
          </div>
          <div class="form-group">
            <label for="investment-type">Tipo</label>
            <select id="investment-type" name="type" required>
              <option value="renda_fixa" ${investment?.tipo === 'renda_fixa' ? 'selected' : ''}>Renda Fixa</option>
              <option value="acoes" ${investment?.tipo === 'acoes' ? 'selected' : ''}>Acoes</option>
              <option value="fii" ${investment?.tipo === 'fii' ? 'selected' : ''}>FII</option>
              <option value="cripto" ${investment?.tipo === 'cripto' ? 'selected' : ''}>Cripto</option>
              <option value="fundo" ${investment?.tipo === 'fundo' ? 'selected' : ''}>Fundo</option>
              <option value="previdencia" ${investment?.tipo === 'previdencia' ? 'selected' : ''}>Previdencia</option>
            </select>
          </div>
          <div class="form-group">
            <label for="investment-ticker">Ticker</label>
            <input id="investment-ticker" name="ticker" type="text" value="${investment?.ticker ?? ''}" />
          </div>
          <div class="form-group">
            <label for="investment-value">Valor aportado</label>
            <input id="investment-value" name="value" type="number" step="0.01" value="${investment?.valor_aportado ?? 0}" />
          </div>
          <div class="form-group">
            <label for="investment-qty">Quantidade</label>
            <input id="investment-qty" name="qty" type="number" step="0.0001" value="${investment?.quantidade ?? 0}" />
          </div>
          <div class="form-group">
            <label for="investment-avg">Preco medio</label>
            <input id="investment-avg" name="avg" type="number" step="0.0001" value="${investment?.preco_medio ?? 0}" />
          </div>
          <div class="form-group">
            <label for="investment-current">Preco atual</label>
            <input id="investment-current" name="current" type="number" step="0.0001" value="${investment?.preco_atual ?? 0}" />
          </div>
          <div class="form-group">
            <label for="investment-broker">Corretora</label>
            <input id="investment-broker" name="broker" type="text" value="${investment?.corretora ?? ''}" />
          </div>
          <div class="form-group">
            <label for="investment-account">Conta</label>
            <select id="investment-account" name="account">
              <option value="">Selecionar conta</option>
              ${accountOptions}
            </select>
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

  const form = document.getElementById('investment-form');
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
      id: investment?.id ?? Utils.generateId(),
      nome: data.get('name'),
      tipo: data.get('type'),
      ticker: data.get('ticker'),
      valor_aportado: Number(data.get('value')) || 0,
      quantidade: Number(data.get('qty')) || 0,
      preco_medio: Number(data.get('avg')) || 0,
      preco_atual: Number(data.get('current')) || 0,
      corretora: data.get('broker'),
      conta_id: data.get('account') || null,
      criado_em: investment?.criado_em ?? new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };

    try {
      if (isEdit) {
        await DB.update('investments', record.id, record);
      } else {
        await DB.add('investments', record);
      }
      Utils.showToast('Investimento salvo com sucesso!', 'success');
      close();
      await Investments.loadList();
    } catch (error) {
      console.error(error);
      Utils.showToast('Erro ao salvar investimento.', 'error');
    }
  });
}

export const Investments = {
  async init() {
    const btn = document.getElementById('btn-new-investment');
    btn?.addEventListener('click', () => openModal());
    Router.registerScreenHandler('investments', () => this.loadList());
    await this.loadList();
  },

  async loadList() {
    const container = document.getElementById('investments-list');
    if (!container) return;

    const investments = await DB.getAll('investments');
    const activeCompany = Store.getState().activeCompany;
    const accounts = Store.getState().accounts || [];
    const filtered = activeCompany
      ? investments.filter((inv) => {
          if (!inv.conta_id) return true;
          const acc = accounts.find((item) => item.id === inv.conta_id);
          return acc?.empresa_id === activeCompany;
        })
      : investments;
    Store.setState({ investments: filtered });

    if (!filtered || filtered.length === 0) {
      container.innerHTML = `<div class="placeholder">Nenhum investimento cadastrado ainda.</div>`;
      return;
    }

    const sorted = filtered.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
    const table = createInvestmentsTable(sorted);
    container.innerHTML = '';
    container.appendChild(table);

    container.querySelectorAll('button[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const investment = filtered.find((item) => item.id === id);
        if (investment) openModal(investment);
      });
    });

    container.querySelectorAll('button[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const confirmed = await Utils.showConfirm('Tem certeza que deseja excluir este investimento?');
        if (!confirmed) return;
        await DB.delete('investments', id);
        Utils.showToast('Investimento excluido.', 'success');
        await Investments.loadList();
      });
    });
  }
};

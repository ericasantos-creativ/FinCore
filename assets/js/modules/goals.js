import { DB } from '../db.js';
import { Store } from '../store.js';
import { Router } from '../router.js';
import { Utils } from '../utils.js';

function buildRow(goal) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${goal.nome || '-'}</td>
    <td>${Utils.formatCurrency(goal.valor_atual || 0)}</td>
    <td>${Utils.formatCurrency(goal.valor_alvo || 0)}</td>
    <td>${goal.data_prazo ? Utils.formatDate(goal.data_prazo) : '-'}</td>
    <td>${goal.concluida ? 'Concluida' : 'Em andamento'}</td>
    <td>
      <button class="btn btn--ghost" data-action="edit" data-id="${goal.id}">Editar</button>
      <button class="btn btn--ghost" data-action="delete" data-id="${goal.id}">Excluir</button>
    </td>
  `;
  return tr;
}

function createGoalsTable(goals) {
  const wrapper = document.createElement('div');
  wrapper.className = 'data-table';
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>Atual</th>
      <th>Alvo</th>
      <th>Prazo</th>
      <th>Status</th>
      <th></th>
    </tr>
  `;
  const tbody = document.createElement('tbody');
  goals.forEach((goal) => tbody.appendChild(buildRow(goal)));
  table.appendChild(thead);
  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}

async function openModal(goal = null) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const accounts = Store.getState().accounts?.length
    ? Store.getState().accounts
    : await DB.getAll('accounts');

  const isEdit = Boolean(goal);
  const title = isEdit ? 'Editar Meta' : 'Nova Meta';

  const accountOptions = accounts
    .map((acc) => `<option value="${acc.id}" ${goal?.conta_vinculada === acc.id ? 'selected' : ''}>${acc.nome}</option>`)
    .join('');

  container.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal__content">
        <header class="modal__header">
          <h2 class="modal__title">${title}</h2>
          <button class="btn btn--icon btn--ghost" data-action="close" aria-label="Fechar">✕</button>
        </header>
        <form id="goal-form" class="modal__body">
          <div class="form-group">
            <label for="goal-name">Nome</label>
            <input id="goal-name" name="name" type="text" required value="${goal?.nome ?? ''}" />
          </div>
          <div class="form-group">
            <label for="goal-category">Categoria</label>
            <input id="goal-category" name="category" type="text" value="${goal?.categoria ?? ''}" placeholder="Ex: Viagem" />
          </div>
          <div class="form-group">
            <label for="goal-target">Valor alvo</label>
            <input id="goal-target" name="target" type="number" step="0.01" required value="${goal?.valor_alvo ?? 0}" />
          </div>
          <div class="form-group">
            <label for="goal-current">Valor atual</label>
            <input id="goal-current" name="current" type="number" step="0.01" value="${goal?.valor_atual ?? 0}" />
          </div>
          <div class="form-group">
            <label for="goal-start">Data inicio</label>
            <input id="goal-start" name="start" type="date" value="${goal?.data_inicio ?? ''}" />
          </div>
          <div class="form-group">
            <label for="goal-due">Data prazo</label>
            <input id="goal-due" name="due" type="date" value="${goal?.data_prazo ?? ''}" />
          </div>
          <div class="form-group">
            <label for="goal-account">Conta vinculada</label>
            <select id="goal-account" name="account">
              <option value="">Selecionar conta</option>
              ${accountOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="checkbox">
              <input type="checkbox" id="goal-completed" name="completed" ${goal?.concluida ? 'checked' : ''} />
              <span>Meta concluida</span>
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

  const form = document.getElementById('goal-form');
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
      id: goal?.id ?? Utils.generateId(),
      nome: data.get('name'),
      categoria: data.get('category'),
      valor_alvo: Number(data.get('target')) || 0,
      valor_atual: Number(data.get('current')) || 0,
      data_inicio: data.get('start') || null,
      data_prazo: data.get('due') || null,
      conta_vinculada: data.get('account') || null,
      concluida: data.get('completed') === 'on',
      criado_em: goal?.criado_em ?? new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };

    try {
      if (isEdit) {
        await DB.update('goals', record.id, record);
      } else {
        await DB.add('goals', record);
      }
      Utils.showToast('Meta salva com sucesso!', 'success');
      close();
      await Goals.loadList();
    } catch (error) {
      console.error(error);
      Utils.showToast('Erro ao salvar meta.', 'error');
    }
  });
}

export const Goals = {
  async init() {
    const btn = document.getElementById('btn-new-goal');
    btn?.addEventListener('click', () => openModal());
    Router.registerScreenHandler('goals', () => this.loadList());
    await this.loadList();
  },

  async loadList() {
    const container = document.getElementById('goals-list');
    if (!container) return;

    const goals = await DB.getAll('goals');
    const activeCompany = Store.getState().activeCompany;
    const accounts = Store.getState().accounts || [];
    const filtered = activeCompany
      ? goals.filter((goal) => {
          if (!goal.conta_vinculada) return true;
          const acc = accounts.find((item) => item.id === goal.conta_vinculada);
          return acc?.empresa_id === activeCompany;
        })
      : goals;
    Store.setState({ goals: filtered });

    if (!filtered || filtered.length === 0) {
      container.innerHTML = `<div class="placeholder">Nenhuma meta cadastrada ainda.</div>`;
      return;
    }

    const sorted = filtered.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
    const table = createGoalsTable(sorted);
    container.innerHTML = '';
    container.appendChild(table);

    container.querySelectorAll('button[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const goal = filtered.find((item) => item.id === id);
        if (goal) openModal(goal);
      });
    });

    container.querySelectorAll('button[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const confirmed = await Utils.showConfirm('Tem certeza que deseja excluir esta meta?');
        if (!confirmed) return;
        await DB.delete('goals', id);
        Utils.showToast('Meta excluida.', 'success');
        await Goals.loadList();
      });
    });
  }
};

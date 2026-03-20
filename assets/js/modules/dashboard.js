import { Store } from '../store.js';
import { Router } from '../router.js';
import { Utils } from '../utils.js';
import { LocalData } from '../local-data.js';

const DEFAULT_PORTFOLIO_SETTINGS = {
  filters: {
    all: 'Tudo',
    income: 'Ganhos',
    expense: 'Despesas'
  },
  cards: [
    {
      id: 'checking',
      label: 'Conta Corrente',
      icon: '💳',
      value: 12304.11,
      type: 'income',
      enabled: true
    },
    {
      id: 'investments',
      label: 'Investimentos',
      icon: '🏦',
      value: 7890.44,
      type: 'income',
      enabled: true
    },
    {
      id: 'goals',
      label: 'Metas',
      icon: '🎯',
      value: 4230.0,
      type: 'expense',
      enabled: true
    },
    {
      id: 'suppliers',
      label: 'Fornecedores',
      icon: '📦',
      value: 2190.3,
      type: 'expense',
      enabled: true
    }
  ]
};

function createStatCard({ title, value, icon, trend }) {
  const card = document.createElement('div');
  card.className = 'card stat-card';
  card.innerHTML = `
    <div class="stat-card__header">
      <div class="stat-card__icon">${icon}</div>
      <div class="stat-card__title">${title}</div>
    </div>
    <div class="stat-card__value">${value}</div>
    ${trend ? `<div class="stat-card__trend">${trend}</div>` : ''}
  `;
  return card;
}

export const Dashboard = {
  init() {
    this.grid = document.getElementById('dashboard-metrics');
    this.chartIncome = document.getElementById('chart-income');
    this.chartExpenses = document.getElementById('chart-expenses');
    this.chartLineIncome = document.getElementById('chart-line-income');
    this.chartLineExpense = document.getElementById('chart-line-expense');
    this.portfolioContainer = document.getElementById('portfolio-cards');
    this.portfolioFilterButtons = document.querySelectorAll('[data-portfolio-filter]');
    this.portfolioEditButton = document.getElementById('portfolio-edit');
    this.rangeButtons = document.querySelectorAll('[data-range]');
    this.granularityButtons = document.querySelectorAll('[data-granularity]');
    this.range = '90d';
    this.granularity = 'day';
    this.portfolioFilter = 'all';
    this.portfolioFilters = { ...DEFAULT_PORTFOLIO_SETTINGS.filters };
    this.portfolioCards = DEFAULT_PORTFOLIO_SETTINGS.cards.map((card) => ({ ...card }));
    this.portfolioStorageKey = '';

    this.portfolioFilterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-portfolio-filter') || 'all';
        this.setPortfolioFilter(filter);
      });
    });

    this.portfolioEditButton?.addEventListener('click', () => this.openPortfolioEditor());

    this.rangeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.rangeButtons.forEach((item) => item.classList.remove('pill--active'));
        btn.classList.add('pill--active');
        this.range = btn.getAttribute('data-range') || '90d';
        this.updateChartSummary();
        this.updateChartLine();
      });
    });

    this.granularityButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.granularityButtons.forEach((item) => item.classList.remove('pill--active'));
        btn.classList.add('pill--active');
        this.granularity = btn.getAttribute('data-granularity') || 'day';
        this.updateChartLine();
      });
    });

    Store.subscribe(() => this.refreshAll());
    Router.registerScreenHandler('dashboard', () => this.refreshAll());
    this.refreshAll();
  },

  refreshAll() {
    if (!this.grid) return;
    const state = Store.getState();
    const transactions = state.transactions || [];
    const accounts = state.accounts || [];
    const activeCompany = state.activeCompany;
    const filtered = activeCompany
      ? transactions.filter((tx) => tx.empresa_id === activeCompany || !tx.empresa_id)
      : transactions;

    const filteredAccounts = activeCompany
      ? accounts.filter((acc) => acc.empresa_id === activeCompany || !acc.empresa_id)
      : accounts;

    const resumo = LocalData.calcularResumo(filteredAccounts, filtered);
    const totalBalance = resumo.totalBalance;
    const income = resumo.receitaMes;
    const expenses = resumo.despesaMes;
    const net = resumo.saldoLiquido;

    this.grid.innerHTML = '';

    this.grid.appendChild(
      createStatCard({
        title: 'Saldo Total',
        value: Utils.formatCurrency(totalBalance),
        icon: '💰',
        trend: ''
      })
    );

    this.grid.appendChild(
      createStatCard({
        title: 'Receitas do mês',
        value: Utils.formatCurrency(income),
        icon: '📈',
        trend: ''
      })
    );

    this.grid.appendChild(
      createStatCard({
        title: 'Despesas do mês',
        value: Utils.formatCurrency(expenses),
        icon: '📉',
        trend: ''
      })
    );

    this.grid.appendChild(
      createStatCard({
        title: 'Saldo Líquido',
        value: Utils.formatCurrency(net),
        icon: net >= 0 ? '✅' : '⚠️',
        trend: ''
      })
    );

    this.updateChartSummary(filtered);
    this.updateChartLine(filtered);
    this.refreshPortfolio();
    this.renderRecentTransactions(filtered, filteredAccounts);
  },

  renderRecentTransactions(transactions, accounts) {
    const container = document.getElementById('recent-transactions');
    if (!container) return;

    if (!transactions || transactions.length === 0) {
      container.innerHTML = '<div class="placeholder">Nenhuma transação registrada ainda.</div>';
      return;
    }

    const accountMap = new Map((accounts || []).map((acc) => [acc.id, acc.nome]));
    const sorted = [...transactions].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);
    container.innerHTML = '';

    sorted.forEach((tx) => {
      const row = document.createElement('div');
      row.className = 'mini-table__row';
      const sign = tx.tipo === 'despesa' ? '-' : '+';
      const valueClass = tx.tipo === 'despesa' ? 'negative' : 'positive';
      const accountName = accountMap.get(tx.conta_id) || 'Conta';
      row.innerHTML = `
        <span>${tx.descricao || accountName}</span>
        <span class="mini-table__value ${valueClass}">${sign} ${Utils.formatCurrency(tx.valor)}</span>
      `;
      container.appendChild(row);
    });
  },

  refreshPortfolio() {
    this.loadPortfolioSettings();
    this.renderPortfolioFilters();
    this.renderPortfolioCards();
  },

  getPortfolioStorageKey() {
    const userId = Store.getState().user?.id || 'guest';
    const companyId = Store.getState().activeCompany || 'all';
    return `fincore:portfolio:${userId}:${companyId}`;
  },

  normalizePortfolioCard(card) {
    const type = ['income', 'expense', 'all'].includes(card.type) ? card.type : 'all';
    return {
      id: card.id || Utils.generateId(),
      label: card.label || 'Item',
      icon: card.icon || '💳',
      value: Number(card.value) || 0,
      type,
      enabled: card.enabled !== false
    };
  },

  loadPortfolioSettings() {
    const key = this.getPortfolioStorageKey();
    if (this.portfolioStorageKey === key && this.portfolioCards.length) return;
    this.portfolioStorageKey = key;

    let parsed = null;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        console.warn('[FinCore] Dados de carteira corrompidos, usando padrao.');
      }
    }

    this.portfolioFilters = {
      ...DEFAULT_PORTFOLIO_SETTINGS.filters,
      ...(parsed?.filters || {})
    };

    const cards = Array.isArray(parsed?.cards) && parsed.cards.length
      ? parsed.cards
      : DEFAULT_PORTFOLIO_SETTINGS.cards;
    this.portfolioCards = cards.map((card) => this.normalizePortfolioCard(card));
  },

  savePortfolioSettings() {
    const key = this.getPortfolioStorageKey();
    const payload = {
      filters: this.portfolioFilters,
      cards: this.portfolioCards
    };
    localStorage.setItem(key, JSON.stringify(payload));
  },

  renderPortfolioFilters() {
    if (!this.portfolioFilterButtons?.length) return;
    this.portfolioFilterButtons.forEach((btn) => {
      const filter = btn.getAttribute('data-portfolio-filter') || 'all';
      const label = this.portfolioFilters[filter] || btn.textContent || DEFAULT_PORTFOLIO_SETTINGS.filters[filter] || '';
      btn.textContent = label;
      btn.classList.toggle('pill--active', filter === this.portfolioFilter);
    });
  },

  renderPortfolioCards() {
    if (!this.portfolioContainer) return;
    const cards = this.portfolioCards.filter((card) => card.enabled !== false);
    const filtered = this.portfolioFilter === 'all'
      ? cards
      : cards.filter((card) => card.type === this.portfolioFilter);

    this.portfolioContainer.innerHTML = '';

    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'placeholder';
      empty.textContent = 'Sem itens para exibir neste filtro.';
      this.portfolioContainer.appendChild(empty);
      return;
    }

    filtered.forEach((card) => {
      const article = document.createElement('article');
      article.className = 'portfolio-card';

      const icon = document.createElement('div');
      icon.className = 'portfolio-card__icon';
      icon.textContent = card.icon;

      const info = document.createElement('div');
      const label = document.createElement('div');
      label.className = 'portfolio-card__label';
      label.textContent = card.label;

      const value = document.createElement('div');
      value.className = 'portfolio-card__value';
      value.textContent = Utils.formatCurrency(card.value);

      info.append(label, value);
      article.append(icon, info);
      this.portfolioContainer.appendChild(article);
    });
  },

  setPortfolioFilter(filter) {
    this.portfolioFilter = filter || 'all';
    this.renderPortfolioFilters();
    this.renderPortfolioCards();
  },

  openPortfolioEditor() {
    const container = document.getElementById('modal-container');
    if (!container) return;

    const escapeHtml = (value) => String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const filterAll = escapeHtml(this.portfolioFilters.all);
    const filterIncome = escapeHtml(this.portfolioFilters.income);
    const filterExpense = escapeHtml(this.portfolioFilters.expense);

    container.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="Editar carteira ativa">
        <div class="modal__content">
          <header class="modal__header">
            <h2 class="modal__title">Editar carteira ativa</h2>
            <button class="btn btn--ghost btn--icon" type="button" data-action="close" aria-label="Fechar">✕</button>
          </header>
          <form id="portfolio-editor-form" class="modal__body">
            <div class="portfolio-editor__section">
              <h3 class="portfolio-editor__title">Filtros</h3>
              <div class="portfolio-editor__grid">
                <div class="form-group">
                  <label for="portfolio-filter-all">Texto - Tudo</label>
                  <input id="portfolio-filter-all" name="filterAll" type="text" value="${filterAll}" />
                </div>
                <div class="form-group">
                  <label for="portfolio-filter-income">Texto - Ganhos</label>
                  <input id="portfolio-filter-income" name="filterIncome" type="text" value="${filterIncome}" />
                </div>
                <div class="form-group">
                  <label for="portfolio-filter-expense">Texto - Despesas</label>
                  <input id="portfolio-filter-expense" name="filterExpense" type="text" value="${filterExpense}" />
                </div>
              </div>
            </div>
            <div class="portfolio-editor__section">
              <h3 class="portfolio-editor__title">Cards</h3>
              ${this.portfolioCards
                .map((card) => {
                  const enabled = card.enabled ? 'checked' : '';
                  return `
                    <div class="portfolio-editor__card" data-card-id="${escapeHtml(card.id)}">
                      <div class="portfolio-editor__row">
                        <div class="form-group">
                          <label>Icone</label>
                          <input type="text" maxlength="4" value="${escapeHtml(card.icon)}" data-field="icon" />
                        </div>
                        <div class="form-group">
                          <label>Nome</label>
                          <input type="text" value="${escapeHtml(card.label)}" data-field="label" />
                        </div>
                      </div>
                      <div class="portfolio-editor__row">
                        <div class="form-group">
                          <label>Valor</label>
                          <input type="number" step="0.01" value="${escapeHtml(card.value)}" data-field="value" />
                        </div>
                        <div class="form-group">
                          <label>Tipo</label>
                          <select data-field="type">
                            <option value="all" ${card.type === 'all' ? 'selected' : ''}>Tudo</option>
                            <option value="income" ${card.type === 'income' ? 'selected' : ''}>Ganhos</option>
                            <option value="expense" ${card.type === 'expense' ? 'selected' : ''}>Despesas</option>
                          </select>
                        </div>
                      </div>
                      <label class="checkbox">
                        <input type="checkbox" data-field="enabled" ${enabled} />
                        <span>Ativo</span>
                      </label>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </form>
          <div class="modal__footer">
            <button class="btn btn--secondary" type="button" data-action="close">Cancelar</button>
            <button class="btn btn--primary" type="submit" form="portfolio-editor-form">Salvar</button>
          </div>
        </div>
      </div>
    `;

    const closeModal = () => {
      container.innerHTML = '';
    };

    container.querySelectorAll('[data-action="close"]').forEach((btn) => {
      btn.addEventListener('click', closeModal);
    });

    const form = container.querySelector('#portfolio-editor-form');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const newFilters = {
        all: form.querySelector('[name="filterAll"]')?.value.trim() || DEFAULT_PORTFOLIO_SETTINGS.filters.all,
        income: form.querySelector('[name="filterIncome"]')?.value.trim() || DEFAULT_PORTFOLIO_SETTINGS.filters.income,
        expense: form.querySelector('[name="filterExpense"]')?.value.trim() || DEFAULT_PORTFOLIO_SETTINGS.filters.expense
      };

      const newCards = Array.from(form.querySelectorAll('[data-card-id]')).map((row) => {
        const id = row.getAttribute('data-card-id') || Utils.generateId();
        const label = row.querySelector('[data-field="label"]')?.value.trim() || 'Item';
        const icon = row.querySelector('[data-field="icon"]')?.value.trim() || '💳';
        const rawValue = row.querySelector('[data-field="value"]')?.value || '0';
        const value = Number.parseFloat(rawValue.replace(',', '.')) || 0;
        const type = row.querySelector('[data-field="type"]')?.value || 'all';
        const enabled = row.querySelector('[data-field="enabled"]')?.checked ?? true;
        return this.normalizePortfolioCard({
          id,
          label,
          icon,
          value,
          type,
          enabled
        });
      });

      this.portfolioFilters = newFilters;
      this.portfolioCards = newCards;
      this.savePortfolioSettings();
      this.renderPortfolioFilters();
      this.renderPortfolioCards();
      Utils.showToast('Carteira atualizada!', 'success');
      closeModal();
    });
  },

  updateChartSummary(transactions = null) {
    const state = Store.getState();
    const list = transactions || state.transactions || [];
    const activeCompany = state.activeCompany;
    const filtered = activeCompany
      ? list.filter((tx) => tx.empresa_id === activeCompany)
      : list;

    const rangeStart = this.getRangeStart();
    const ranged = filtered.filter((tx) => {
      const date = new Date(tx.data);
      return date >= rangeStart;
    });

    const income = ranged
      .filter((tx) => tx.tipo === 'receita')
      .reduce((sum, tx) => sum + (Number(tx.valor) || 0), 0);

    const expenses = ranged
      .filter((tx) => tx.tipo === 'despesa')
      .reduce((sum, tx) => sum + (Number(tx.valor) || 0), 0);

    if (this.chartIncome) this.chartIncome.textContent = Utils.formatCurrency(income);
    if (this.chartExpenses) this.chartExpenses.textContent = Utils.formatCurrency(expenses);
  },

  updateChartLine(transactions = null) {
    if (!this.chartLineIncome || !this.chartLineExpense) return;
    const state = Store.getState();
    const list = transactions || state.transactions || [];
    const activeCompany = state.activeCompany;
    const filtered = activeCompany
      ? list.filter((tx) => tx.empresa_id === activeCompany)
      : list;

    const rangeStart = this.getRangeStart();
    const ranged = filtered.filter((tx) => {
      const date = new Date(tx.data);
      return date >= rangeStart;
    });

    const series = this.aggregateByGranularity(ranged);
    if (!series.length) {
      this.chartLineIncome.setAttribute('d', '');
      this.chartLineExpense.setAttribute('d', '');
      return;
    }

    const incomeValues = series.map((point) => point.income);
    const expenseValues = series.map((point) => point.expense);
    const min = 0;
    const max = Math.max(...incomeValues, ...expenseValues, 1);
    const range = max - min || 1;

    const step = 100 / Math.max(series.length - 1, 1);
    const incomePoints = series.map((point, index) => {
      const x = index * step;
      const y = 40 - ((point.income - min) / range) * 40;
      return { x, y };
    });

    const expensePoints = series.map((point, index) => {
      const x = index * step;
      const y = 40 - ((point.expense - min) / range) * 40;
      return { x, y };
    });

    const incomePath = this.buildSmoothPath(incomePoints);
    const expensePath = this.buildSmoothPath(expensePoints);

    this.chartLineIncome.setAttribute('d', incomePath);
    this.chartLineExpense.setAttribute('d', expensePath);
  },

  getRangeStart() {
    const now = new Date();
    const start = new Date(now);

    switch (this.range) {
      case '7d':
        start.setDate(now.getDate() - 6);
        break;
      case '30d':
        start.setDate(now.getDate() - 29);
        break;
      case '1y':
        start.setFullYear(now.getFullYear() - 1);
        break;
      case '90d':
      default:
        start.setDate(now.getDate() - 89);
        break;
    }

    start.setHours(0, 0, 0, 0);
    return start;
  },

  aggregateByGranularity(transactions) {
    const buckets = new Map();
    transactions.forEach((tx) => {
      const date = new Date(tx.data);
      let key = '';

      if (this.granularity === 'week') {
        const weekStart = new Date(date);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        weekStart.setHours(0, 0, 0, 0);
        key = weekStart.toISOString().slice(0, 10);
      } else if (this.granularity === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = date.toISOString().slice(0, 10);
      }

      const current = buckets.get(key) || { income: 0, expense: 0 };
      const amount = Number(tx.valor) || 0;
      if (tx.tipo === 'receita') {
        current.income += amount;
      } else if (tx.tipo === 'despesa') {
        current.expense += amount;
      }
      buckets.set(key, current);
    });

    return Array.from(buckets.entries())
        .sort(([a], [b]) => (a > b ? 1 : -1))
        .map(([label, value]) => ({ label, ...value }));
  },

  buildSmoothPath(points) {
    if (points.length === 0) return '';
    if (points.length === 1) {
      const p = points[0];
      return `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    }

    const smoothing = 0.18;
    const path = [`M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`];

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const prev = points[i - 1] || current;
      const after = points[i + 2] || next;

      const control1x = current.x + (next.x - prev.x) * smoothing;
      const control1y = current.y + (next.y - prev.y) * smoothing;
      const control2x = next.x - (after.x - current.x) * smoothing;
      const control2y = next.y - (after.y - current.y) * smoothing;

      path.push(
        `C ${control1x.toFixed(2)} ${control1y.toFixed(2)} ` +
        `${control2x.toFixed(2)} ${control2y.toFixed(2)} ` +
        `${next.x.toFixed(2)} ${next.y.toFixed(2)}`
      );
    }

    return path.join(' ');
  },

  calculateBalance(transactions) {
    return transactions.reduce((acc, tx) => {
      const value = Number(tx.valor) || 0;
      if (tx.tipo === 'receita') return acc + value;
      if (tx.tipo === 'despesa') return acc - value;
      return acc;
    }, 0);
  },

  calculateIncome(transactions) {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return transactions.reduce((acc, tx) => {
      const date = new Date(tx.data);
      if (tx.tipo === 'receita' && date.getMonth() === month && date.getFullYear() === year) {
        return acc + Number(tx.valor || 0);
      }
      return acc;
    }, 0);
  },

  calculateExpenses(transactions) {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return transactions.reduce((acc, tx) => {
      const date = new Date(tx.data);
      if (tx.tipo === 'despesa' && date.getMonth() === month && date.getFullYear() === year) {
        return acc + Number(tx.valor || 0);
      }
      return acc;
    }, 0);
  }
};

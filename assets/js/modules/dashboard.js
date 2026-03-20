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
    this.rangeButtons = document.querySelectorAll('[data-range]');
    this.granularityButtons = document.querySelectorAll('[data-granularity]');
    this.range = '90d';
    this.granularity = 'day';

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
    // Carteira ativa removida.
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

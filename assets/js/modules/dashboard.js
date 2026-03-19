import { Store } from '../store.js';
import { Router } from '../router.js';
import { Utils } from '../utils.js';

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
    this.grid = document.getElementById('dashboard-grid');
    Store.subscribe(() => this.refreshAll());
    Router.registerScreenHandler('dashboard', () => this.refreshAll());
    this.refreshAll();
  },

  refreshAll() {
    if (!this.grid) return;
    const state = Store.getState();
    const transactions = state.transactions || [];

    const totalBalance = this.calculateBalance(transactions);
    const income = this.calculateIncome(transactions);
    const expenses = this.calculateExpenses(transactions);
    const net = income - expenses;

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

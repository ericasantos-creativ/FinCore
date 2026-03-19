import { Store } from '../store.js';
import { Router } from '../router.js';

export const Reports = {
  init() {
    this.container = document.getElementById('reports-content');
    Router.registerScreenHandler('reports', () => this.loadReports());
    this.loadReports();
  },

  loadReports() {
    if (!this.container) return;

    const state = Store.getState();
    const transactions = state.transactions || [];

    // Calcular receitas e despesas
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    const profit = income - expenses;
    const profitPercent = income > 0 ? ((profit / income) * 100).toFixed(1) : 0;

    // Contar transações por tipo
    const incomeCount = transactions.filter(t => t.type === 'income').length;
    const expenseCount = transactions.filter(t => t.type === 'expense').length;

    this.render(income, expenses, profit, profitPercent, incomeCount, expenseCount);
  },

  render(income, expenses, profit, profitPercent, incomeCount, expenseCount) {
    const profitClass = profit >= 0 ? 'report--positive' : 'report--negative';
    const profitIcon = profit >= 0 ? '📈' : '📉';

    this.container.innerHTML = `
      <div class="reports-summary">
        <div class="report-card report-card--income">
          <div class="report-card__icon">📊</div>
          <div class="report-card__content">
            <div class="report-card__label">Receitas</div>
            <div class="report-card__value">R$ ${income.toFixed(2)}</div>
            <div class="report-card__count">${incomeCount} transação(ões)</div>
          </div>
        </div>

        <div class="report-card report-card--expense">
          <div class="report-card__icon">💸</div>
          <div class="report-card__content">
            <div class="report-card__label">Despesas</div>
            <div class="report-card__value">R$ ${expenses.toFixed(2)}</div>
            <div class="report-card__count">${expenseCount} transação(ões)</div>
          </div>
        </div>

        <div class="report-card ${profitClass}">
          <div class="report-card__icon">${profitIcon}</div>
          <div class="report-card__content">
            <div class="report-card__label">Resultado Líquido</div>
            <div class="report-card__value">R$ ${profit.toFixed(2)}</div>
            <div class="report-card__percent">${profitPercent}% de rentabilidade</div>
          </div>
        </div>
      </div>

      <div class="reports-info">
        <p class="text-muted">Relatório baseado em ${incomeCount + expenseCount} transação(ões) no período.</p>
      </div>
    `;
  }
};

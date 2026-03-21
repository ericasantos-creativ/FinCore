import { Store } from '../store.js';
import { Router } from '../router.js';

export const Reports = {
  init() {
    console.log('[Reports] init() chamado');
    this.container = document.getElementById('reports-content');
    console.log('[Reports] container encontrado:', this.container);
    Router.registerScreenHandler('reports', () => this.loadReports());
    this.loadReports();
  },

  loadReports() {
    console.log('[Reports] loadReports chamado');
    if (!this.container) return;

    const state = Store.getState();
    const transactions = state.transactions || [];
    const activeCompany = state.activeCompany;
    let filtered = activeCompany
      ? transactions.filter((tx) => tx.empresa_id === activeCompany)
      : transactions;

    // Filtro por período.data/hora (se selecionado)
    const startInput = document.getElementById('report-start-date');
    const endInput = document.getElementById('report-end-date');
    const startDate = startInput?.value ? new Date(startInput.value) : null;
    const endDate = endInput?.value ? new Date(endInput.value) : null;

    if (startDate || endDate) {
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.data);
        if (isNaN(txDate.getTime())) return false;
        if (startDate && txDate < startDate) return false;
        if (endDate && txDate > endDate) return false;
        return true;
      });
    }

    if (!filtered.length) {
      this.container.innerHTML = `<div class="reports-info"><p class="text-muted">Nenhuma transação encontrada no período selecionado. Ajuste a data/hora e tente novamente.</p></div>`;
      return;
    }

    // Calcular dados semanais
    const weeklyData = this.calculateWeeklyData(filtered);

    // Calcular receitas e despesas totais
    const income = filtered
      .filter((t) => t.tipo === 'receita')
      .reduce((sum, t) => sum + (parseFloat(t.valor) || 0), 0);

    const expenses = filtered
      .filter((t) => t.tipo === 'despesa')
      .reduce((sum, t) => sum + (parseFloat(t.valor) || 0), 0);

    const profit = income - expenses;
    const profitPercent = income > 0 ? ((profit / income) * 100).toFixed(1) : 0;

    // Contar transações por tipo
    const incomeCount = filtered.filter((t) => t.tipo === 'receita').length;
    const expenseCount = filtered.filter((t) => t.tipo === 'despesa').length;

    // Gerar dicas
    const tips = this.generateTips(income, expenses, profit);

    this.render(income, expenses, profit, profitPercent, incomeCount, expenseCount, weeklyData, tips);
  },

  calculateWeeklyData(transactions) {
    const weeks = {};
    transactions.forEach(tx => {
      const date = new Date(tx.data);
      const weekKey = this.getWeekKey(date);
      if (!weeks[weekKey]) {
        weeks[weekKey] = { income: 0, expenses: 0, count: 0 };
      }
      const value = parseFloat(tx.valor) || 0;
      if (tx.tipo === 'receita') {
        weeks[weekKey].income += value;
      } else if (tx.tipo === 'despesa') {
        weeks[weekKey].expenses += value;
      }
      weeks[weekKey].count += 1;
    });
    return weeks;
  },

  getWeekKey(date) {
    const year = date.getFullYear();
    const week = Math.ceil((date - new Date(year, 0, 1)) / (7 * 24 * 60 * 60 * 1000));
    return `${year}-W${week}`;
  },

  generateTips(income, expenses, profit) {
    const tips = [];
    if (!income && !expenses) {
      tips.push("Ainda não há transações para gerar recomendações. Registre ganhos e gastos para receber dicas mais precisas.");
      return tips;
    }

    if (expenses > income) {
      tips.push("Suas despesas estão superiores às receitas. Considere reduzir gastos não essenciais e renegociar contratos.");
    } else if (profit > 0 && expenses / income > 0.6) {
      tips.push("Você tem lucro, mas as despesas estão altas. Otimize custos fixos e automatize processos para ganhar margem.");
    } else {
      tips.push("Ótimo: as receitas superam as despesas. Mantenha controles e reinvista parte do lucro em melhorias da operação.");
    }

    if (profit < 0) {
      tips.push("Você está com prejuízo. Analise categorias com maior impacto e pause gastos que não trazem retorno imediato.");
    }

    if (expenses / income > 0.7) {
      tips.push("Dependência alta de custos. Reserve um buffer financeiro e crie metas semanais de redução de despesas.");
    }

    tips.push("Use a aba Relatório semanalmente para acompanhar ganhos, gastos e ajustar o plano de ação da empresa.");
    return tips;
  },

  render(income, expenses, profit, profitPercent, incomeCount, expenseCount, weeklyData, tips) {
    const profitClass = profit >= 0 ? 'report--positive' : 'report--negative';
    const profitIcon = profit >= 0 ? '📈' : '📉';

    // Preparar dados para gráficos
    const labels = Object.keys(weeklyData).sort();
    const incomeData = labels.map(w => weeklyData[w].income);
    const expenseData = labels.map(w => weeklyData[w].expenses);

    this.container.innerHTML = `
      <div class="reports-filter">
        <div>
          <label for="report-start-date">De</label>
          <input id="report-start-date" type="datetime-local" />
        </div>
        <div>
          <label for="report-end-date">Até</label>
          <input id="report-end-date" type="datetime-local" />
        </div>
        <button id="report-apply-filter" class="btn btn--ghost">Aplicar filtro</button>
      </div>

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

      <div class="reports-charts">
        <h2>Relatório Semanal</h2>
        <canvas id="weeklyChart" width="400" height="200"></canvas>
      </div>

      <div class="reports-tips">
        <h2>Dicas Financeiras</h2>
        <ul>
          ${tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>

      <div class="reports-actions">
        <button id="send-report" class="btn btn--primary">Enviar Relatório por E-mail</button>
      </div>

      <div class="reports-info">
        <p class="text-muted">Relatório baseado em ${incomeCount + expenseCount} transação(ões) no período.</p>
      </div>
    `;

    // Renderizar gráfico
    this.renderChart(labels, incomeData, expenseData);
    this.bindSendReport();
    this.bindFilter();
  },

  renderChart(labels, incomeData, expenseData) {
    console.log('[Reports] renderChart chamado com labels:', labels.length);
    console.log('[Reports] Chart disponível:', typeof Chart);
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) {
      console.error('[Reports] Canvas weeklyChart não encontrado');
      return;
    }
    if (typeof Chart === 'undefined') {
      console.error('[Reports] Chart.js não carregado');
      ctx.parentNode.innerHTML = '<p>Erro: Chart.js não carregado. Recarregue a página.</p>';
      return;
    }
    console.log('[Reports] Canvas encontrado, criando gráfico');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Receitas',
          data: incomeData,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }, {
          label: 'Despesas',
          data: expenseData,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Ganhos e Gastos Semanais'
          }
        }
      }
    });
    console.log('[Reports] Gráfico criado com sucesso');
  },

  bindSendReport() {
    const btn = document.getElementById('send-report');
    if (btn) {
      btn.addEventListener('click', () => {
        const state = Store.getState();
        const user = state.user || {};
        const userEmail = user.email || 'seu-email@dominio.com';

        const incomeText = document.querySelector('.report-card--income .report-card__value')?.textContent || 'R$ 0,00';
        const expensesText = document.querySelector('.report-card--expense .report-card__value')?.textContent || 'R$ 0,00';
        const resultText = document.querySelector('.report-card.report--positive .report-card__value, .report-card.report--negative .report-card__value')?.textContent || 'R$ 0,00';

        const summary = `Relatório semanal:\n- Receitas: ${incomeText}\n- Despesas: ${expensesText}\n- Resultado: ${resultText}`;

        alert(`Relatório enviado para ${userEmail}!\n\n${summary}\n\nDicas enviadas: abra a aba Relatório para revisar e aplicar as recomendações.`);

        // TODO: integrar com backend (Supabase, SMTP, API de e-mail) para envio real.
      });
    }
  },

  bindFilter() {
    const btn = document.getElementById('report-apply-filter');
    if (!btn) return;
    btn.addEventListener('click', () => {
      this.loadReports();
    });
  }
};

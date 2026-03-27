const fs = require('fs');

let js = fs.readFileSync('assets/js/model-app.js', 'utf8');

const ptExt = 
        // Módulos Extras
        'executiveOverview': 'Visão Executiva',
        'executiveSubtitle': 'Monitoramento em tempo real do seu ecossistema financeiro.',
        'cashFlow': 'Fluxo de Caixa',
        'last6Months': 'Últimos 6 Meses',
        'lastYear': 'Último Ano',
        'expenseBreakdown': 'Detalhamento de Despesas',
        'total': 'Total',
        'housing': 'Moradia',
        'foodAndDrinks': 'Alimentação & Bebidas',
        'transport': 'Transporte',
        'recentTransactions': 'Transações Recentes',
        'viewAll': 'Ver Tudo',
        'dateHeader': 'Data',
        'descHeader': 'Descrição',
        'catHeader': 'Categoria',
        'amountHeader': 'Valor',
        'software': 'Software',
        'revenue': 'Receita',
        'foodAndDrink': 'Alimentação',
;

const enExt = 
        // Módulos Extras
        'executiveOverview': 'Executive Overview',
        'executiveSubtitle': 'Real-time monitoring of your financial ecosystem.',
        'cashFlow': 'Cash Flow',
        'last6Months': 'Last 6 Months',
        'lastYear': 'Last Year',
        'expenseBreakdown': 'Expense Breakdown',
        'total': 'Total',
        'housing': 'Housing',
        'foodAndDrinks': 'Food & Drinks',
        'transport': 'Transport',
        'recentTransactions': 'Recent Transactions',
        'viewAll': 'View All',
        'dateHeader': 'Date',
        'descHeader': 'Description',
        'catHeader': 'Category',
        'amountHeader': 'Amount',
        'software': 'Software',
        'revenue': 'Revenue',
        'foodAndDrink': 'Food & Drink',
;

js = js.replace(/(\'pt-BR\':\s*\{)/, \ + ptExt);
js = js.replace(/(\'en\':\s*\{)/, \ + enExt);

fs.writeFileSync('assets/js/model-app.js', js);
console.log('JS translations injected!');

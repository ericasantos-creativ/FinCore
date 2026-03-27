const fs = require('fs');

let js = fs.readFileSync('assets/js/model-app.js', 'utf8');

const ptExt = "\n" +
"        'executiveOverview': 'Visão Executiva',\n" +
"        'executiveSubtitle': 'Monitoramento em tempo real do seu ecossistema financeiro.',\n" +
"        'cashFlow': 'Fluxo de Caixa',\n" +
"        'last6Months': 'Últimos 6 Meses',\n" +
"        'lastYear': 'Último Ano',\n" +
"        'expenseBreakdown': 'Detalhamento de Despesas',\n" +
"        'total': 'Total',\n" +
"        'housing': 'Moradia',\n" +
"        'foodAndDrinks': 'Alimentação & Bebidas',\n" +
"        'transport': 'Transporte',\n" +
"        'recentTransactions': 'Transações Recentes',\n" +
"        'viewAll': 'Ver Tudo',\n" +
"        'dateHeader': 'Data',\n" +
"        'descHeader': 'Descrição',\n" +
"        'catHeader': 'Categoria',\n" +
"        'amountHeader': 'Valor',\n" +
"        'software': 'Software',\n" +
"        'revenue': 'Receita',\n" +
"        'foodAndDrink': 'Alimentação',\n";

const enExt = "\n" +
"        'executiveOverview': 'Executive Overview',\n" +
"        'executiveSubtitle': 'Real-time monitoring of your financial ecosystem.',\n" +
"        'cashFlow': 'Cash Flow',\n" +
"        'last6Months': 'Last 6 Months',\n" +
"        'lastYear': 'Last Year',\n" +
"        'expenseBreakdown': 'Expense Breakdown',\n" +
"        'total': 'Total',\n" +
"        'housing': 'Housing',\n" +
"        'foodAndDrinks': 'Food & Drinks',\n" +
"        'transport': 'Transport',\n" +
"        'recentTransactions': 'Recent Transactions',\n" +
"        'viewAll': 'View All',\n" +
"        'dateHeader': 'Date',\n" +
"        'descHeader': 'Description',\n" +
"        'catHeader': 'Category',\n" +
"        'amountHeader': 'Amount',\n" +
"        'software': 'Software',\n" +
"        'revenue': 'Revenue',\n" +
"        'foodAndDrink': 'Food & Drink',\n";


js = js.replace(/('pt-BR':\s*\{)/, "" + ptExt);
js = js.replace(/('en':\s*\{)/, "" + enExt);

fs.writeFileSync('assets/js/model-app.js', js);
console.log('done JS text replace.');
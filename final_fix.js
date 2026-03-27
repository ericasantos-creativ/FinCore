const fs = require('fs');

// 1. Fix HTML
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/M\u00f3dulos Extras \(Design Est\u00e1tico\)/g, '<span data-i18n=\"extraModules\">M\u00f3dulos Extras (Design Est\u00e1tico)</span>');
html = html.replace(/M\u00f3dulos Extras \(Tabela de Transa\u00e7\u00f5es - Design Est\u00e1tico\)/g, '<span data-i18n=\"extraModulesTable\">M\u00f3dulos Extras (Tabela de Transa\u00e7\u00f5es - Design Est\u00e1tico)</span>');
html = html.replace(/M\u00f3dulos Extras \(Design Est\u00e1tico - Lista\)/g, '<span data-i18n=\"extraModulesList\">M\u00f3dulos Extras (Design Est\u00e1tico - Lista)</span>');
html = html.replace(/>Design do Relat\u00f3rio \(Stitch Layout Mockup\)</g, ' data-i18n=\"mockupReport\">Design do Relat\u00f3rio (Stitch Layout Mockup)<');

// Missing span tags for the other things (from fix_static_translations.js)
const replaces = [
    ['Executive Overview', '<span data-i18n=\"executiveOverview\">Executive Overview</span>'],
    ['Real-time monitoring of your financial ecosystem.', '<span data-i18n=\"executiveSubtitle\">Real-time monitoring of your financial ecosystem.</span>'],
    ['Cash Flow', '<span data-i18n=\"cashFlow\">Cash Flow</span>'],
    ['Last 6 Months', '<span data-i18n=\"last6Months\">Last 6 Months</span>'],
    ['Last Year', '<span data-i18n=\"lastYear\">Last Year</span>'],
    ['Expense Breakdown', '<span data-i18n=\"expenseBreakdown\">Expense Breakdown</span>'],
    ['TOTAL', '<span data-i18n=\"total\">TOTAL</span>'],
    ['Housing', '<span data-i18n=\"housing\">Housing</span>'],
    ['Food &amp; Drinks', '<span data-i18n=\"foodAndDrinks\">Food &amp; Drinks</span>'],
    ['Transport', '<span data-i18n=\"transport\">Transport</span>'],
    ['Recent Transactions', '<span data-i18n=\"recentTransactions\">Recent Transactions</span>'],
    ['View All', '<span data-i18n=\"viewAll\">View All</span>'],
    ['DATE', '<span data-i18n=\"dateHeader\">DATE</span>'],
    ['DESCRIPTION', '<span data-i18n=\"descHeader\">DESCRIPTION</span>'],
    ['CATEGORY', '<span data-i18n=\"catHeader\">CATEGORY</span>'],
    ['AMOUNT', '<span data-i18n=\"amountHeader\">AMOUNT</span>'],
    ['SOFTWARE', '<span data-i18n=\"software\">SOFTWARE</span>'],
    ['REVENUE', '<span data-i18n=\"revenue\">REVENUE</span>'],
    ['FOOD &amp; DRINK', '<span data-i18n=\"foodAndDrink\">FOOD &amp; DRINK</span>'],
];

replaces.forEach(([find, repl]) => {
    // Only replace if it doesn't already have data-i18n
    if (html.indexOf(repl) === -1) {
        // we use split join for global literal replacing avoiding regex traps for simple tags
        html = html.split('>' + find + '<').join('>' + repl + '<');
    }
});

// Ensure dashboard section has content-section
if (html.includes('id=\"dashboard-section\" class=\"screen w-full max-w-7xl mx-auto\"')) {
    html = html.replace('id=\"dashboard-section\" class=\"screen w-full max-w-7xl mx-auto\"', 'id=\"dashboard-section\" class=\"content-section screen w-full max-w-7xl mx-auto\"');
}

fs.writeFileSync('index.html', html, 'utf8');

// 2. Fix JS
let js = fs.readFileSync('assets/js/model-app.js', 'utf8');

const ptExt = "\n" +
"        'executiveOverview': 'Vis\u00e3o Executiva',\n" +
"        'executiveSubtitle': 'Monitoramento em tempo real do seu ecossistema financeiro.',\n" +
"        'cashFlow': 'Fluxo de Caixa',\n" +
"        'last6Months': '\u00daltimos 6 Meses',\n" +
"        'lastYear': '\u00daltimo Ano',\n" +
"        'expenseBreakdown': 'Detalhamento de Despesas',\n" +
"        'total': 'Total',\n" +
"        'housing': 'Moradia',\n" +
"        'foodAndDrinks': 'Alimenta\u00e7\u00e3o & Bebidas',\n" +
"        'transport': 'Transporte',\n" +
"        'recentTransactions': 'Transa\u00e7\u00f5es Recentes',\n" +
"        'viewAll': 'Ver Tudo',\n" +
"        'dateHeader': 'Data',\n" +
"        'descHeader': 'Descri\u00e7\u00e3o',\n" +
"        'catHeader': 'Categoria',\n" +
"        'amountHeader': 'Valor',\n" +
"        'software': 'Software',\n" +
"        'revenue': 'Receita',\n" +
"        'foodAndDrink': 'Alimenta\u00e7\u00e3o',\n" +
"        'extraModules': 'M\u00f3dulos Extras (Design Est\u00e1tico)',\n" +
"        'extraModulesTable': 'M\u00f3dulos Extras (Tabela de Transa\u00e7\u00f5es - Design Est\u00e1tico)',\n" +
"        'extraModulesList': 'M\u00f3dulos Extras (Design Est\u00e1tico - Lista)',\n" +
"        'mockupReport': 'Design do Relat\u00f3rio (Stitch Layout Mockup)',\n";

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
"        'foodAndDrink': 'Food & Drink',\n" +
"        'extraModules': 'Extra Modules (Static Design)',\n" +
"        'extraModulesTable': 'Extra Modules (Transactions Table - Static Design)',\n" +
"        'extraModulesList': 'Extra Modules (Static Design - List)',\n" +
"        'mockupReport': 'Report Design (Stitch Layout Mockup)',\n";

// Replacing cleanly to preserve the dictionary opening tags!
js = js.replace(/('pt-BR':\s*\{)/, \"\\" + ptExt);
js = js.replace(/('en':\s*\{)/, \"\\" + enExt);

fs.writeFileSync('assets/js/model-app.js', js, 'utf8');

console.log('Success applying translations safely!');
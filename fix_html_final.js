const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const replaces = [
    ['M\u00f3dulos Extras (Design Est\u00e1tico)', '<span data-i18n=\"extraModules\">M\u00f3dulos Extras (Design Est\u00e1tico)</span>'],
    ['M\u00f3dulos Extras (Tabela de Transa\u00e7\u00f5es - Design Est\u00e1tico)', '<span data-i18n=\"extraModulesTable\">M\u00f3dulos Extras (Tabela de Transa\u00e7\u00f5es - Design Est\u00e1tico)</span>'],
    ['M\u00f3dulos Extras (Design Est\u00e1tico - Lista)', '<span data-i18n=\"extraModulesList\">M\u00f3dulos Extras (Design Est\u00e1tico - Lista)</span>'],
    ['Design do Relat\u00f3rio (Stitch Layout Mockup)', '<span data-i18n=\"mockupReport\">Design do Relat\u00f3rio (Stitch Layout Mockup)</span>'],
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
    // replace literal strings within tags by looking for matching > < only to prevent nesting problems
    if (!html.includes(repl)) {
        html = html.split('>' + find + '<').join('>' + repl + '<');
    }
});

if (html.includes('id=\"dashboard-section\" class=\"screen w-full max-w-7xl mx-auto\"')) {
    html = html.replace('id=\"dashboard-section\" class=\"screen w-full max-w-7xl mx-auto\"', 'id=\"dashboard-section\" class=\"content-section screen w-full max-w-7xl mx-auto\"');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('HTML mapped.');
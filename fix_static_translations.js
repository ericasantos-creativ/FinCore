const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const replacements = [
    { text: '>Executive Overview<', sub: ' data-i18n=\"executiveOverview\">Executive Overview<' },
    { text: '>Real-time monitoring of your financial ecosystem.<', sub: ' data-i18n=\"executiveSubtitle\">Real-time monitoring of your financial ecosystem.<' },
    { text: '>Cash Flow<', sub: ' data-i18n=\"cashFlow\">Cash Flow<' },
    { text: '>Last 6 Months<', sub: ' data-i18n=\"last6Months\">Last 6 Months<' },
    { text: '>Last Year<', sub: ' data-i18n=\"lastYear\">Last Year<' },
    { text: '>Expense Breakdown<', sub: ' data-i18n=\"expenseBreakdown\">Expense Breakdown<' },
    { text: '>Total<', sub: ' data-i18n=\"total\">Total<' },
    { text: '>Housing<', sub: ' data-i18n=\"housing\">Housing<' },
    { text: '>Food &amp; Drinks<', sub: ' data-i18n=\"foodAndDrinks\">Food &amp; Drinks<' },
    { text: '>Transport<', sub: ' data-i18n=\"transport\">Transport<' },
    { text: '>Recent Transactions<', sub: ' data-i18n=\"recentTransactions\">Recent Transactions<' },
    { text: '>View All<', sub: ' data-i18n=\"viewAll\">View All<' },
    { text: '>Date<', sub: ' data-i18n=\"dateHeader\">Date<' },
    { text: '>Description<', sub: ' data-i18n=\"descHeader\">Description<' },
    { text: '>Category<', sub: ' data-i18n=\"catHeader\">Category<' },
    { text: '>Amount<', sub: ' data-i18n=\"amountHeader\">Amount<' },
    { text: '>Software<', sub: ' data-i18n=\"software\">Software<' },
    { text: '>Revenue<', sub: ' data-i18n=\"revenue\">Revenue<' },
    { text: '>Food &amp; Drink<', sub: ' data-i18n=\"foodAndDrink\">Food &amp; Drink<' }
];

replacements.forEach(r => {
    html = html.replace(new RegExp(r.text, 'g'), r.sub);
});

fs.writeFileSync('index.html', html);
console.log('HTML updated.');

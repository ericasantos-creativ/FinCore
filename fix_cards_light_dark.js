const fs = require('fs');
let js = fs.readFileSync('assets/js/model-app.js', 'utf8');

// I need to add dark:bg-slate-900 bg-white dark:text-slate-100 text-slate-800 to make it adapt to light and dark theme!
js = js.replace(/class=\"empresa-card bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-slate-100 rounded-xl border border-outline-variant\/30 hover:shadow-lg transition-shadow\"/g, 'class=\"empresa-card bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 hover:shadow-xl transition-shadow\"');

js = js.replace(/class=\"supplier-card bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-slate-100 rounded-xl border border-outline-variant\/30 hover:shadow-lg transition-shadow\"/g, 'class=\"supplier-card bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 hover:shadow-xl transition-shadow\"');

js = js.replace(/class=\"investment-card bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-slate-100 rounded-xl border border-outline-variant\/30 hover:shadow-lg transition-shadow\"/g, 'class=\"investment-card bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 hover:shadow-xl transition-shadow\"');

js = js.replace(/class=\"goal-card bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-slate-100 rounded-xl border border-outline-variant\/30 hover:shadow-lg transition-shadow\"/g, 'class=\"goal-card bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 hover:shadow-xl transition-shadow\"');

fs.writeFileSync('assets/js/model-app.js', js, 'utf8');

console.log('Fixed Tailwind dark mode properly.');
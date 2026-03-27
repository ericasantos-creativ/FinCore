const fs = require('fs');
let js = fs.readFileSync('assets/js/model-app.js', 'utf8');

// Using standard Tailwind bg-slate-900 instead of bg-surface because g-surface was overwritten or is a custom class that only exists inline for some modules!
js = js.replace(/class=\"empresa-card bg-surface shadow-md p-6/g, 'class=\"empresa-card bg-slate-900 shadow-md p-6');
js = js.replace(/class=\"supplier-card bg-surface shadow-md p-6/g, 'class=\"supplier-card bg-slate-900 shadow-md p-6');
js = js.replace(/class=\"investment-card bg-surface shadow-md p-6/g, 'class=\"investment-card bg-slate-900 shadow-md p-6');
js = js.replace(/class=\"goal-card bg-surface shadow-md p-6/g, 'class=\"goal-card bg-slate-900 shadow-md p-6');

// We also should add the text color specifically since custom property cascades got killed by Tailwind
js = js.replace(/class=\"empresa-card bg-slate-900 shadow-md p-6/g, 'class=\"empresa-card bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-slate-100');
js = js.replace(/class=\"supplier-card bg-slate-900 shadow-md p-6/g, 'class=\"supplier-card bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-slate-100');
js = js.replace(/class=\"investment-card bg-slate-900 shadow-md p-6/g, 'class=\"investment-card bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-slate-100');
js = js.replace(/class=\"goal-card bg-slate-900 shadow-md p-6/g, 'class=\"goal-card bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-slate-100');

fs.writeFileSync('assets/js/model-app.js', js, 'utf8');
console.log('Fixed Tailwind explicit background to slate-900 for darkmode panels!');
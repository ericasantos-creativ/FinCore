const fs = require('fs');
let js = fs.readFileSync('assets/js/model-app.js', 'utf8');

// The original CSS was background: var(--panel); which got replaced by var(--color-bg-secondary, #FFFFFF); but maybe it's being overriden by Tailwind. Let's add tailwind bg classes physically into the generated template string just to be bulletproof.

js = js.replace('class=\"empresa-card\"', 'class=\"empresa-card bg-surface shadow-md p-6 rounded-xl border border-outline-variant/30 hover:shadow-lg transition-shadow\"');
js = js.replace('class=\"supplier-card\"', 'class=\"supplier-card bg-surface shadow-md p-6 rounded-xl border border-outline-variant/30 hover:shadow-lg transition-shadow\"');
js = js.replace('class=\"investment-card\"', 'class=\"investment-card bg-surface shadow-md p-6 rounded-xl border border-outline-variant/30 hover:shadow-lg transition-shadow\"');
js = js.replace('class=\"goal-card\"', 'class=\"goal-card bg-surface shadow-md p-6 rounded-xl border border-outline-variant/30 hover:shadow-lg transition-shadow\"');

fs.writeFileSync('assets/js/model-app.js', js, 'utf8');
console.log('Fixed classes with Tailwind utility styles.');
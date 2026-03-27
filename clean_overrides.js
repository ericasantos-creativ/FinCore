const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

// Relax the extreme specificity we added in the previous turn
css = css.replace(/input, select, textarea \{[\s\S]*?\border: 1px solid var\(--color-border\) !important;\r?\n\}/, '/* Adjusted for login */');

fs.writeFileSync('assets/css/style.css', css, 'utf8');
console.log('Fixed css overrides on logins');
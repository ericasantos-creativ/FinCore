const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

// Replace old missing text vars
css = css.replace(/color: var\(--text\);/g, 'color: var(--color-text-primary, #333);');
css = css.replace(/color: var\(--dark\);/g, 'color: var(--color-text-primary, #333);');
css = css.replace(/color: var\(--primary\);/g, 'color: var(--color-accent-primary, #1A6BFF);');

fs.writeFileSync('assets/css/style.css', css, 'utf8');
console.log('Fixed text colors.');
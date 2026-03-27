const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

// Replace --panel var usage in cards with an opaque color or var(--color-bg-secondary)
css = css.replace(/background: var\(--panel\);/g, 'background: var(--color-bg-secondary, #FFFFFF);');

fs.writeFileSync('assets/css/style.css', css, 'utf8');
console.log('Fixed cards background.');
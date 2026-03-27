const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

// Replace --panel-alt var usage
css = css.replace(/background: var\(--panel-alt\);/g, 'background: var(--color-bg-tertiary, #F3F4F6);');

fs.writeFileSync('assets/css/style.css', css, 'utf8');
console.log('Fixed panel-alt background.');
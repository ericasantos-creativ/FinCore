const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

css = css.replace(/background: var\(--color-bg-secondary, #FFFFFF\);/g, '/* background replaced by tailwind */');

fs.writeFileSync('assets/css/style.css', css, 'utf8');
console.log('Removed overlapping generic CSS styles.');
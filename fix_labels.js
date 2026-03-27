const fs = require('fs');
let file = fs.readFileSync('assets/css/style.css', 'utf8');

file = file.replace(/color: var\(--color-text-primary[^;]*;/g, '/* Removed explicit dark text color */');
file = file.replace(/color: var\(--color-text-secondary[^;]*;/g, '/* Removed explicit secondary dark text color */');
file = file.replace(/color: #333;/g, '/* Removed hardcoded #333 */');

fs.writeFileSync('assets/css/style.css', file, 'utf8');
const fs = require('fs');
let file = fs.readFileSync('assets/js/model-app.js', 'utf8');

file = file.replace(/const TRANSLATIONS = \{\r?\n\s*\$1/, "const TRANSLATIONS = {\n    'pt-BR': {\n");
file = file.replace(/\},\r?\n\s*\$1\s*\r?\n\s*'instPrecision'/g, "    },\n    'en-US': {\n        'instPrecision'");

fs.writeFileSync('assets/js/model-app.js', file, 'utf8');
console.log('Fixed syntax error created by regex!');
const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/Módulos Extras \(Design Estático\)/g, '<span data-i18n=\"extraModules\">Módulos Extras (Design Estático)</span>');
html = html.replace(/Módulos Extras \(Tabela de Transações - Design Estático\)/g, '<span data-i18n=\"extraModulesTable\">Módulos Extras (Tabela de Transações - Design Estático)</span>');
html = html.replace(/Módulos Extras \(Design Estático - Lista\)/g, '<span data-i18n=\"extraModulesList\">Módulos Extras (Design Estático - Lista)</span>');
html = html.replace(/>Design do Relatório \(Stitch Layout Mockup\)</g, ' data-i18n=\"mockupReport\">Design do Relatório (Stitch Layout Mockup)<');

fs.writeFileSync('index.html', html);

let js = fs.readFileSync('assets/js/model-app.js', 'utf8');

const ptExt2 = "\n" +
"        'extraModules': 'Módulos Extras (Design Estático)',\n" +
"        'extraModulesTable': 'Módulos Extras (Tabela de Transações - Design Estático)',\n" +
"        'extraModulesList': 'Módulos Extras (Design Estático - Lista)',\n" +
"        'mockupReport': 'Design do Relatório (Stitch Layout Mockup)',\n";

const enExt2 = "\n" +
"        'extraModules': 'Extra Modules (Static Design)',\n" +
"        'extraModulesTable': 'Extra Modules (Transactions Table - Static Design)',\n" +
"        'extraModulesList': 'Extra Modules (Static Design - List)',\n" +
"        'mockupReport': 'Report Design (Stitch Layout Mockup)',\n";

js = js.replace(/('pt-BR':\s*\{)/, "$1" + ptExt2);
js = js.replace(/('en':\s*\{)/, "$1" + enExt2);

fs.writeFileSync('assets/js/model-app.js', js);
console.log('done titles.');
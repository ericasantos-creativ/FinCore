const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/M\u00f3dulos Extras \(Design Est\u00e1tico\)/g, '<span data-i18n="extraModules">M\u00f3dulos Extras (Design Est\u00e1tico)</span>');
html = html.replace(/M\u00f3dulos Extras \(Tabela de Transa\u00e7\u00f5es - Design Est\u00e1tico\)/g, '<span data-i18n="extraModulesTable">M\u00f3dulos Extras (Tabela de Transa\u00e7\u00f5es - Design Est\u00e1tico)</span>');
html = html.replace(/M\u00f3dulos Extras \(Design Est\u00e1tico - Lista\)/g, '<span data-i18n="extraModulesList">M\u00f3dulos Extras (Design Est\u00e1tico - Lista)</span>');
html = html.replace(/>Design do Relat\u00f3rio \(Stitch Layout Mockup\)</g, ' data-i18n="mockupReport">Design do Relat\u00f3rio (Stitch Layout Mockup)<');

// Replace class section
if (!html.includes('id="dashboard-section" class="content-section')) {
    html = html.replace('id="dashboard-section" class="', 'id="dashboard-section" class="content-section ');
}

fs.writeFileSync('index.html', html);

let js = fs.readFileSync('assets/js/model-app.js', 'utf8');

const ptExt2 = "\n" +
"        'extraModules': 'M\u00f3dulos Extras (Design Est\u00e1tico)',\n" +
"        'extraModulesTable': 'M\u00f3dulos Extras (Tabela de Transa\u00e7\u00f5es - Design Est\u00e1tico)',\n" +
"        'extraModulesList': 'M\u00f3dulos Extras (Design Est\u00e1tico - Lista)',\n" +
"        'mockupReport': 'Design do Relat\u00f3rio (Stitch Layout Mockup)',\n";

const enExt2 = "\n" +
"        'extraModules': 'Extra Modules (Static Design)',\n" +
"        'extraModulesTable': 'Extra Modules (Transactions Table - Static Design)',\n" +
"        'extraModulesList': 'Extra Modules (Static Design - List)',\n" +
"        'mockupReport': 'Report Design (Stitch Layout Mockup)',\n";

js = js.replace(/('pt-BR':\s*\{)/, "$$1" + ptExt2);
js = js.replace(/('en':\s*\{)/, "$$1" + enExt2);

fs.writeFileSync('assets/js/model-app.js', js);
console.log('done fixing ALL');
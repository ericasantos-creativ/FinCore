const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Hide the first modulos extras block
html = html.replace('<div class=\"mt-8 border-t border-slate-800 pt-8\"><h2 class=\"text-xl text-slate-300 mb-4\"><span data-i18n=\"extraModules\">M', '<div class=\"mt-8 border-t border-slate-800 pt-8 hidden\" style=\"display:none;\"><h2 class=\"text-xl text-slate-300 mb-4\"><span data-i18n=\"extraModules\">M');

// Hide the second modulos extras block
html = html.replace('<div class=\"mt-12 border-t border-slate-800 pt-8 mt-12 opacity-50 pointer-events-none\"><h2 class=\"text-xl text-slate-300 mb-4\"><span data-i18n=\"extraModulesTable\">', '<div class=\"mt-12 border-t border-slate-800 pt-8 mt-12 opacity-50 pointer-events-none hidden\" style=\"display:none;\"><h2 class=\"text-xl text-slate-300 mb-4\"><span data-i18n=\"extraModulesTable\">');

// Hide the third modulos extras block
html = html.replace('<div class=\"mt-8 border-t border-slate-800 pt-8 mt-12\"><h2 class=\"text-xl text-slate-300 mb-4 opacity-50\"><span data-i18n=\"extraModulesList\">', '<div class=\"mt-8 border-t border-slate-800 pt-8 mt-12 hidden\" style=\"display:none;\"><h2 class=\"text-xl text-slate-300 mb-4 opacity-50\"><span data-i18n=\"extraModulesList\">');

// Hide report mockup
html = html.replace('<div class=\"mt-12 border-t border-slate-800 pt-8 mt-12 opacity-50 relative pointer-events-none\"><h2 class=\"text-xl text-slate-300 mb-4\" data-i18n=\"mockupReport\"', '<div class=\"mt-12 border-t border-slate-800 pt-8 mt-12 opacity-50 relative pointer-events-none hidden\" style=\"display:none;\"><h2 class=\"text-xl text-slate-300 mb-4\" data-i18n=\"mockupReport\"');


fs.writeFileSync('index.html', html, 'utf8');
console.log('Mockups hidden.');
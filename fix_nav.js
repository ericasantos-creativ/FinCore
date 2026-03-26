const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const map = {
  'dashboard': 'dashboard', 'empresas': 'companies', 'transacoes': 'transactions', 'relatorios': 'reports',
  'contas': 'payable', 'metas': 'goals', 'investimentos': 'investments', 'fornecedores': 'suppliers',
  'calendario': 'calendar', 'perfil': 'profile'
};
for (let section in map) {
  let key = map[section];
  let regex = new RegExp('<a[^>]*data-section=\"' + section + '\"[^>]*>[\\\\s\\\\S]*?<span>(.*?)<\\\\/span>', 'g');
  html = html.replace(regex, match => match.replace(/<span>(.*?)<\\/span>/, '<span data-i18n=\"' + key + '\"></span>'));
}
fs.writeFileSync('index.html', html);

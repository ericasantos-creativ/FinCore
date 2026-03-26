const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('<section id="dashboard-section" class="screen ', '<section id="dashboard-section" class="content-section screen ');
fs.writeFileSync('index.html', html);

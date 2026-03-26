const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove that weird empty trailing main tag and the closing div that breaks the flex grid
html = html.replace('</aside><main class="flex-1 md:ml-64 p-8 min-h-[calc(100vh-4rem)] relative w-full overflow-y-auto main-wrapper"></main></div>', '</aside>');

// 2. Add the proper tailwind layout classes to the real main element
html = html.replace('<main class="main-content">', '<main class="main-content flex-1 md:ml-64 p-4 md:p-8 min-h-[calc(100vh-4rem)] relative w-full overflow-y-auto flex flex-col">');

// 3. Ensure all root sections inside main have max-w e mx-auto for centering
const sections = [
    'dashboard-section',
    'transacoes-section',
    'empresas-section',
    'relatorios-section',
    'contas-section',
    'metas-section',
    'investimentos-section',
    'fornecedores-section',
    'calendario-section',
    'perfil-section'
];

sections.forEach(secId => {
    let regex = new RegExp('<section id=\"' + secId + '\" class=\"(.*?)\"', 'g');
    html = html.replace(regex, (match, classes) => {
        let newClasses = classes;
        if (!newClasses.includes('max-w-7xl')) newClasses += ' max-w-7xl';
        if (!newClasses.includes('mx-auto')) newClasses += ' mx-auto';
        if (!newClasses.includes('w-full')) newClasses += ' w-full';
        return '<section id=\"' + secId + '\" class=\"' + newClasses + '\"';
    });
});

// 4. Also fix sections without class attribute (if any) or where the attribute wasn't caught
sections.forEach(secId => {
    html = html.replace(new RegExp('<section id=\"' + secId + '\"(?! class)', 'g'), '<section id=\"' + secId + '\" class=\"w-full max-w-7xl mx-auto\"');
});

// 5. Close the flex div properly at the bottom of mainScreen (before it closes mainScreen)
html = html.replace('</main>\n      </section>', '</main>\n          </div>\n      </section>');

fs.writeFileSync('index.html', html);
console.log('Done');

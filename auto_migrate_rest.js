const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const originalHtml = fs.readFileSync('index.html', 'utf8');
const transacHtml = fs.readFileSync('stitch_screens/FinCore_Transactions.html', 'utf8');

const docOrg = new JSDOM(originalHtml).window.document;
const docTr = new JSDOM(transacHtml).window.document;

const transacSection = docOrg.querySelector('#transacoes-section');
const trMain = docTr.querySelector('main');

if (transacSection && trMain) {
    const origContentDiv = docOrg.createElement('div');
    origContentDiv.className = 'w-full space-y-6';
    
    // Store original forms so JS doesn't break
    Array.from(transacSection.children).forEach(c => {
        if(c.tagName !== 'SCRIPT') {
            // style old form a bit
            if (c.tagName === 'FORM') c.className += ' bg-surface-container rounded-xl p-4 border border-outline-variant/20';
            origContentDiv.appendChild(c);
        }
    });

    transacSection.innerHTML = '';
    transacSection.className = 'content-section px-4 pb-8 w-full hidden';
    
    // add stitch header
    const stitchHeader = trMain.querySelector('.flex.items-center.justify-between.mb-8');
    if (stitchHeader) {
        transacSection.appendChild(stitchHeader.cloneNode(true));
    }
    
    // The visual table in the stitch screen is static, we'll put it at the bottom
    const remainingContentDiv = docOrg.createElement('div');
    remainingContentDiv.className = 'mt-12 border-t border-slate-800 pt-8 mt-12 opacity-50 pointer-events-none';
    remainingContentDiv.innerHTML = '<h2 class="text-xl text-slate-300 mb-4">Módulos Extras (Tabela de Transações - Design Estático)</h2>';

    Array.from(trMain.children).forEach(child => {
        if (child.classList.contains('justify-between') && child.classList.contains('mb-8')) return; // header already added
        remainingContentDiv.appendChild(child.cloneNode(true));
    });

    transacSection.appendChild(origContentDiv);
    transacSection.appendChild(remainingContentDiv);

    const finalHtml = '<!DOCTYPE html>\n' + docOrg.documentElement.outerHTML;
    fs.writeFileSync('index.html', finalHtml, 'utf8');
    console.log('=> Seção Transações adaptada com sucesso!');
}

// Relatorios
const relatoriosSection = docOrg.querySelector('#relatorios-section');
const relHtml = fs.readFileSync('stitch_screens/FinCore_Reports.html', 'utf8');
const docRel = new JSDOM(relHtml).window.document;
const relMain = docRel.querySelector('main');

if (relatoriosSection && relMain) {
    const origContentDiv = docOrg.createElement('div');
    origContentDiv.className = 'w-full space-y-6 z-10 relative';
    
    Array.from(relatoriosSection.children).forEach(c => {
        origContentDiv.appendChild(c);
    });

    relatoriosSection.innerHTML = '';
    relatoriosSection.className = 'content-section px-4 pb-8 w-full hidden';
    
    const stitchHeader = relMain.querySelector('.flex.items-center.justify-between.mb-8');
    if (stitchHeader) {
        relatoriosSection.appendChild(stitchHeader.cloneNode(true));
    }
    
    // Keep raw static design
    const remainingContentDiv = docOrg.createElement('div');
    remainingContentDiv.className = 'mt-12 border-t border-slate-800 pt-8 mt-12 opacity-50 relative pointer-events-none';
    remainingContentDiv.innerHTML = '<h2 class="text-xl text-slate-300 mb-4">Design do Relatório (Stitch Layout Mockup)</h2>';

    Array.from(relMain.children).forEach(child => {
        if (child.classList.contains('justify-between') && child.classList.contains('mb-8')) return; 
        remainingContentDiv.appendChild(child.cloneNode(true));
    });

    relatoriosSection.appendChild(origContentDiv);
    relatoriosSection.appendChild(remainingContentDiv);

    const finalHtml = '<!DOCTYPE html>\n' + docOrg.documentElement.outerHTML;
    fs.writeFileSync('index.html', finalHtml, 'utf8');
    console.log('=> Seção Relatórios adaptada com sucesso!');
}

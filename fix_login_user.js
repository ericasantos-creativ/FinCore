const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const docOrg = new JSDOM(html).window.document;

const emailInput = docOrg.getElementById('loginEmail');
if (emailInput) {
    const parentDiv = emailInput.closest('.space-y-2');
    if (parentDiv) {
        parentDiv.id = 'loginEmailGroup';
    }
    
    const form = docOrg.getElementById('loginForm');
    
    // Hint wrapper para caso já exista usuário logado (mostra mensagem)
    if (!docOrg.getElementById('loginEmailHint')) {
        const hintDiv = docOrg.createElement('div');
        hintDiv.id = 'loginEmailHint';
        hintDiv.style.display = 'none';
        hintDiv.className = 'w-full bg-surface-container-lowest border border-outline-variant/30 rounded p-4 flex items-center justify-between';
        hintDiv.innerHTML = `
            <div>
                <p class="font-label text-[10px] uppercase tracking-widest text-slate-400 mb-1">Conta salva</p>
                <p class="text-on-surface font-medium text-sm flex items-center gap-2">
                   <span class="material-symbols-outlined text-primary text-sm" style="font-variation-settings: 'FILL' 1;">account_circle</span>
                   Conta atual
                </p>
            </div>
            <button type="button" onclick="document.getElementById('loginEmailGroup').style.display='block'; this.parentNode.style.display='none'; document.getElementById('loginEmail').value='';" class="text-[10px] font-label uppercase tracking-widest text-primary hover:text-primary-container transition-colors">Trocar</button>
        `;
        
        if (parentDiv && form) {
            form.insertBefore(hintDiv, parentDiv);
        }
    }
    
    const finalHtml = '<!DOCTYPE html>\n' + docOrg.documentElement.outerHTML;
    fs.writeFileSync('index.html', finalHtml, 'utf8');
    console.log('ID loginEmailGroup adicionado e loginEmailHint injetado com sucesso!');
} else {
    console.log('Não encontrou loginEmail');
}
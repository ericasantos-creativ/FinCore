const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const originalHtml = fs.readFileSync('index.html', 'utf8');
const cmpHtml = fs.readFileSync('stitch_screens/FinCore_Companies_Management.html', 'utf8');

const docOrg = new JSDOM(originalHtml).window.document;
const docCmp = new JSDOM(cmpHtml).window.document;

// Locate Empresas section
const empresasSection = docOrg.querySelector('#empresas-section');
const cmpMain = docCmp.querySelector('main');

if (empresasSection && cmpMain) {
   empresasSection.innerHTML = '';
   empresasSection.className = 'content-section px-4 pb-8 w-full hidden';
   
   // A seção header do stitch
   const cmpHeader = cmpMain.querySelector('.flex.items-center.justify-between.mb-8');
   
   if (cmpHeader) {
       // Search for the "Add Company" button. In the Stitch UI it's probably the primary blue button
       const blueBtn = cmpHeader.querySelector('.bg-blue-600, .bg-blue-500'); // the + Add New button
       if (blueBtn) {
           blueBtn.id = 'addEmpresaBtn';
       } else {
           // fallback to just any strong text button
           const btns = cmpHeader.querySelectorAll('button');
           if(btns.length > 0) btns[btns.length - 1].id = 'addEmpresaBtn';
       }
       empresasSection.appendChild(cmpHeader.cloneNode(true));
   }
   
   const jsContainerDiv = docOrg.createElement('div');
   jsContainerDiv.id = 'empresasList';
   // tailwind based list matching what model-app.js will inject into it
   jsContainerDiv.className = 'w-full mb-8 space-y-4 grid-container';
   empresasSection.appendChild(jsContainerDiv);

   const remainingContentDiv = docOrg.createElement('div');
   remainingContentDiv.className = 'mt-8 border-t border-slate-800 pt-8 mt-12';
   remainingContentDiv.innerHTML = '<h2 class="text-xl text-slate-300 mb-4 opacity-50">Módulos Extras (Design Estático - Lista)</h2><div class="opacity-50 pointer-events-none">';

   const wrapper = docOrg.createElement('div');
   const allChildren = Array.from(cmpMain.children);
   allChildren.forEach(child => {
      // skip header
      if (child.classList.contains('justify-between') && child.classList.contains('mb-8')) return;
      wrapper.appendChild(child.cloneNode(true));
   });
   
   remainingContentDiv.appendChild(wrapper);
   remainingContentDiv.innerHTML += '</div>';
   
   empresasSection.appendChild(remainingContentDiv);

   const finalHtml = '<!DOCTYPE html>\n' + docOrg.documentElement.outerHTML;
   fs.writeFileSync('index.html', finalHtml, 'utf8');
   console.log('=> Seção Empresas migrada com sucesso!');
} else {
   console.log('Erro ao achar seção de Empresas.');
}

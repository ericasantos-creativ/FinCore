const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const originalHtml = fs.readFileSync('index.html', 'utf8');
const stitchHtml = fs.readFileSync('stitch_screens/FinCore_Dashboard.html', 'utf8');

const docOrg = new JSDOM(originalHtml).window.document;
const docStitch = new JSDOM(stitchHtml).window.document;

// 1. ADD STYLES
const stitchStyles = docStitch.querySelectorAll('style');
stitchStyles.forEach(style => {
    docOrg.head.appendChild(style.cloneNode(true));
});

// 2. BODY CLASSES (Tailwind)
const bodyClasses = Array.from(docStitch.body.classList);
bodyClasses.forEach(c => docOrg.body.classList.add(c));

// 3. TOP NAVBAR
const originalHeader = docOrg.querySelector('header.header');
const stitchHeader = docStitch.querySelector('header.fixed');

if(originalHeader && stitchHeader) {
  const accPanel = docOrg.querySelector('.accessibility-panel');
  const userInfo = docOrg.querySelector('.user-info');
  
  if (accPanel) accPanel.className = 'flex items-center gap-2 mr-4';
  if (userInfo) userInfo.className = 'flex items-center gap-2';
  
  const originalButtons = docOrg.querySelectorAll('.accessibility-panel button, .user-info button');
  originalButtons.forEach(btn => {
      // Manter os ids importantes nativos e adicionar Tailwind attrs
      const keepIds = btn.id;
      btn.className = 'p-2 text-slate-400 hover:bg-slate-900 hover:text-blue-400 transition-colors rounded-full flex items-center justify-center ' + Object.values(btn.classList).join(' ');
      if (keepIds) btn.id = keepIds;
  });

  const rightSideStitch = stitchHeader.querySelector('.flex.items-center.gap-4');
  if (rightSideStitch && accPanel && userInfo) {
      rightSideStitch.innerHTML = ''; 
      rightSideStitch.appendChild(accPanel);
      rightSideStitch.appendChild(userInfo);
  }
  
  originalHeader.replaceWith(stitchHeader.cloneNode(true));
  console.log('--- Top Navbar migrada com sucesso!');
}

// 4. SIDEBAR
const originalNav = docOrg.querySelector('nav.nav-menu');
const stitchSidebar = docStitch.querySelector('aside.fixed');

if (originalNav && stitchSidebar) {
  const originalLinks = Array.from(originalNav.querySelectorAll('a.nav-link'));
  const stitchNavContainer = stitchSidebar.querySelector('nav');
  const stitchLinkTemplate = stitchNavContainer.querySelector('a').cloneNode(true);
  
  stitchNavContainer.innerHTML = ''; 
  
  originalLinks.forEach(origLink => {
      const newLink = stitchLinkTemplate.cloneNode(true);
      const iconSpan = newLink.querySelector('.material-symbols-outlined');
      
      const newTextSpans = newLink.querySelectorAll('span');
      const textSpan = newTextSpans.length > 1 ? newTextSpans[1] : null;
      
      const origTextElement = origLink.querySelector('.nav-text');
      const origText = origTextElement ? origTextElement.textContent : origLink.textContent.trim();
      const section = origLink.getAttribute('data-section') || 'dashboard';
      
      if(textSpan) textSpan.textContent = origText;
      newLink.setAttribute('data-section', section);
      
      const isActive = origLink.classList.contains('active');
      newLink.className = isActive ? 
         'nav-link active flex items-center gap-3 px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 ease-in-out text-blue-500 border-r-2 border-blue-500 bg-blue-500/5' : 
         'nav-link flex items-center gap-3 px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 ease-in-out text-slate-500 hover:bg-slate-900 hover:text-slate-200';
      
      const iconMap = {
          'dashboard': 'dashboard',     'empresas': 'store',
          'transacoes': 'receipt_long', 'relatorios': 'insights',
          'contas': 'account_balance',  'metas': 'track_changes',
          'investimentos': 'trending_up','fornecedores': 'local_shipping',
          'calendario': 'calendar_month','perfil': 'person'
      };
      if(iconSpan) {
          iconSpan.textContent = iconMap[section] || 'circle';
          if (!isActive) iconSpan.removeAttribute('style'); // remover o fill do stitch para inativos
      }
      
      // Preserve onclick or other attrs if any
      if (origLink.getAttribute('data-i18n') && textSpan) {
          textSpan.setAttribute('data-i18n', origLink.getAttribute('data-i18n'));
      }
      
      stitchNavContainer.appendChild(newLink);
  });
  
  const flexWrapper = docOrg.createElement('div');
  flexWrapper.className = 'flex pt-16 w-full min-h-screen';
  
  const mainContent = docOrg.createElement('main');
  mainContent.className = 'flex-1 md:ml-64 p-8 min-h-[calc(100vh-4rem)] relative w-full overflow-y-auto main-wrapper';
  
  const oldMainContainer = docOrg.querySelector('.main-container');
  if (oldMainContainer) {
      oldMainContainer.className = 'w-full'; 
      mainContent.appendChild(oldMainContainer.cloneNode(true));
  }
  
  flexWrapper.appendChild(stitchSidebar.cloneNode(true));
  flexWrapper.appendChild(mainContent);
  
  // Find the parent to replace the old navigation structure properly
  originalNav.replaceWith(flexWrapper);
  
  // also, originalMainContainer is now inside the new flexWrapper. Let's remove the stale one left behind.
  if (oldMainContainer && oldMainContainer.parentNode && oldMainContainer.parentNode !== mainContent) {
      oldMainContainer.remove();
  }
  
  console.log('--- Side Navbar e Container migrados com sucesso!');
}

const finalHtml = '<!DOCTYPE html>\n' + docOrg.documentElement.outerHTML;
fs.writeFileSync('index.html', finalHtml, 'utf8');
console.log('=> Estrutura base (Etapa 1) aplicada!');

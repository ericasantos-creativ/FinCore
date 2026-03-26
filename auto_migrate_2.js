const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const originalHtml = fs.readFileSync('index.html', 'utf8');
const stitchHtml = fs.readFileSync('stitch_screens/FinCore_Dashboard.html', 'utf8');

const docOrg = new JSDOM(originalHtml).window.document;
const docStitch = new JSDOM(stitchHtml).window.document;

// Get sections
const dashboardSection = docOrg.querySelector('#dashboard-section');
const stitchMain = docStitch.querySelector('main');

if (dashboardSection && stitchMain) {
   // Stitch main content logic
   // Stitch's top row cards
   const stitchCardsContainers = stitchMain.querySelectorAll('.glass-card.p-6'); // that are in the 3 grid
   
   // Create overallDashboard layout container matching Stitch structure 
   const stitchHeader = stitchMain.querySelector('header.mb-8').cloneNode(true);
   const stitchGridRow = stitchMain.querySelector('.grid.grid-cols-1.md\\:grid-cols-3').cloneNode(true);
   
   // Atribui os IDs necessarios para funcionar com o JS original
   stitchGridRow.id = 'overallDashboard';
   
   const newCards = stitchGridRow.querySelectorAll('.glass-card');
   if(newCards.length >= 3) {
      // 1st card -> Balance
      const bTitle = newCards[0].querySelector('h3');
      if(bTitle) bTitle.id = 'totalBalance';
      
      // 2nd card -> Income
      const iTitle = newCards[1].querySelector('h3');
      if(iTitle) iTitle.id = 'totalIncome';
      
      // 3rd card -> Expenses
      const eTitle = newCards[2].querySelector('h3');
      if(eTitle) eTitle.id = 'totalExpense';
   }
   
   // Company dashboards container
   const companyDashboardsDiv = docOrg.createElement('div');
   companyDashboardsDiv.id = 'companyDashboards';
   companyDashboardsDiv.className = 'mt-8 w-full';
   
   // We will replace the interior of dashboardSection
   // Since the dashboardSection is the logical screen wrapper, its class was "screen"
   dashboardSection.innerHTML = '';
   dashboardSection.className = 'screen px-4 pb-8 w-full'; // tailwind spacing
   
   dashboardSection.appendChild(stitchHeader);
   dashboardSection.appendChild(stitchGridRow);
   dashboardSection.appendChild(companyDashboardsDiv);
   
   // To keep visual fidelity, copy the rest of the dashboard UI inside a static placeholder (which user might want to hook up later)
   // Remove the copied nodes from a clone of main to just append the remaining components like Charts etc., below company dashboards
   const remainingContentDiv = docOrg.createElement('div');
   remainingContentDiv.className = 'mt-8 border-t border-slate-800 pt-8';
   remainingContentDiv.innerHTML = '<h2 class="text-xl text-slate-300 mb-4">Módulos Extras (Design Estático)</h2>';
   
   // The remaining parts in stitch main:
   const allStitchChildren = Array.from(stitchMain.children);
   allStitchChildren.forEach(child => {
      // skip header and the grid we grabbed
      if (child.tagName === 'HEADER' || child.classList.contains('md:grid-cols-3')) {
          // Check if it's strictly the top row we grabbed
          if(child.classList.contains('mb-8') && child.querySelectorAll('.glass-card.p-6').length === 3) {
              return;
          }
      }
      remainingContentDiv.appendChild(child.cloneNode(true));
   });
   
   // Let's just append the remaining design to the bottom so user can see it
   dashboardSection.appendChild(remainingContentDiv);

   const finalHtml = '<!DOCTYPE html>\n' + docOrg.documentElement.outerHTML;
   fs.writeFileSync('index.html', finalHtml, 'utf8');
   console.log('=> Dashboard estático migrado com sucesso!');
} else {
    console.log('Erro ao localizar estruturas de dashboard.');
}

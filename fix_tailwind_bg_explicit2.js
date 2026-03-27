const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

// We have multiple duplicate 'background: var(--panel)' remaining because 'var(--color-bg-secondary, #FFFFFF)' was overriden by something like 'background: transparent;'.
// Let's strip out the CSS classes from style.css completely for the generic cards and force Tailwind!
css = css.replace('.empresa-card,', '/* .empresa-card removed */');
css = css.replace('.supplier-card,', '/* .supplier-card removed */');
css = css.replace('.goal-card,', '/* .goal-card removed */');
css = css.replace('.investment-card {', '/* .investment-card removed */');

fs.writeFileSync('assets/css/style.css', css, 'utf8');
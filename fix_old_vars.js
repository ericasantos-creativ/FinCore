const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

const replacements = {
    '--text-light': '--color-text-secondary',
    '--text': '--color-text-primary',
    '--dark': '--color-text-primary',
    '--primary': '--color-accent-primary',
    '--success': '--color-success',
    '--danger': '--color-danger',
    '--warning': '--color-warning',
    '--info': '--color-accent-secondary',
    '--light': '--color-bg-secondary',
    '--bg': '--color-bg-primary',
    '--panel': '--color-bg-secondary',
    '--panel-alt': '--color-bg-tertiary',
    '--border': '--color-border'
};

for (const [oldVar, newVar] of Object.entries(replacements)) {
    const regex = new RegExp(`var\\(\\s*${oldVar}\\s*(?:,[^)]+)?\\)`, 'g');
    css = css.replace(regex, `var(${newVar})`);
}

css = css.replace(/color:\s*#333\s*;/g, 'color: var(--color-text-primary);');
css = css.replace(/color:\s*#666\s*;/g, 'color: var(--color-text-secondary);');
css = css.replace(/color:\s*#777\s*;/g, 'color: var(--color-text-secondary);');
css = css.replace(/color:\s*#555\s*;/g, 'color: var(--color-text-secondary);');
css = css.replace(/color:\s*#888\s*;/g, 'color: var(--color-text-muted);');

fs.writeFileSync('assets/css/style.css', css, 'utf8');
console.log('Fixed old variables in style.css');
const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

css = css.replace(/\/\* Login Page Specific Overrides[\s\S]*?z-index:\s*10;\r?\n\}/g, '');
css = css.replace(/\/\* Global Input Fix - EXCLUDING[\s\S]*?font-size:\s*14px;\r?\n\}/g, '');
css = css.replace(/\/\* Global Input Fix for Dark Mode \/ Transparency \*\/[\s\S]*?color: var\(--color-text-primary\) !important;\r?\n\}/g, '');

const safeRules = `
/* Scoped Fixes for Dashboard Inputs (Fix Transparency) */
.form-group input, .form-group select, .form-group textarea,
.filter-group input, .filter-group select,
.modal-content input, .modal-content select, .modal-content textarea {
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
}

.form-group label, .filter-group label {
    color: var(--color-text-primary);
}

.form-group input::placeholder, .form-group textarea::placeholder,
.filter-group input::placeholder, .modal-content input::placeholder {
    color: var(--color-text-muted);
    opacity: 1;
}
`;

fs.writeFileSync('assets/css/style.css', css + '\n' + safeRules, 'utf8');
console.log('Cleaned up CSS, added safe scoped rules.');
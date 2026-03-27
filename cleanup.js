const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

// REMOVE the .login-screen input forced "background-color: transparent !important" and "border: none !important" that removed the box
css = css.replace(/\/\* Fix specifically for Login inputs to revert the full width overriding \*\/\r?\n\.login-screen input,[\s\S]*?opacity: 0\.6 !important;\r?\n\}/g, '');

fs.writeFileSync('assets/css/style.css', css, 'utf8');
console.log('Cleaned up extreme login transparent settings.');
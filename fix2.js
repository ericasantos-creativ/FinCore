const fs = require('fs'); let css = fs.readFileSync('assets/css/style.css', 'utf8'); css = css.replace(/\.nav-link.*?\{[\s\S]*?\}/g, ''); fs.writeFileSync('assets/css/style.css', css);

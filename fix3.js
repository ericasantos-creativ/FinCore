const fs = require('fs'); let css = fs.readFileSync('assets/css/base.css', 'utf8'); css = css.replace(/body\s*\{[\s\S]*?\}/g, ''); fs.writeFileSync('assets/css/base.css', css);

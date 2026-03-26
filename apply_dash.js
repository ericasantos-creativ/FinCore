const fs = require('fs');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const dashHtml = fs.readFileSync('./stitch_screens/FinCore_Dashboard.html', 'utf8');

// Extrair adições do Head do Dashboard (Tailwind css e fontes e scripts de conf)
const headAdditionsReg = /(<script src="https:\/\/cdn\.tailwindcss\.com[\s\S]*?<\/style>)/;
const headMatch = dashHtml.match(headAdditionsReg);
const headAdditions = headMatch ? headMatch[1] : '';

// Extrair Body do Dashboard
const newBodyReg = /(<body[^>]*>[\s\S]*<\/body>)/;
const bodyMatch = dashHtml.match(newBodyReg);
const newBody = bodyMatch ? bodyMatch[1] : '';

if(newBody) {
    const newIndex = indexHtml.replace(/<\/head>/, headAdditions + '\n</head>').replace(/<body[\s\S]*<\/body>/, newBody);
    fs.writeFileSync('index.html', newIndex);
    console.log("Sucesso: Atualizado index.html com o conteudo do Dashboard.");
} else {
    console.error("Falha ao extrair body do Dashboard");
}

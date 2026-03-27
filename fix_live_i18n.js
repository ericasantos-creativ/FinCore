const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('data-i18n=\"liveMarketSynthesis\"')) {
    html = html.replace('>Live Market Synthesis</span>', ' data-i18n=\"liveMarketSynthesis\">Live Market Synthesis</span>');
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Fixed live market case sensitive issue.');
}
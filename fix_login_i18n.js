const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const replaces = [
    ['Institutional <span class=\"text-primary-container\">Precision</span>', '<span data-i18n=\"instPrecision\">Institutional <span class=\"text-primary-container\">Precision</span></span>'],
    ['Institutional Grade Security. Access your sovereign assets with 256-bit encryption.', '<span data-i18n=\"instSecurity\">Institutional Grade Security. Access your sovereign assets with 256-bit encryption.</span>'],
    ['LIVE MARKET SYNTHESIS', '<span data-i18n=\"liveMarketSynthesis\">LIVE MARKET SYNTHESIS</span>'],
    ['REAL-TIME FEED', '<span data-i18n=\"realTimeFeed\">REAL-TIME FEED</span>'],
    ['<p class=\"font-label text-[10px] text-slate-500 uppercase\">Latency</p>', '<p class=\"font-label text-[10px] text-slate-500 uppercase\" data-i18n=\"latency\">Latency</p>'],
    ['<p class=\"font-label text-[10px] text-slate-500 uppercase\">Uptime</p>', '<p class=\"font-label text-[10px] text-slate-500 uppercase\" data-i18n=\"uptime\">Uptime</p>'],
    ['<p class=\"font-label text-[10px] text-slate-500 uppercase\">Status</p>', '<p class=\"font-label text-[10px] text-slate-500 uppercase\" data-i18n=\"status\">Status</p>'],
    ['>OPTIMAL</p>', ' data-i18n=\"optimal\">OPTIMAL</p>'],
    ['>System Entropy</span>', ' data-i18n=\"systemEntropy\">System Entropy</span>'],
    ['>Server Cluster</span>', ' data-i18n=\"serverCluster\">Server Cluster</span>'],
    ['>Terminal Access</h3>', ' data-i18n=\"terminalAccess\">Terminal Access</h3>'],
    ['>Enter your credentials to authorize a secure session.</p>', ' data-i18n=\"enterCredentials\">Enter your credentials to authorize a secure session.</p>'],
    ['>Operator Identity</label>', ' data-i18n=\"operatorIdentity\">Operator Identity</label>'],
    ['>Access Cipher</label>', ' data-i18n=\"accessCipher\">Access Cipher</label>'],
    ['>Forgot Key?</a>', ' data-i18n=\"forgotKey\">Forgot Key?</a>'],
    ['>Remember this terminal</span>', ' data-i18n=\"rememberTerminal\">Remember this terminal</span>'],
    ['>Apply for Access</a>', ' data-i18n=\"applyAccess\">Apply for Access</a>'],
    ['>Security Protocol</a>', ' data-i18n=\"securityProtocol\">Security Protocol</a>'],
    ['>Support</a>', ' data-i18n=\"support\">Support</a>'],
    ['>Institutional Status</a>', ' data-i18n=\"institutionalStatus\">Institutional Status</a>'],
];

replaces.forEach(([find, repl]) => {
    if (find === repl) return;
    if (!html.includes(repl)) {
        html = html.split(find).join(repl);
    }
});

fs.writeFileSync('index.html', html, 'utf8');

// Update JS App translations
let js = fs.readFileSync('assets/js/model-app.js', 'utf8');

const tPT = "\n" +
"        'instPrecision': 'Precis\u00e3o <span class=\"text-primary-container\">Institucional</span>',\n" +
"        'instSecurity': 'Seguran\u00e7a de N\u00edvel Institucional. Acesse seus ativos com criptografia de 256 bits.',\n" +
"        'liveMarketSynthesis': 'S\u00cdNTESE DE MERCADO AO VIVO',\n" +
"        'realTimeFeed': 'FEED EM TEMPO REAL',\n" +
"        'latency': 'LAT\u00caNCIA',\n" +
"        'uptime': 'TEMPO ATIVO',\n" +
"        'status': 'STATUS',\n" +
"        'optimal': 'IDEAL',\n" +
"        'systemEntropy': 'ENTROPIA SISTEMA',\n" +
"        'serverCluster': 'CLUSTER',\n" +
"        'terminalAccess': 'ACESSO AO TERMINAL',\n" +
"        'enterCredentials': 'Insira suas credenciais para autorizar uma sess\u00e3o segura.',\n" +
"        'operatorIdentity': 'Conta salva / Identidade',\n" +
"        'accessCipher': 'Cifra de Acesso (Senha)',\n" +
"        'forgotKey': 'ESQUECEU A CHAVE?',\n" +
"        'rememberTerminal': 'Lembrar deste terminal',\n" +
"        'applyAccess': 'SOLICITAR ACESSO',\n" +
"        'securityProtocol': 'PROTOCOLO DE SEGURAN\u00c7A',\n" +
"        'support': 'SUPORTE',\n" +
"        'institutionalStatus': 'STATUS INSTITUCIONAL',\n";

const tEN = "\n" +
"        'instPrecision': 'Institutional <span class=\"text-primary-container\">Precision</span>',\n" +
"        'instSecurity': 'Institutional Grade Security. Access your sovereign assets with 256-bit encryption.',\n" +
"        'liveMarketSynthesis': 'LIVE MARKET SYNTHESIS',\n" +
"        'realTimeFeed': 'REAL-TIME FEED',\n" +
"        'latency': 'LATENCY',\n" +
"        'uptime': 'UPTIME',\n" +
"        'status': 'STATUS',\n" +
"        'optimal': 'OPTIMAL',\n" +
"        'systemEntropy': 'SYSTEM ENTROPY',\n" +
"        'serverCluster': 'SERVER CLUSTER',\n" +
"        'terminalAccess': 'TERMINAL ACCESS',\n" +
"        'enterCredentials': 'Enter your credentials to authorize a secure session.',\n" +
"        'operatorIdentity': 'Operator Identity',\n" +
"        'accessCipher': 'Access Cipher',\n" +
"        'forgotKey': 'FORGOT KEY?',\n" +
"        'rememberTerminal': 'Remember this terminal',\n" +
"        'applyAccess': 'APPLY FOR ACCESS',\n" +
"        'securityProtocol': 'SECURITY PROTOCOL',\n" +
"        'support': 'SUPPORT',\n" +
"        'institutionalStatus': 'INSTITUTIONAL STATUS',\n";


if (!js.includes('instPrecision')) {
    js = js.replace(/('pt-BR':\s*\{)/, "$$1" + tPT);
    js = js.replace(/('en':\s*\{)/, "$$1" + tEN);
    fs.writeFileSync('assets/js/model-app.js', js, 'utf8');
}

console.log('Login injected.');
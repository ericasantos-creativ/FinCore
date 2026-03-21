import { Auth } from './auth.js';

const DEMO_AUTH = true;
const memoryStorage = new Map();

function storageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return memoryStorage.has(key) ? memoryStorage.get(key) : null;
    }
}

function storageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {
        memoryStorage.set(key, value);
    }
}

function storageRemove(key) {
    try {
        localStorage.removeItem(key);
    } catch {
        memoryStorage.delete(key);
    }
}

function storageKeys() {
    try {
        return Object.keys(localStorage);
    } catch {
        return Array.from(memoryStorage.keys());
    }
}

let currentLanguage = storageGet('language') || 'pt-BR';

const TRANSLATIONS = {
    'pt-BR': {
        // Header
        'audioReaderTitle': 'Ativar leitor de áudio',
        'librasTitle': 'Ativar intérprete de LIBRAS',
        'fontSizeTitle': 'Aumentar fonte',
        'themeToggleTitle': 'Alternar tema',
        'logoutBtn': 'Sair',
        'userName': 'Usuário',

        // Login
        'login': 'Entrar',
        'register': 'Cadastro',
        'dontHaveAccount': 'Não tem conta?',
        'signUp': 'Cadastre-se',
        'haveAccount': 'Já tem conta?',
        'goLogin': 'Faça login',
        'email': 'Email',
        'password': 'Senha',
        'confirmPassword': 'Confirmar Senha',
        'name': 'Nome',
        'yourEmail': 'seu@email.com',
        'yourPassword': 'Sua senha',
        'createPassword': 'Crie uma senha',
        'confirmPwd': 'Confirme a senha',

        // Dashboard
        'dashboard': 'Dashboard',
        'companies': 'Empresas',
        'transactions': 'Transações',
        'payable': 'Contas a Pagar',
        'receivable': 'Contas a Receber',
        'goals': 'Metas',
        'investments': 'Investimentos',
        'suppliers': 'Fornecedores',
        'costs': 'Custos',
        'reports': 'Relatórios',
        'settings': 'Configurações',

        // Accessibility
        'audioReaderActive': 'Desativar leitor de áudio',
        'librasActive': 'Desativar intérprete de LIBRAS',
        'languageChanged': 'Idioma alterado para Português',
        'fontSizeMessage': 'Tamanho da fonte:'
    },
    'en': {
        // Header
        'audioReaderTitle': 'Activate audio reader',
        'librasTitle': 'Activate LIBRAS interpreter',
        'fontSizeTitle': 'Increase font size',
        'themeToggleTitle': 'Toggle theme',
        'logoutBtn': 'Logout',
        'userName': 'User',

        // Login
        'login': 'Sign In',
        'register': 'Create Account',
        'dontHaveAccount': 'Don\'t have an account?',
        'signUp': 'Sign Up',
        'haveAccount': 'Already have an account?',
        'goLogin': 'Go to login',
        'email': 'Email',
        'password': 'Password',
        'confirmPassword': 'Confirm Password',
        'name': 'Name',
        'yourEmail': 'your@email.com',
        'yourPassword': 'Your password',
        'createPassword': 'Create a password',
        'confirmPwd': 'Confirm password',

        // Dashboard
        'dashboard': 'Dashboard',
        'companies': 'Companies',
        'transactions': 'Transactions',
        'payable': 'Payable Accounts',
        'receivable': 'Receivable Accounts',
        'goals': 'Goals',
        'investments': 'Investments',
        'suppliers': 'Suppliers',
        'costs': 'Costs',
        'reports': 'Reports',
        'settings': 'Settings',

        // Accessibility
        'audioReaderActive': 'Deactivate audio reader',
        'librasActive': 'Deactivate LIBRAS interpreter',
        'languageChanged': 'Language changed to English',
        'fontSizeMessage': 'Font size:'
    }
};

function t(key) {
    return TRANSLATIONS[currentLanguage]?.[key] || key;
}

function toggleLanguageDropdown() {
    const dropdown = document.getElementById('langDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

function changeLanguage(lang) {
    currentLanguage = lang;
    storageSet('language', lang);

    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.getAttribute('data-lang') === lang) {
            opt.classList.add('active');
        }
    });

    document.getElementById('langDropdown').style.display = 'none';

    if (audioReaderActive && speechSynthesisUtterance) {
        speechSynthesisUtterance.lang = lang === 'en' ? 'en-US' : 'pt-BR';
    }

    updateUILanguage();

    showSuccessMessage(t('languageChanged'));
}

function updateUILanguage() {
    const audioBtn = document.getElementById('audioReaderBtn');
    if (audioBtn) {
        audioBtn.title = audioReaderActive ? t('audioReaderActive') : t('audioReaderTitle');
    }

    const librasBtn = document.getElementById('librasBtn');
    if (librasBtn) {
        librasBtn.title = librasActive ? t('librasActive') : t('librasTitle');
    }

    const fontBtn = document.getElementById('fontSizeBtn');
    if (fontBtn) {
        fontBtn.title = t('fontSizeTitle');
    }

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.title = t('themeToggleTitle');
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.textContent = t('logoutBtn');
    }

    const userDisplay = document.getElementById('userName');
    if (userDisplay && !currentUser) {
        userDisplay.textContent = t('userName');
    }
}

// ==================== DADOS E CONSTANTES ====================
const CATEGORIES = {
    ganho: ['Salário', 'Freelance', 'Bonificação', 'Investimento', 'Outros'],
    gasto: ['Comida', 'Transporte', 'Saúde', 'Entretenimento', 'Educação', 'Trabalho', 'Contas', 'Outros']
};

const ICONS_MAP = {
    'Salário': 'fas fa-briefcase',
    'Freelance': 'fas fa-laptop',
    'Bonificação': 'fas fa-gift',
    'Investimento': 'fas fa-chart-line',
    'Comida': 'fas fa-utensils',
    'Transporte': 'fas fa-bus',
    'Saúde': 'fas fa-hospital',
    'Entretenimento': 'fas fa-gamepad',
    'Educação': 'fas fa-book',
    'Trabalho': 'fas fa-briefcase',
    'Contas': 'fas fa-credit-card',
    'Outros': 'fas fa-ellipsis-h'
};

// ==================== ESTADO GLOBAL ====================
let currentUser = null;
let currentEmpresa = null;
let empresas = [];
let transactions = [];
let contasPagar = [];
let contasReceber = [];
let metas = [];
let investimentos = [];
let fornecedores = [];
let custosFixos = [];
let custosVariaveis = [];
let proLabore = 0;

function clearLegacyAuthStorage() {
    const keysToRemove = [];
    storageKeys().forEach((key) => {
        if (!key) return;
        if (key === 'users' || key === 'currentUser') {
            keysToRemove.push(key);
        }
    });
    keysToRemove.forEach((key) => storageRemove(key));
}

function getStoredUser() {
    try {
        const raw = storageGet('currentUser');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

// ==================== INICIALIZAÇÃO ====================
async function initApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations()
            .then((regs) => Promise.all(regs.map((reg) => reg.unregister())))
            .then(() => console.log('[App] Service Worker desativado para desenvolvimento'))
            .catch((error) => console.log('[App] Erro ao desativar SW:', error));
    }

    initializeTheme();
    initAccessibility();

    try {
        if (DEMO_AUTH) {
            const stored = getStoredUser();
            if (stored?.email) {
                currentUser = stored;
                loadUserData();
                setTimeout(() => transitionFromSplash('main'), 1600);
            } else {
                setTimeout(() => transitionFromSplash('login'), 1600);
            }
            return;
        }

        const isAuth = await Auth.isAuthenticated();
        const nextScreen = isAuth ? 'main' : 'login';
        if (isAuth) {
            const user = await Auth.getCurrentUser();
            currentUser = {
                email: user?.email || '',
                name: user?.nome || user?.email || 'Usuário'
            };
            storageSet('currentUser', JSON.stringify(currentUser));
            loadUserData();
        }

        setTimeout(() => transitionFromSplash(nextScreen), 1600);
    } catch (error) {
        console.warn('[App] Erro ao verificar sessão:', error);
        setTimeout(() => transitionFromSplash('login'), 1600);
    }

    setupEventListeners();

    document.addEventListener('click', (e) => {
        const langBtn = document.getElementById('langBtn');
        const langDropdown = document.getElementById('langDropdown');
        if (langBtn && langDropdown && e.target !== langBtn && !langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
            langDropdown.style.display = 'none';
        }
    });
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('registerBtn').addEventListener('click', handleRegister);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            showSection(section);
        });
    });

    document.getElementById('transactionForm').addEventListener('submit', handleAddTransaction);
    document.getElementById('filterType').addEventListener('change', applyFilters);
    document.getElementById('filterCategory').addEventListener('change', applyFilters);
    document.getElementById('searchTransaction').addEventListener('input', applyFilters);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    document.getElementById('transType').addEventListener('change', updateCategoryOptions);

    if (document.getElementById('addEmpresaBtn')) {
        document.getElementById('addEmpresaBtn').addEventListener('click', openEmpresaModal);
    }

    if (document.getElementById('addMetaBtn')) {
        document.getElementById('addMetaBtn').addEventListener('click', openMetaModal);
    }

    if (document.getElementById('addInvestimentoBtn')) {
        document.getElementById('addInvestimentoBtn').addEventListener('click', openInvestimentoModal);
    }

    if (document.getElementById('addFornecedorBtn')) {
        document.getElementById('addFornecedorBtn').addEventListener('click', openFornecedorModal);
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target));
    });

    if (document.getElementById('prevMonth')) {
        document.getElementById('prevMonth').addEventListener('click', previousMonth);
    }
    if (document.getElementById('nextMonth')) {
        document.getElementById('nextMonth').addEventListener('click', nextMonth);
    }

    if (document.getElementById('generateReportBtn')) {
        document.getElementById('generateReportBtn').addEventListener('click', generateReport);
    }

    if (document.getElementById('formContasPagar')) {
        document.getElementById('formContasPagar').addEventListener('submit', handleAddContaPagar);
    }
    if (document.getElementById('formContasReceber')) {
        document.getElementById('formContasReceber').addEventListener('submit', handleAddContaReceber);
    }
    if (document.getElementById('formProLabore')) {
        document.getElementById('formProLabore').addEventListener('submit', handleSetProLabore);
    }
}

// ==================== AUTENTICAÇÃO ====================
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    if (DEMO_AUTH) {
        clearLegacyAuthStorage();
        currentUser = { email, name: email.split('@')[0] || 'Usuário' };
        storageSet('currentUser', JSON.stringify(currentUser));
        loadUserData();
        showMainScreen();
        clearLoginForm();
        return;
    }

    try {
        await Auth.login(email, password);
        const user = await Auth.getCurrentUser();
        clearLegacyAuthStorage();
        currentUser = {
            email: user?.email || email,
            name: user?.nome || user?.email || 'Usuário'
        };
        storageSet('currentUser', JSON.stringify(currentUser));
        loadUserData();
        showMainScreen();
        clearLoginForm();
    } catch (error) {
        alert(error.message || 'Email ou senha inválidos!');
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const password2 = document.getElementById('registerPassword2').value;

    if (!name || !email || !password || !password2) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    if (password !== password2) {
        alert('As senhas não coincidem!');
        return;
    }

    if (password.length < 4) {
        alert('A senha deve ter no mínimo 4 caracteres');
        return;
    }

    if (DEMO_AUTH) {
        clearLegacyAuthStorage();
        currentUser = { email, name };
        storageSet('currentUser', JSON.stringify(currentUser));
        loadUserData();
        showMainScreen();
        clearRegisterForm();
        showSuccessMessage('Conta criada com sucesso!');
        return;
    }

    try {
        await Auth.register({ name, email, password, skipAutoLogin: true });
        const session = await Auth.getSession();
        if (!session) {
            showSuccessMessage('Conta criada! Verifique seu email para confirmar o acesso.');
            clearRegisterForm();
            toggleLoginRegister(e);
            return;
        }

        clearLegacyAuthStorage();
        const user = await Auth.getCurrentUser();
        currentUser = {
            email: user?.email || email,
            name: user?.nome || name
        };
        storageSet('currentUser', JSON.stringify(currentUser));
        loadUserData();
        showMainScreen();
        clearRegisterForm();
        showSuccessMessage('Conta criada com sucesso!');
    } catch (error) {
        alert(error.message || 'Erro ao criar conta.');
    }
}

async function handleLogout() {
    if (confirm('Deseja realmente sair?')) {
        if (!DEMO_AUTH) {
            try {
                await Auth.logout();
            } catch (error) {
                console.warn('[App] Erro ao sair:', error);
            }
        }
        currentUser = null;
        transactions = [];
        clearLegacyAuthStorage();
        showLoginScreen();
        clearLoginForm();
        clearRegisterForm();
    }
}

function toggleLoginRegister(e) {
    e.preventDefault();
    document.getElementById('loginForm').style.display =
        document.getElementById('loginForm').style.display === 'none' ? 'block' : 'none';
    document.getElementById('registerForm').style.display =
        document.getElementById('registerForm').style.display === 'none' ? 'block' : 'none';
}

// ==================== NAVEGAÇÃO TELAS ====================
function transitionFromSplash(target) {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;

    splash.style.opacity = '0';
    splash.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        splash.classList.remove('active');
        if (target === 'main') {
            showMainScreen();
        } else {
            showLoginScreen();
        }
    }, 500);
}

function showLoginScreen() {
    const splash = document.getElementById('splashScreen');
    if (splash) splash.classList.remove('active');
    const loginScreen = document.getElementById('loginScreen');
    const mainScreen = document.getElementById('mainScreen');
    if (loginScreen) {
        loginScreen.classList.add('active');
        loginScreen.style.display = 'flex';
    }
    if (mainScreen) {
        mainScreen.classList.remove('active');
        mainScreen.style.display = 'none';
    }
    clearLoginForm();
    clearRegisterForm();
}

function showMainScreen() {
    const splash = document.getElementById('splashScreen');
    if (splash) splash.classList.remove('active');
    const loginScreen = document.getElementById('loginScreen');
    const mainScreen = document.getElementById('mainScreen');
    if (loginScreen) {
        loginScreen.classList.remove('active');
        loginScreen.style.display = 'none';
    }
    if (mainScreen) {
        mainScreen.classList.add('active');
        mainScreen.style.display = 'flex';
    }
    document.getElementById('userName').textContent = currentUser.name;
    setTodayDate();
    updateCategoryOptions();
    updateDashboard();
    showSection('dashboard');
}

function showSection(section) {
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');

    const sectionId = section + '-section';
    const sectionEl = document.getElementById(sectionId);
    if (sectionEl) {
        sectionEl.style.display = 'block';
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === section) {
            link.classList.add('active');
        }
    });

    if (section === 'dashboard') {
        updateDashboard();
    } else if (section === 'transacoes') {
        renderTransactions();
    } else if (section === 'empresas') {
        renderEmpresas();
    } else if (section === 'metas') {
        renderMetas();
    } else if (section === 'investimentos') {
        renderInvestimentos();
    } else if (section === 'fornecedores') {
        renderFornecedores();
    } else if (section === 'perfil') {
        renderProfile();
    } else if (section === 'relatorios') {
        setTimeout(initCharts, 300);
    } else if (section === 'contas') {
        loadContasData();
    } else if (section === 'calendario') {
        initCalendar();
    }
}

// ==================== EMPRESAS ====================
function renderEmpresas() {
    const container = document.getElementById('empresasList');
    if (!container) return;

    if (empresas.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhuma empresa cadastrada. Crie uma para começar!</p>';
        return;
    }

    container.innerHTML = empresas.map(emp => `
        <div class="empresa-card" onclick="selectEmpresa(${emp.id})">
            <h3>${emp.nome}</h3>
            <p class="text-muted">${emp.tipo}</p>
            <p><strong>CNPJ/CPF:</strong> ${emp.documento}</p>
            <p><strong>Saldo:</strong> ${formatCurrency(emp.saldo || 0)}</p>
            <div class="card-actions">
                <button class="btn btn-small" onclick="editEmpresa(${emp.id}); event.stopPropagation();"><i class="fas fa-edit"></i> Editar</button>
                <button class="btn btn-small btn-danger" onclick="deleteEmpresa(${emp.id}); event.stopPropagation();"><i class="fas fa-trash"></i> Deletar</button>
            </div>
        </div>
    `).join('');
}

function selectEmpresa(id) {
    currentEmpresa = empresas.find(e => e.id === id);
    loadUserData();
    updateDashboard();
    showSuccessMessage(`${currentEmpresa.nome} selecionada!`);
}

function openEmpresaModal() {
    const nome = prompt('Nome da Empresa/Negócio:');
    if (!nome) return;

    const tipo = prompt('Tipo (PJ - Pessoa Jurídica / PF - Pessoa Física):');
    if (!tipo) return;

    const documento = prompt('CNPJ/CPF:');
    if (!documento) return;

    const empresa = {
        id: Date.now(),
        nome,
        tipo,
        documento,
        saldo: 0,
        ownedBy: currentUser.email,
        createdAt: new Date().getTime()
    };

    empresas.push(empresa);
    currentEmpresa = empresa;
    saveUserData();
    renderEmpresas();
    showSuccessMessage('Empresa criada com sucesso!');
}

function editEmpresa(id) {
    const emp = empresas.find(e => e.id === id);
    const nome = prompt('Novo nome:', emp.nome);
    if (nome) {
        emp.nome = nome;
        saveUserData();
        renderEmpresas();
        showSuccessMessage('Empresa atualizada!');
    }
}

function deleteEmpresa(id) {
    if (confirm('Deseja realmente deletar esta empresa?')) {
        empresas = empresas.filter(e => e.id !== id);
        if (currentEmpresa?.id === id) currentEmpresa = null;
        saveUserData();
        renderEmpresas();
        showSuccessMessage('Empresa deletada!');
    }
}

// ==================== TRANSAÇÕES ====================
function handleAddTransaction(e) {
    e.preventDefault();
    const type = document.getElementById('transType').value;
    const category = document.getElementById('transCategory').value;
    const description = document.getElementById('transDescription').value.trim();
    const amount = parseFloat(document.getElementById('transAmount').value);
    const date = document.getElementById('transDate').value;

    if (!category || !description || !amount || !date) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    if (amount <= 0) {
        alert('O valor deve ser maior que zero');
        return;
    }

    const transaction = {
        id: Date.now(),
        type,
        category,
        description,
        amount,
        date,
        timestamp: new Date().getTime(),
        empresaId: currentEmpresa?.id,
        fixed: false,
        variable: false
    };

    transactions.push(transaction);
    saveUserData();
    renderTransactions();
    updateDashboard();

    document.getElementById('transactionForm').reset();
    setTodayDate();
    updateCategoryOptions();
    showSuccessMessage('Transação adicionada com sucesso!');
}

function deleteTransaction(id) {
    if (confirm('Deseja realmente deletar esta transação?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveUserData();
        renderTransactions();
        updateDashboard();
        showSuccessMessage('Transação removida com sucesso!');
    }
}

function renderTransactions() {
    const container = document.getElementById('transactionsList');

    if (transactions.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhuma transação registrada ainda</p>';
        return;
    }

    const filtered = getFilteredTransactions();

    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhuma transação encontrada com os filtros aplicados</p>';
        return;
    }

    container.innerHTML = filtered
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(t => createTransactionHTML(t))
        .join('');

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteTransaction(parseInt(btn.dataset.id)));
    });
}

function createTransactionHTML(transaction) {
    const dateObj = new Date(transaction.date);
    const formattedDate = dateObj.toLocaleDateString('pt-BR');
    const icon = ICONS_MAP[transaction.category] || 'fas fa-circle';
    const symbol = transaction.type === 'ganho' ? '+' : '-';
    const amount = formatCurrency(transaction.amount);

    return `
        <div class="transaction-item ${transaction.type}">
            <div class="transaction-left">
                <div class="transaction-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="transaction-info">
                    <h4>${transaction.description}</h4>
                    <p>${formattedDate}</p>
                    <span class="transaction-category">${transaction.category}</span>
                </div>
            </div>
            <div class="transaction-right">
                <div class="transaction-amount">
                    ${symbol} ${amount}
                </div>
                <button class="btn-delete" data-id="${transaction.id}" title="Deletar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

// ==================== DASHBOARD ====================
function updateDashboard() {
    const income = transactions
        .filter(t => t.type === 'ganho' && (!currentEmpresa || t.empresaId === currentEmpresa.id))
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'gasto' && (!currentEmpresa || t.empresaId === currentEmpresa.id))
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    document.getElementById('totalBalance').textContent = formatCurrency(balance);
    document.getElementById('totalIncome').textContent = formatCurrency(income);
    document.getElementById('totalExpense').textContent = formatCurrency(expenses);

    if (currentEmpresa) {
        currentEmpresa.saldo = balance;
    }
}

// ==================== FILTROS ====================
function getFilteredTransactions() {
    const typeFilter = document.getElementById('filterType').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    const searchFilter = document.getElementById('searchTransaction').value.toLowerCase();

    return transactions.filter(t => {
        const matchType = !typeFilter || t.type === typeFilter;
        const matchCategory = !categoryFilter || t.category === categoryFilter;
        const matchSearch = !searchFilter || t.description.toLowerCase().includes(searchFilter);
        const matchEmpresa = !currentEmpresa || t.empresaId === currentEmpresa.id;

        return matchType && matchCategory && matchSearch && matchEmpresa;
    });
}

function applyFilters() {
    renderTransactions();
}

function clearFilters() {
    document.getElementById('filterType').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('searchTransaction').value = '';
    applyFilters();
}

// ==================== CATEGORIAS ====================
function updateCategoryOptions() {
    const type = document.getElementById('transType').value;
    const categorySelect = document.getElementById('transCategory');
    const filterCategorySelect = document.getElementById('filterCategory');

    const categories = CATEGORIES[type] || [];

    categorySelect.innerHTML = '<option value="">Selecione uma categoria</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

    const allCategories = [...new Set(transactions.map(t => t.category))].sort();
    filterCategorySelect.innerHTML = '<option value="">Todas as categorias</option>' +
        allCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

// ==================== CONTAS A PAGAR/RECEBER ====================
function handleAddContaPagar(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input');

    const conta = {
        id: Date.now(),
        descricao: inputs[0].value,
        fornecedor: inputs[1].value,
        valor: parseFloat(inputs[2].value),
        dataVencimento: inputs[3].value,
        status: 'pendente',
        empresaId: currentEmpresa?.id
    };

    contasPagar.push(conta);
    saveUserData();
    loadContasData();
    form.reset();
    showSuccessMessage('Conta a pagar adicionada!');
}

function handleAddContaReceber(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input');

    const conta = {
        id: Date.now(),
        descricao: inputs[0].value,
        cliente: inputs[1].value,
        valor: parseFloat(inputs[2].value),
        dataVencimento: inputs[3].value,
        status: 'pendente',
        empresaId: currentEmpresa?.id
    };

    contasReceber.push(conta);
    saveUserData();
    loadContasData();
    form.reset();
    showSuccessMessage('Conta a receber adicionada!');
}

function handleSetProLabore(e) {
    e.preventDefault();
    const valor = parseFloat(document.getElementById('proLaboreValor').value);
    proLabore = valor;
    saveUserData();
    showSuccessMessage(`Pró-Labore fixo definido em ${formatCurrency(valor)}`);
    updateProLaboreInfo();
}

function loadContasData() {
    const pagarContainer = document.getElementById('contasPagarList');
    if (pagarContainer) {
        pagarContainer.innerHTML = contasPagar
            .filter(c => !currentEmpresa || c.empresaId === currentEmpresa.id)
            .map(c => `
                <div class="account-item">
                    <div>
                        <h4>${c.descricao}</h4>
                        <p>Fornecedor: ${c.fornecedor}</p>
                        <p>Vencimento: ${new Date(c.dataVencimento).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                        <strong>${formatCurrency(c.valor)}</strong>
                        <span class="status-badge status-${c.status}">${c.status}</span>
                    </div>
                </div>
            `).join('');
    }

    const receberContainer = document.getElementById('contasReceberList');
    if (receberContainer) {
        receberContainer.innerHTML = contasReceber
            .filter(c => !currentEmpresa || c.empresaId === currentEmpresa.id)
            .map(c => `
                <div class="account-item">
                    <div>
                        <h4>${c.descricao}</h4>
                        <p>Cliente: ${c.cliente}</p>
                        <p>Vencimento: ${new Date(c.dataVencimento).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                        <strong>${formatCurrency(c.valor)}</strong>
                        <span class="status-badge status-${c.status}">${c.status}</span>
                    </div>
                </div>
            `).join('');
    }

    updateProLaboreInfo();
}

function updateProLaboreInfo() {
    const infoBox = document.getElementById('proLaboreInfo');
    if (infoBox && proLabore > 0) {
        infoBox.innerHTML = `
            <h4>Pró-Labore Configurado</h4>
            <p><strong>Valor Mensal:</strong> ${formatCurrency(proLabore)}</p>
            <p><strong>Anual:</strong> ${formatCurrency(proLabore * 12)}</p>
        `;
    }
}

// ==================== METAS ====================
function openMetaModal() {
    const descricao = prompt('Descrição da meta:');
    if (!descricao) return;

    const valor = parseFloat(prompt('Valor alvo:'));
    if (isNaN(valor)) return;

    const dataVencimento = prompt('Data limite (YYYY-MM-DD):');
    if (!dataVencimento) return;

    const meta = {
        id: Date.now(),
        descricao,
        valor,
        realizado: 0,
        dataVencimento,
        empresaId: currentEmpresa?.id
    };

    metas.push(meta);
    saveUserData();
    renderMetas();
    showSuccessMessage('Meta criada com sucesso!');
}

function renderMetas() {
    const container = document.getElementById('metasList');
    if (!container) return;

    if (metas.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhuma meta criada</p>';
        return;
    }

    container.innerHTML = metas
        .filter(m => !currentEmpresa || m.empresaId === currentEmpresa.id)
        .map(m => {
            const percentual = (m.realizado / m.valor * 100).toFixed(0);
            return `
                <div class="goal-item">
                    <h4>${m.descricao}</h4>
                    <p>Meta: ${formatCurrency(m.valor)} | Realizado: ${formatCurrency(m.realizado)}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentual}%"></div>
                    </div>
                    <p class="text-muted">${percentual}% completo</p>
                </div>
            `;
        }).join('');
}

// ==================== FORNECEDORES ====================
function openFornecedorModal() {
    const nome = prompt('Nome do fornecedor:');
    if (!nome) return;

    const contato = prompt('Contato (telefone/email):');
    if (!contato) return;

    const categoria = prompt('Categoria (produto/serviço):');
    if (!categoria) return;

    const prazo = prompt('Prazo de pagamento (ex: 30 dias):');
    if (!prazo) return;

    const fornecedor = {
        id: Date.now(),
        nome,
        contato,
        categoria,
        prazo,
        empresaId: currentEmpresa?.id
    };

    fornecedores.push(fornecedor);
    saveUserData();
    renderFornecedores();
    showSuccessMessage('Fornecedor adicionado!');
}

function renderFornecedores() {
    const container = document.getElementById('fornecedoresList');
    if (!container) return;

    container.innerHTML = fornecedores
        .filter(f => !currentEmpresa || f.empresaId === currentEmpresa.id)
        .map(f => `
            <div class="supplier-card">
                <h3>${f.nome}</h3>
                <p><strong>Categoria:</strong> ${f.categoria}</p>
                <p><strong>Contato:</strong> ${f.contato}</p>
                <p><strong>Prazo:</strong> ${f.prazo}</p>
                <button class="btn btn-small btn-danger" onclick="deleteFornecedor(${f.id})">
                    <i class="fas fa-trash"></i> Deletar
                </button>
            </div>
        `).join('');
}

function deleteFornecedor(id) {
    if (confirm('Deletar fornecedor?')) {
        fornecedores = fornecedores.filter(f => f.id !== id);
        saveUserData();
        renderFornecedores();
        showSuccessMessage('Fornecedor deletado!');
    }
}

// ==================== INVESTIMENTOS ====================
function openInvestimentoModal() {
    const descricao = prompt('Descrição do investimento:');
    if (!descricao) return;

    const valor = parseFloat(prompt('Valor:'));
    if (isNaN(valor)) return;

    const tipo = prompt('Tipo (Ação/Fundo/Cripto/Outro):');
    if (!tipo) return;

    const investimento = {
        id: Date.now(),
        descricao,
        valor,
        tipo,
        dataAquisicao: new Date().toISOString().split('T')[0],
        empresaId: currentEmpresa?.id
    };

    investimentos.push(investimento);
    saveUserData();
    renderInvestimentos();
    showSuccessMessage('Investimento registrado!');
}

function renderInvestimentos() {
    const container = document.getElementById('investimentosList');
    if (!container) return;

    container.innerHTML = investimentos
        .filter(i => !currentEmpresa || i.empresaId === currentEmpresa.id)
        .map(i => `
            <div class="investment-item">
                <h4>${i.descricao}</h4>
                <p>Tipo: ${i.tipo}</p>
                <p>Valor: ${formatCurrency(i.valor)}</p>
                <p class="text-muted">Data: ${new Date(i.dataAquisicao).toLocaleDateString('pt-BR')}</p>
            </div>
        `).join('');
}

// ==================== GRÁFICOS ====================
function initCharts() {
    generateMonthlyComparison();
    generateBimonthlyComparison();
    generateSemesterComparison();
    generateAnnualComparison();
    generateCategoryChart();
    generateScenarioAnalysis();
}

function generateMonthlyComparison() {
    const container = document.getElementById('monthlyChart');
    if (!container) return;

    const dates = getLast12Months();
    const income = dates.map(date => getMonthIncome(date));
    const expense = dates.map(date => getMonthExpense(date));

    const ctx = container.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(d => d.toLocaleDateString('pt-BR', { month: 'short' })),
            datasets: [
                {
                    label: 'Ganhos',
                    data: income,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Gastos',
                    data: expense,
                    borderColor: '#ff4757',
                    backgroundColor: 'rgba(255, 71, 87, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function generateBimonthlyComparison() {
    const container = document.getElementById('bimonthlyChart');
    if (!container) return;

    const bimonths = getLast6Bimonths();
    const data = bimonths.map(bm => ({
        period: bm,
        income: getBimonthIncome(bm),
        expense: getBimonthExpense(bm)
    }));

    const ctx = container.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.period),
            datasets: [
                {
                    label: 'Ganhos',
                    data: data.map(d => d.income),
                    backgroundColor: '#10b981'
                },
                {
                    label: 'Gastos',
                    data: data.map(d => d.expense),
                    backgroundColor: '#ff4757'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function generateSemesterComparison() {
    const container = document.getElementById('semesterChart');
    if (!container) return;

    const semesters = getLastSemesters();
    const data = semesters.map(sem => ({
        period: sem,
        income: getSemesterIncome(sem),
        expense: getSemesterExpense(sem)
    }));

    const ctx = container.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.period),
            datasets: [
                {
                    label: 'Ganhos',
                    data: data.map(d => d.income),
                    backgroundColor: '#10b981'
                },
                {
                    label: 'Gastos',
                    data: data.map(d => d.expense),
                    backgroundColor: '#ff4757'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function generateAnnualComparison() {
    const container = document.getElementById('annualChart');
    if (!container) return;

    const years = getLastYears();
    const data = years.map(year => ({
        year,
        income: getYearIncome(year),
        expense: getYearExpense(year)
    }));

    const ctx = container.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.year),
            datasets: [
                {
                    label: 'Ganhos',
                    data: data.map(d => d.income),
                    backgroundColor: '#10b981'
                },
                {
                    label: 'Gastos',
                    data: data.map(d => d.expense),
                    backgroundColor: '#ff4757'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function generateCategoryChart() {
    const container = document.getElementById('categoryChart');
    if (!container) return;

    const categoryData = getExpensesByCategory();
    const ctx = container.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: [
                    '#7c3aed', '#a78bfa', '#10b981', '#34d399',
                    '#ff4757', '#f87171', '#ffa502', '#fbbf24',
                    '#00bcd4', '#06b6d4', '#6366f1', '#818cf8'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } }
        }
    });
}

function generateScenarioAnalysis() {
    const container = document.getElementById('scenarioAnalysis');
    if (!container) return;

    const currentBalance = getTotalBalance();
    const monthlyAvg = getMonthlyAverageExpense();
    const months = Math.floor(currentBalance / monthlyAvg) || 0;

    container.innerHTML = `
        <div style="padding: 20px;">
            <h4>Análise de Cenários Financeiros</h4>
            <p><strong>Saldo Atual:</strong> ${formatCurrency(currentBalance)}</p>
            <p><strong>Gasto Médio Mensal:</strong> ${formatCurrency(monthlyAvg)}</p>
            <p><strong>Meses de Autonomia:</strong> ${months} meses</p>
            <hr style="margin: 15px 0;">
            <p><strong>Cenário Otimista (+15% de ganhos):</strong></p>
            <p>Autonomia: ${Math.ceil(months * 1.15)} meses</p>
            <hr style="margin: 15px 0;">
            <p><strong>Cenário Pessimista (-15% de ganhos):</strong></p>
            <p>Autonomia: ${Math.floor(months * 0.85)} meses</p>
        </div>
    `;
}

// Funções auxiliares de cálculo
function getLast12Months() {
    const months = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        months.push(new Date(d.getFullYear(), d.getMonth(), 1));
    }
    return months;
}

function getLast6Bimonths() {
    const bimonths = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const month = now.getMonth() - (i * 2);
        const year = now.getFullYear() + Math.floor(month / 12);
        const m = ((month % 12) + 12) % 12;
        bimonths.push(`${String(m + 1).padStart(2, '0')}/${year % 100}`);
    }
    return bimonths;
}

function getLastSemesters() {
    const semesters = [];
    for (let i = 3; i >= 0; i--) {
        const year = new Date().getFullYear() - Math.floor(i / 2);
        const sem = (i % 2) + 1;
        semesters.push(`S${sem}/${year}`);
    }
    return semesters;
}

function getLastYears() {
    const years = [];
    for (let i = 2; i >= 0; i--) {
        years.push(new Date().getFullYear() - i);
    }
    return years;
}

function getMonthIncome(date) {
    return transactions
        .filter(t => t.type === 'ganho' && new Date(t.date).getMonth() === date.getMonth())
        .reduce((sum, t) => sum + t.amount, 0);
}

function getMonthExpense(date) {
    return transactions
        .filter(t => t.type === 'gasto' && new Date(t.date).getMonth() === date.getMonth())
        .reduce((sum, t) => sum + t.amount, 0);
}

function getBimonthIncome(bmStr) {
    const [month, year] = bmStr.split('/').map(Number);
    const startMonth = (month - 1) * 2;
    const endMonth = startMonth + 1;
    const fullYear = parseInt('20' + year);

    return transactions
        .filter(t => {
            const tDate = new Date(t.date);
            const tMonth = tDate.getMonth();
            const tYear = tDate.getFullYear();
            return t.type === 'ganho' && tYear === fullYear &&
                   (tMonth === startMonth || tMonth === endMonth);
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

function getBimonthExpense(bmStr) {
    const [month, year] = bmStr.split('/').map(Number);
    const startMonth = (month - 1) * 2;
    const endMonth = startMonth + 1;
    const fullYear = parseInt('20' + year);

    return transactions
        .filter(t => {
            const tDate = new Date(t.date);
            const tMonth = tDate.getMonth();
            const tYear = tDate.getFullYear();
            return t.type === 'gasto' && tYear === fullYear &&
                   (tMonth === startMonth || tMonth === endMonth);
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

function getSemesterIncome(semStr) {
    const [sem, year] = semStr.split('/').map(Number);
    const startMonth = (sem - 1) * 6;
    const endMonth = startMonth + 5;

    return transactions
        .filter(t => {
            const tDate = new Date(t.date);
            const tMonth = tDate.getMonth();
            const tYear = tDate.getFullYear();
            return t.type === 'ganho' && tYear === year &&
                   tMonth >= startMonth && tMonth <= endMonth;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

function getSemesterExpense(semStr) {
    const [sem, year] = semStr.split('/').map(Number);
    const startMonth = (sem - 1) * 6;
    const endMonth = startMonth + 5;

    return transactions
        .filter(t => {
            const tDate = new Date(t.date);
            const tMonth = tDate.getMonth();
            const tYear = tDate.getFullYear();
            return t.type === 'gasto' && tYear === year &&
                   tMonth >= startMonth && tMonth <= endMonth;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

function getYearIncome(year) {
    return transactions
        .filter(t => t.type === 'ganho' && new Date(t.date).getFullYear() === year)
        .reduce((sum, t) => sum + t.amount, 0);
}

function getYearExpense(year) {
    return transactions
        .filter(t => t.type === 'gasto' && new Date(t.date).getFullYear() === year)
        .reduce((sum, t) => sum + t.amount, 0);
}

function getExpensesByCategory() {
    const categories = {};
    transactions
        .filter(t => t.type === 'gasto')
        .forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        });
    return categories;
}

function getTotalBalance() {
    const income = transactions.filter(t => t.type === 'ganho').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0);
    return income - expense;
}

function getMonthlyAverageExpense() {
    const currentMonth = new Date().getMonth();
    const monthExpenses = transactions
        .filter(t => t.type === 'gasto' && new Date(t.date).getMonth() === currentMonth)
        .reduce((sum, t) => sum + t.amount, 0);
    return monthExpenses || 0;
}

// Exportar relatório
function generateReport() {
    const reports = {
        totalIncome: transactions.filter(t => t.type === 'ganho').reduce((sum, t) => sum + t.amount, 0),
        totalExpense: transactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0),
        balance: getTotalBalance(),
        monthlyAverage: getMonthlyAverageExpense(),
        transactionCount: transactions.length,
        categories: getExpensesByCategory(),
        generatedAt: new Date().toLocaleString('pt-BR')
    };

    const reportModal = document.createElement('div');
    reportModal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 500px;
        width: 90%;
    `;

    reportModal.innerHTML = `
        <div style="display: data-theme: dark; color: #333;">
            <h2 style="margin-top: 0; color: #7c3aed;">Relatório Financeiro</h2>
            <p><strong>Gerado em:</strong> ${reports.generatedAt}</p>

            <hr style="margin: 20px 0;">

            <h3 style="color: #7c3aed;">RESUMO GERAL</h3>
            <p><strong>Total de Ganhos:</strong> ${formatCurrency(reports.totalIncome)}</p>
            <p><strong>Total de Gastos:</strong> ${formatCurrency(reports.totalExpense)}</p>
            <p><strong>Saldo:</strong> ${formatCurrency(reports.balance)}</p>
            <p><strong>Gasto Mensal Médio:</strong> ${formatCurrency(reports.monthlyAverage)}</p>
            <p><strong>Total de Transações:</strong> ${reports.transactionCount}</p>

            <hr style="margin: 20px 0;">

            <h3 style="color: #7c3aed;">GASTO POR CATEGORIA</h3>
            ${Object.entries(reports.categories).map(([cat, val]) =>
                `<p><strong>${cat}:</strong> ${formatCurrency(val)}</p>`
            ).join('')}

            <hr style="margin: 20px 0;">

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button onclick="exportPDF()" style="flex: 1; padding: 10px; background: #7c3aed; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-file-pdf"></i> PDF
                </button>
                <button onclick="exportExcel()" style="flex: 1; padding: 10px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-file-excel"></i> EXCEL
                </button>
                <button onclick="exportCSV()" style="flex: 1; padding: 10px; background: #06b6d4; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-file-csv"></i> CSV
                </button>
                <button onclick="document.querySelector('[data-report-modal]').remove()" style="flex: 1; padding: 10px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    Fechar
                </button>
            </div>
        </div>
    `;

    reportModal.setAttribute('data-report-modal', 'true');
    document.body.appendChild(reportModal);

    window.currentReportData = reports;
}

function exportPDF() {
    const reports = window.currentReportData;
    const element = document.createElement('div');
    element.style.cssText = 'padding: 20px; background: white; color: black;';
    element.innerHTML = `
        <h2>Relatório Financeiro FinCore</h2>
        <p>Gerado em: ${reports.generatedAt}</p>

        <h3>RESUMO GERAL</h3>
        <p>Total de Ganhos: ${formatCurrency(reports.totalIncome)}</p>
        <p>Total de Gastos: ${formatCurrency(reports.totalExpense)}</p>
        <p>Saldo: ${formatCurrency(reports.balance)}</p>
        <p>Gasto Mensal Médio: ${formatCurrency(reports.monthlyAverage)}</p>
        <p>Total de Transações: ${reports.transactionCount}</p>

        <h3>GASTO POR CATEGORIA</h3>
        ${Object.entries(reports.categories).map(([cat, val]) =>
            `<p>${cat}: ${formatCurrency(val)}</p>`
        ).join('')}
    `;

    const opt = {
        margin: 10,
        filename: `relatorio-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
    showSuccessMessage('Relatório em PDF baixado com sucesso!');
    document.querySelector('[data-report-modal]').remove();
}

function exportExcel() {
    const reports = window.currentReportData;
    const wb = XLSX.utils.book_new();

    const resumoData = [
        ['Relatório Financeiro FinCore'],
        ['Gerado em:', reports.generatedAt],
        [],
        ['RESUMO GERAL'],
        ['Total de Ganhos', formatCurrency(reports.totalIncome)],
        ['Total de Gastos', formatCurrency(reports.totalExpense)],
        ['Saldo', formatCurrency(reports.balance)],
        ['Gasto Mensal Médio', formatCurrency(reports.monthlyAverage)],
        ['Total de Transações', reports.transactionCount]
    ];

    const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');

    const catData = [['Categoria', 'Valor']];
    Object.entries(reports.categories).forEach(([cat, val]) => {
        catData.push([cat, val]);
    });

    const wsCat = XLSX.utils.aoa_to_sheet(catData);
    XLSX.utils.book_append_sheet(wb, wsCat, 'Categorias');

    const transData = [['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor']];
    transactions.forEach(t => {
        transData.push([t.date, t.type, t.category, t.description, t.amount]);
    });

    const wsTrans = XLSX.utils.aoa_to_sheet(transData);
    XLSX.utils.book_append_sheet(wb, wsTrans, 'Transações');

    XLSX.writeFile(wb, `relatorio-${new Date().toISOString().split('T')[0]}.xlsx`);
    showSuccessMessage('Relatório em EXCEL baixado com sucesso!');
    document.querySelector('[data-report-modal]').remove();
}

function exportCSV() {
    const reports = window.currentReportData;

    let csvContent = 'Relatório Financeiro FinCore\n';
    csvContent += `Gerado em: ${reports.generatedAt}\n\n`;
    csvContent += 'RESUMO GERAL\n';
    csvContent += `Total de Ganhos,${reports.totalIncome}\n`;
    csvContent += `Total de Gastos,${reports.totalExpense}\n`;
    csvContent += `Saldo,${reports.balance}\n`;
    csvContent += `Gasto Mensal Médio,${reports.monthlyAverage}\n`;
    csvContent += `Total de Transações,${reports.transactionCount}\n\n`;
    csvContent += 'GASTO POR CATEGORIA\n';
    csvContent += 'Categoria,Valor\n';

    Object.entries(reports.categories).forEach(([cat, val]) => {
        csvContent += `"${cat}",${val}\n`;
    });

    csvContent += '\nTRANSAÇÕES\n';
    csvContent += 'Data,Tipo,Categoria,Descrição,Valor\n';
    transactions.forEach(t => {
        csvContent += `${t.date},${t.type},"${t.category}","${t.description}",${t.amount}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccessMessage('Relatório em CSV baixado com sucesso!');
    document.querySelector('[data-report-modal]').remove();
}

// ==================== CALENDÁRIO ====================
function initCalendar() {
    const today = new Date();
    renderCalendar(today.getFullYear(), today.getMonth());
}

function renderCalendar(year, month) {
    const monthYearDisplay = document.getElementById('monthYearDisplay');
    const calendarTable = document.getElementById('calendarTable');

    if (!monthYearDisplay || !calendarTable) return;

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `
        <thead>
            <tr>
                <th>Dom</th><th>Seg</th><th>Ter</th><th>Qua</th>
                <th>Qui</th><th>Sex</th><th>Sab</th>
            </tr>
        </thead>
        <tbody>
    `;

    let day = 1;
    for (let i = 0; i < 6; i++) {
        html += '<tr>';
        for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < firstDay) || day > daysInMonth) {
                html += '<td class="other-month"></td>';
            } else {
                const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const hasEvent = contasPagar.some(c => c.dataVencimento === dateStr) ||
                               contasReceber.some(c => c.dataVencimento === dateStr);

                html += `<td class="${hasEvent ? 'has-event' : ''}">${day}</td>`;
                day++;
            }
        }
        html += '</tr>';
        if (day > daysInMonth) break;
    }

    html += '</tbody>';
    calendarTable.innerHTML = html;
}

function previousMonth() {
    // Implementar navegação anterior
}

function nextMonth() {
    // Implementar navegação próxima
}

// ==================== TABS ====================
function switchTab(button) {
    const tabName = button.dataset.tab;
    const container = button.closest('.tabs-container');

    if (!container) return;

    container.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    container.parentElement.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    button.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// ==================== PERFIL ====================
let userProfile = {
    slogan: '',
    sharedAccounts: []
};

function renderProfile() {
    const container = document.getElementById('perfil-section');
    if (!container) return;

    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('currentSlogan').textContent = userProfile.slogan || 'Nenhum slogan definido';

    renderSharedAccounts();
}

function editSlogan() {
    document.getElementById('sloganDisplay').style.display = 'none';
    document.getElementById('editSloganBtn').style.display = 'none';
    document.getElementById('formSlogan').style.display = 'block';
    document.getElementById('sloganInput').value = userProfile.slogan || '';
}

function cancelEditSlogan() {
    document.getElementById('sloganDisplay').style.display = 'block';
    document.getElementById('editSloganBtn').style.display = 'block';
    document.getElementById('formSlogan').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('formSlogan')) {
        document.getElementById('formSlogan').addEventListener('submit', (e) => {
            e.preventDefault();
            const slogan = document.getElementById('sloganInput').value.trim();
            if (slogan) {
                userProfile.slogan = slogan;
                saveUserData();
                document.getElementById('currentSlogan').textContent = slogan;
                showSuccessMessage('Slogan atualizado com sucesso!');
                cancelEditSlogan();
            }
        });
    }
});

function openChangePasswordForm() {
    document.getElementById('changePasswordBtn').style.display = 'none';
    document.getElementById('formChangePassword').style.display = 'block';
}

function cancelChangePassword() {
    document.getElementById('changePasswordBtn').style.display = 'block';
    document.getElementById('formChangePassword').style.display = 'none';
    document.getElementById('formChangePassword').reset();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('formChangePassword')) {
        document.getElementById('formChangePassword').addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPass = document.getElementById('newPassword').value;
            const confirm = document.getElementById('confirmPassword').value;

            if (newPass.length < 6) {
                alert('A nova senha deve ter pelo menos 6 caracteres!');
                return;
            }

            if (newPass !== confirm) {
                alert('As senhas não conferem!');
                return;
            }

            try {
                await Auth.updatePassword(newPass);
                showSuccessMessage('Senha alterada com sucesso!');
                cancelChangePassword();
            } catch (error) {
                alert('Erro ao alterar senha.');
            }
        });
    }
});

function openShareAccountForm() {
    document.getElementById('shareAccountBtn').style.display = 'none';
    document.getElementById('formShareAccount').style.display = 'block';
}

function cancelShareAccount() {
    document.getElementById('shareAccountBtn').style.display = 'block';
    document.getElementById('formShareAccount').style.display = 'none';
    document.getElementById('formShareAccount').reset();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('formShareAccount')) {
        document.getElementById('formShareAccount').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('shareEmail').value.trim();
            const permission = document.getElementById('sharePermission').value;
            const expiry = document.getElementById('shareExpiry').value;

            if (!email) {
                alert('Digite um email válido!');
                return;
            }

            if (email === currentUser.email) {
                alert('Você não pode compartilhar com você mesmo!');
                return;
            }

            const share = {
                id: Date.now(),
                email,
                permission,
                expiry: expiry || null,
                createdAt: new Date().toISOString()
            };

            userProfile.sharedAccounts.push(share);
            saveUserData();
            showSuccessMessage(`Conta compartilhada com ${email}!`);
            cancelShareAccount();
            renderSharedAccounts();
        });
    }
});

function renderSharedAccounts() {
    const sharesList = document.getElementById('sharedAccountsList');
    const container = document.getElementById('sharedAccountsContainer');

    if (!userProfile.sharedAccounts || userProfile.sharedAccounts.length === 0) {
        if (sharesList) sharesList.style.display = 'none';
        return;
    }

    if (sharesList) sharesList.style.display = 'block';

    container.innerHTML = userProfile.sharedAccounts.map(share => `
        <div class="share-item">
            <div class="share-item-info">
                <p class="share-item-email"><i class="fas fa-user"></i> ${share.email}</p>
                <p class="share-item-permission">
                    Acesso: <strong>${
                        share.permission === 'view' ? 'Visualização' :
                        share.permission === 'edit' ? 'Edição' : 'Administração'
                    }</strong>
                </p>
                ${share.expiry ? `<p class="share-item-expiry">Expira em: ${new Date(share.expiry).toLocaleDateString('pt-BR')}</p>` : ''}
            </div>
            <button class="btn btn-small btn-danger" onclick="removeShareAccess(${share.id})">
                <i class="fas fa-trash"></i> Remover
            </button>
        </div>
    `).join('');
}

function removeShareAccess(shareId) {
    if (confirm('Tem certeza que deseja revogar o acesso?')) {
        userProfile.sharedAccounts = userProfile.sharedAccounts.filter(s => s.id !== shareId);
        saveUserData();
        showSuccessMessage('Acesso revogado!');
        renderSharedAccounts();
    }
}

function switchAccount() {
    if (confirm('Deseja fazer login com outra conta? Você será desconectado.')) {
        handleLogout();
    }
}

function deleteAccount() {
    if (confirm('Tem certeza que deseja deletar sua conta? Esta ação é irreversível!')) {
        if (confirm('Esta é sua última chance! Todos os seus dados serão perdidos!')) {
            const userKey = `user_${currentUser.email}`;
            storageRemove(userKey);
            storageRemove('currentUser');
            alert('Conta deletada com sucesso!');
            location.reload();
        }
    }
}

// ==================== LOCAL STORAGE ====================
function saveUserData() {
    const userKey = `user_${currentUser.email}`;
    const data = {
        transactions,
        empresas,
        contasPagar,
        contasReceber,
        metas,
        investimentos,
        fornecedores,
        custosFixos,
        custosVariaveis,
        proLabore,
        currentEmpresa,
        userProfile
    };
    storageSet(userKey, JSON.stringify(data));
}

function loadUserData() {
    const userKey = `user_${currentUser.email}`;
    const data = storageGet(userKey);

    if (data) {
        const parsed = JSON.parse(data);
        transactions = parsed.transactions || [];
        empresas = parsed.empresas || [];
        contasPagar = parsed.contasPagar || [];
        contasReceber = parsed.contasReceber || [];
        metas = parsed.metas || [];
        investimentos = parsed.investimentos || [];
        fornecedores = parsed.fornecedores || [];
        custosFixos = parsed.custosFixos || [];
        custosVariaveis = parsed.custosVariaveis || [];
        proLabore = parsed.proLabore || 0;
        currentEmpresa = parsed.currentEmpresa || null;
        userProfile = parsed.userProfile || { slogan: '', sharedAccounts: [] };
    } else {
        userProfile = { slogan: '', sharedAccounts: [] };
    }
}

// ==================== UTILIDADES ====================
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function setTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const dateInput = document.getElementById('transDate');
    if (dateInput) dateInput.value = `${year}-${month}-${day}`;
}

function clearLoginForm() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function clearRegisterForm() {
    document.getElementById('registerName').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerPassword2').value = '';
}

function showSuccessMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    .progress-bar {
        width: 100%;
        height: 8px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
        margin: 10px 0;
    }
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #34d399);
        transition: width 0.3s ease;
    }
    .status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        margin-left: 10px;
    }
    .status-pendente {
        background: #fef3c7;
        color: #92400e;
    }
    .status-pago {
        background: #d1fae5;
        color: #065f46;
    }
    .text-muted {
        color: #6b7280;
        font-size: 14px;
    }
    .card-actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }
`;
document.head.appendChild(style);

// ==================== TEMA CLARO/ESCURO ====================
function initializeTheme() {
    const savedTheme = storageGet('theme') || 'light';
    setTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    storageSet('theme', theme);

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        if (theme === 'dark') {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            themeBtn.title = 'Modo claro';
        } else {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            themeBtn.title = 'Modo escuro';
        }
    }
}

// ==================== ACESSIBILIDADE ====================
let audioReaderActive = false;
let librasActive = false;
let currentFontSize = 1;
let speechSynthesisUtterance = null;

function initAccessibility() {
    const savedAudioReader = storageGet('audioReaderActive') === 'true';
    const savedLibras = storageGet('librasActive') === 'true';
    const savedFontSize = parseFloat(storageGet('fontSize')) || 1;

    const accessibilityBannerShown = storageGet('accessibilityBannerShown');
    if (!accessibilityBannerShown) {
        setTimeout(() => {
            const banner = document.getElementById('accessibilityBanner');
            if (banner) {
                banner.style.display = 'block';
                storageSet('accessibilityBannerShown', 'true');
            }
        }, 1000);
    }

    if (savedAudioReader) toggleAudioReader();
    if (savedLibras) toggleLibras();
    if (savedFontSize !== 1) {
        currentFontSize = savedFontSize;
        applyFontSize();
    }

    updateUILanguage();
}

function toggleAudioReader() {
    audioReaderActive = !audioReaderActive;
    storageSet('audioReaderActive', audioReaderActive);

    const btn = document.getElementById('audioReaderBtn');
    if (btn) {
        btn.classList.toggle('active', audioReaderActive);
        btn.title = audioReaderActive ? 'Desativar leitor de áudio' : 'Ativar leitor de áudio';
    }

    if (audioReaderActive) {
        readCurrentPageContent();
    } else {
        stopReading();
    }
}

function toggleLibras() {
    librasActive = !librasActive;
    storageSet('librasActive', librasActive);

    const btn = document.getElementById('librasBtn');
    const windowEl = document.getElementById('librasWindow');

    if (btn) {
        btn.classList.toggle('active', librasActive);
        btn.title = librasActive ? 'Desativar intérprete de LIBRAS' : 'Ativar intérprete de LIBRAS';
    }

    if (windowEl) {
        windowEl.style.display = librasActive ? 'flex' : 'none';
    }
}

function increaseFontSize() {
    currentFontSize = Math.min(currentFontSize + 0.2, 2);
    storageSet('fontSize', currentFontSize);
    applyFontSize();
    showSuccessMessage(`${t('fontSizeMessage')} ${Math.round(currentFontSize * 100)}%`);
}

function decreaseFontSize() {
    currentFontSize = Math.max(currentFontSize - 0.2, 0.8);
    storageSet('fontSize', currentFontSize);
    applyFontSize();
    showSuccessMessage(`${t('fontSizeMessage')} ${Math.round(currentFontSize * 100)}%`);
}

function applyFontSize() {
    document.documentElement.style.fontSize = (16 * currentFontSize) + 'px';
}

function readCurrentPageContent() {
    if (speechSynthesisUtterance) {
        window.speechSynthesis.cancel();
    }

    const activeSection = document.querySelector('.content-section[style*="display: block"]');
    let text = '';

    if (activeSection) {
        const heading = activeSection.querySelector('h2');
        const content = activeSection.innerText;
        text = heading ? heading.innerText + '. ' + content : content;
    } else {
        const loginForm = document.getElementById('loginForm');
        if (loginForm && loginForm.style.display !== 'none') {
            text = 'Tela de login do FinCore. Digite seu email e senha para acessar.';
        }
    }

    if (text) {
        speakText(text);
    }
}

function speakText(text) {
    if (!('speechSynthesis' in window)) {
        alert(currentLanguage === 'en' ? 'Audio not supported in this browser' : 'Áudio não suportado neste navegador');
        return;
    }

    window.speechSynthesis.cancel();

    text = text.replace(/\s+/g, ' ').substring(0, 5000);

    speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    speechSynthesisUtterance.lang = currentLanguage === 'en' ? 'en-US' : 'pt-BR';
    speechSynthesisUtterance.rate = 1;
    speechSynthesisUtterance.pitch = 1;
    speechSynthesisUtterance.volume = 1;

    window.speechSynthesis.speak(speechSynthesisUtterance);
}

function stopReading() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

const originalShowSection = showSection;
showSection = function(section) {
    originalShowSection(section);
    if (audioReaderActive) {
        setTimeout(readCurrentPageContent, 500);
    }
};

function closeAccessibilityBanner() {
    const banner = document.getElementById('accessibilityBanner');
    if (banner) {
        banner.style.animation = 'slideUp 0.5s ease';
        setTimeout(() => {
            banner.style.display = 'none';
        }, 500);
    }
}

// Atalhos de teclado para acessibilidade
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'a') {
        toggleAudioReader();
        e.preventDefault();
    }
    if (e.altKey && e.key === 'l') {
        toggleLibras();
        e.preventDefault();
    }
    if (e.altKey && (e.key === '+' || e.key === '=')) {
        increaseFontSize();
        e.preventDefault();
    }
    if (e.altKey && e.key === '-') {
        decreaseFontSize();
        e.preventDefault();
    }
});

window.toggleLanguageDropdown = toggleLanguageDropdown;
window.changeLanguage = changeLanguage;
window.toggleLoginRegister = toggleLoginRegister;
window.toggleTheme = toggleTheme;
window.toggleAudioReader = toggleAudioReader;
window.toggleLibras = toggleLibras;
window.increaseFontSize = increaseFontSize;
window.closeAccessibilityBanner = closeAccessibilityBanner;
window.editSlogan = editSlogan;
window.cancelEditSlogan = cancelEditSlogan;
window.openChangePasswordForm = openChangePasswordForm;
window.cancelChangePassword = cancelChangePassword;
window.openShareAccountForm = openShareAccountForm;
window.cancelShareAccount = cancelShareAccount;
window.removeShareAccess = removeShareAccess;
window.switchAccount = switchAccount;
window.deleteAccount = deleteAccount;
window.exportPDF = exportPDF;
window.exportExcel = exportExcel;
window.exportCSV = exportCSV;

initApp();

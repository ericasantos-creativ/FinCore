import { Auth } from './auth.js';

const DEMO_AUTH = true;
const memoryStorage = new Map();

function getCookie(key) {
    const name = `${encodeURIComponent(key)}=`;
    const parts = document.cookie.split(';');
    for (const part of parts) {
        const item = part.trim();
        if (item.startsWith(name)) {
            return decodeURIComponent(item.substring(name.length));
        }
    }
    return null;
}

function setCookie(key, value, maxAgeSeconds = 31536000) {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(value);
    document.cookie = `${encodedKey}=${encodedValue}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
}

function deleteCookie(key) {
    const encodedKey = encodeURIComponent(key);
    document.cookie = `${encodedKey}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function storageGet(key) {
    try {
        const value = localStorage.getItem(key);
        if (value !== null) return value;
        return getCookie(key);
    } catch {
        if (memoryStorage.has(key)) return memoryStorage.get(key);
        return getCookie(key);
    }
}

function storageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {
        memoryStorage.set(key, value);
    }
    setCookie(key, value);
}

function storageRemove(key) {
    try {
        localStorage.removeItem(key);
    } catch {
        memoryStorage.delete(key);
    }
    deleteCookie(key);
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
        'fontSizeDecreaseTitle': 'Diminuir fonte',
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
        'calendar': 'Calendário',
        'profile': 'Perfil',
        'companyLabel': 'Empresa',
        'totalBalanceTitle': 'Saldo Total',
        'noCompanies': 'Nenhuma empresa cadastrada. Crie uma para começar!',
        'noCompaniesYet': 'Nenhuma empresa cadastrada ainda.',
        'companiesLogged': 'Empresas logadas',
        'searchCompany': 'Buscar empresa...',
        'noGoals': 'Nenhuma meta criada',
        'goalProgress': 'completo',
        'goal': 'Meta',
        'achieved': 'Realizado',
        'metaDescriptionPrompt': 'Descrição da meta:',
        'metaTargetValuePrompt': 'Valor alvo:',
        'metaDeadlinePrompt': 'Data limite (YYYY-MM-DD):',
        'goalCreated': 'Meta criada com sucesso!',
        'goalsSectionTitle': 'Definição de Metas',
        'newGoal': 'Nova Meta',
        'investmentsCenterTitle': 'Central de Investimentos',
        'newInvestment': 'Novo Investimento',
        'activeInvestments': 'Investimentos Ativos',
        'fixedCosts': 'Custos Fixos',
        'variableCosts': 'Custos Variáveis',
        'workingCapital': 'Capital de Giro',
        'monthlyValueLabel': 'Valor Mensal',
        'percentageOrValueLabel': 'Percentual ou Valor',
        'suppliersListTitle': 'Lista de Fornecedores',
        'newSupplier': 'Novo Fornecedor',
        'nameLabel': 'Nome',
        'income': 'Ganhos',
        'expenses': 'Gastos',
        'addTransaction': 'Adicionar Transação',
        'transactionHistory': 'Histórico de Transações',
        'myBusinesses': 'Meus Negócios',
        'newCompany': 'Nova Empresa',
        'reportsAndAnalysis': 'Relatórios e Análises',
        'monthlyComparison': 'Comparativo Mensal',
        'bimonthlyComparison': 'Comparativo Bimestral',
        'semesterComparison': 'Comparativo Semestral',
        'annualComparison': 'Comparativo Anual',
        'scenarioAnalysis': 'Análise de Cenários',
        'categoryDistribution': 'Distribuição por Categoria',
        'financialReport': 'Relatório Financeiro',
        'generatedAt': 'Gerado em',
        'generalSummary': 'Resumo Geral',
        'totalIncomeLabel': 'Total de Ganhos',
        'totalExpenseLabel': 'Total de Gastos',
        'balanceLabel': 'Saldo',
        'monthlyAverageExpense': 'Gasto Mensal Médio',
        'totalTransactionsLabel': 'Total de Transações',
        'expenseByCategory': 'Gasto por Categoria',
        'close': 'Fechar',
        'reportPdfDownloaded': 'Relatório em PDF baixado com sucesso!',
        'reportExcelDownloaded': 'Relatório em EXCEL baixado com sucesso!',
        'reportCsvDownloaded': 'Relatório em CSV baixado com sucesso!',
        'accountsManagement': 'Gestão de Contas',
        'receivableAccounts': 'Contas a Receber',
        'proLabore': 'Pró-Labore',
        'proLaboreMonthlyFixedLabel': 'Valor Mensal (Pró-Labore Fixo)',
        'setProLabore': 'Definir Pró-Labore',
        'capitalInitialExample': 'Ex: Caixa Inicial',
        'proLaboreConfigured': 'Pró-Labore Configurado',
        'monthlyValue': 'Valor Mensal',
        'annualValue': 'Anual',
        'calendarTitle': 'Calendário de Pagamentos e Recebimentos',
        'monthJanuary': 'Janeiro',
        'monthFebruary': 'Fevereiro',
        'monthMarch': 'Março',
        'monthApril': 'Abril',
        'monthMay': 'Maio',
        'monthJune': 'Junho',
        'monthJuly': 'Julho',
        'monthAugust': 'Agosto',
        'monthSeptember': 'Setembro',
        'monthOctober': 'Outubro',
        'monthNovember': 'Novembro',
        'monthDecember': 'Dezembro',
        'dayShortSun': 'Dom',
        'dayShortMon': 'Seg',
        'dayShortTue': 'Ter',
        'dayShortWed': 'Qua',
        'dayShortThu': 'Qui',
        'dayShortFri': 'Sex',
        'dayShortSat': 'Sab',
        'contact': 'Contato',
        'contactPlaceholder': 'Telefone/Email',
        'categoryPlaceholder': 'Produto/Serviço',
        'paymentTerms': 'Prazo de Pagamento',
        'paymentTermsPlaceholder': 'Ex: 30 dias',
        'myProfile': 'Meu Perfil',
        'companySlogan': 'Slogan da Empresa',
        'noSlogan': 'Nenhum slogan definido',
        'sloganInputPlaceholder': 'Digite o slogan da sua empresa...',
        'cancel': 'Cancelar',
        'save': 'Salvar',
        'edit': 'Editar',

        // Accessibility
        'audioReaderActive': 'Desativar leitor de áudio',
        'librasActive': 'Desativar intérprete de LIBRAS',
        'languageChanged': 'Idioma alterado para Português',
        'fontSizeMessage': 'Tamanho da fonte:',
        'librasWindowMessage': 'Intérprete de LIBRAS\n<small>Aguardando ativação de texto</small>',
        'type': 'Tipo',
        'gain': 'Ganho',
        'expense': 'Gasto',
        'category': 'Categoria',
        'selectCategory': 'Selecione uma categoria',
        'description': 'Descrição',
        'securityTitle': 'Segurança',
        'changePassword': 'Mudar Senha',
        'currentPassword': 'Senha Atual',
        'currentPasswordPlaceholder': 'Sua senha atual',
        'newPassword': 'Nova Senha',
        'newPasswordPlaceholder': 'Nova senha',
        'confirmNewPassword': 'Confirmar Nova Senha',
        'confirmPasswordPlaceholder': 'Confirme a senha',
        'confirm': 'Confirmar',
        'cancel': 'Cancelar',
        'passwordMinLength6': 'A nova senha deve ter pelo menos 6 caracteres!',
        'passwordsDontMatch': 'As senhas não conferem!',
        'passwordChanged': 'Senha alterada com sucesso!',
        'passwordChangeError': 'Erro ao alterar senha.',
        'companySloganUpdated': 'Slogan atualizado com sucesso!',
        'sales': 'Vendas',
        'costsAndExpenses': 'Custos e Despesas',
        'cashFlow': 'Fluxo de Caixa',
        'total': 'Total',
        'row-count': 'Linha',
        'price': 'Preço',
        'currency': 'Moeda',
        'percentage': 'Percentual',
        'download': 'Download',
        'upload': 'Upload',
        'search': 'Buscar',
        'open': 'Abrir',
        'close': 'Fechar',
        'edit': 'Editar',
        'delete': 'Deletar',
        'save': 'Salvar',
        'reset': 'Redefinir',
        'language': 'Idioma',
        'fontSize': 'Tamanho da Fonte',
        'theme': 'Tema',
        'profile': 'Perfil',
        'settings': 'Configurações',
        'notifications': 'Notificações',
        'help': 'Ajuda',
        'logout': 'Sair',
        'login': 'Entrar',
        'register': 'Cadastro',
        'update': 'Atualizar',
        'confirmExit': 'Deseja realmente sair?',
        'editProfile': 'Editar Perfil',
        'password': 'Senha',
        'email': 'Email',
        'name': 'Nome',
        'surname': 'Sobrenome',
        'address': 'Endereço',
        'examples': 'Ex: Salário, Compras...',
        'amount': 'Valor (R$)',
        'placeholderAmount': '0.00',
        'date': 'Data',
        'add': 'Adicionar',
        'filterByType': 'Filtrar por Tipo:',
        'all': 'Todos',
        'filterByCategory': 'Filtrar por Categoria:',
        'allCategories': 'Todas as categorias',
        'searchDescription': 'Buscar por descrição...',
        'clearFilters': 'Limpar Filtros',
        'passwordsDoNotMatch': 'As senhas não coincidem!',
        'passwordMinLength4': 'A senha deve ter no mínimo 4 caracteres',
        'accountCreated': 'Conta criada com sucesso!',
        'accountCreatedCheckEmail': 'Conta criada! Verifique seu email para confirmar o acesso.',
        'companyCreated': 'Empresa criada com sucesso! Selecione para ver dados específicos.',
        'companyUpdated': 'Empresa atualizada!',
        'confirmDeleteCompany': 'Deseja realmente deletar esta empresa?',
        'companyDeleted': 'Empresa deletada!',
        'accountPayableAdded': 'Conta a pagar adicionada!',
        'accountReceivableAdded': 'Conta a receber adicionada!',
        'proLaboreSet': 'Pró-Labore fixo definido em {amount}',
        'supplierDeleted': 'Fornecedor deletado!',
        'confirmDeleteSupplier': 'Deletar fornecedor?',
        'investmentRegistered': 'Investimento registrado!',
        'contact': 'Contato',
        'paymentTerms': 'Prazo',
        'supplierNamePrompt': 'Nome do fornecedor:',
        'supplierContactPrompt': 'Contato (telefone/email):',
        'supplierCategoryPrompt': 'Categoria (produto/serviço):',
        'supplierPaymentTermsPrompt': 'Prazo de pagamento (ex: 30 dias):',
        'supplierAdded': 'Fornecedor adicionado!',
        'noTransactions': 'Nenhuma transação registrada ainda',
        'noTransactionsFiltered': 'Nenhuma transação encontrada com os filtros aplicados',
        'fillAllFields': 'Por favor, preencha todos os campos',
        'valueGreaterZero': 'O valor deve ser maior que zero',
        'transactionAdded': 'Transação adicionada com sucesso!',
        'transactionRemoved': 'Transação removida com sucesso!',
        'confirmDeleteTransaction': 'Deseja realmente deletar esta transação?',
        'delete': 'Deletar',
        'cnpjCpfLabel': 'CNPJ/CPF',
        'balanceLabel': 'Saldo',
        'edit': 'Editar',
        'companySelected': '{company} selecionada!',
        'descriptionLabel': 'Descrição',
        'descriptionExample': 'Ex: Aluguel, Fornecedor...',
        'supplierLabel': 'Fornecedor',
        'supplierPlaceholder': 'Nome do fornecedor',
        'clientLabel': 'Cliente',
        'clientPlaceholder': 'Nome do cliente',
        'amountLabel': 'Valor',
        'amountPlaceholder': '0.00',
        'dueDateLabel': 'Data Vencimento',
        'dueDatePlaceholder': 'dd/mm/aaaa',
        'registerBtn': 'Registrar',
        'statusPending': 'Pendente',
        'statusPaid': 'Pago',
        'allCompanies': 'Todas as empresas',
        'noReportsCompany': 'Esta empresa não possui transações registradas para gerar relatórios.',
        'noReportsAny': 'Nenhuma empresa possui transações registradas para gerar relatórios.',
        'generateReport': 'Gerar Relatório',
        'scenarioAnalysisTitle': 'Análise de Cenários Financeiros',
        'currentBalanceLabel': 'Saldo Atual',
        'avgMonthlyExpenseLabel': 'Gasto Médio Mensal',
        'monthsAutonomyLabel': 'Meses de Autonomia',
        'optimisticScenarioLabel': 'Cenário Otimista (+15% de ganhos)',
        'pessimisticScenarioLabel': 'Cenário Pessimista (-15% de ganhos)',
        'autonomyLabel': 'Autonomia',
        'monthsLabel': 'meses',
        
        // Confirmations
        'confirmExit': 'Deseja realmente sair?',
        'confirmDeleteCompany': 'Deseja realmente deletar esta empresa?',
        'confirmDeleteSupplier': 'Deletar fornecedor?',
        'revokeAccessConfirm': 'Tem certeza que deseja revogar o acesso?',
        'loginWithAnotherAccount': 'Deseja fazer login com outra conta? Você será desconectado.',
        'deleteAccountConfirm': 'Tem certeza que deseja deletar sua conta? Esta ação é irreversível!',
        'deleteAccountFinalWarning': 'Esta é sua última chance! Todos os seus dados serão perdidos!',
        
        // Alerts
        'phoneFormatError': 'Digite o telefone no formato (65)99999-9999',
        'paymentTermsNumberError': 'Digite o prazo em dias (apenas números)',
        'companyNotFound': 'Empresa não encontrada.',
        'invalidEmail': 'Digite um email válido!',
        'cannotShareWithSelf': 'Você não pode compartilhar com você mesmo!',
        
        // Success messages
        'accountCreatedSuccess': 'Conta criada com sucesso!',
        'companyDeletedSuccess': 'Empresa deletada!',
        'supplierAdded': 'Fornecedor adicionado!',
        'supplierDeletedSuccess': 'Fornecedor deletado!',
        'investmentRegisteredSuccess': 'Investimento registrado!',
        'reportExcelDownloadedSuccess': 'Relatório em EXCEL baixado com sucesso!',
        'reportCsvDownloadedSuccess': 'Relatório em CSV baixado com sucesso!',
        'sloganUpdatedSuccess': 'Slogan atualizado com sucesso!',
        'accessRevokedSuccess': 'Acesso revogado!',
        'accountDeletedSuccess': 'Conta deletada com sucesso!',
        'accountPayableAddedSuccess': 'Conta a pagar adicionada!',
        'accountReceivableAddedSuccess': 'Conta a receber adicionada!',

    },
    'en': {
        // Accessibility
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
        'calendar': 'Calendar',
        'profile': 'Profile',
        'companyLabel': 'Company',
        'totalBalanceTitle': 'Total Balance',
        'noCompanies': 'No company registered. Create one to start!',
        'noCompaniesYet': 'No company registered yet.',
        'companiesLogged': 'Companies logged',
        'searchCompany': 'Search company...',
        'noGoals': 'No goals created',
        'goalProgress': 'complete',
        'goalsSectionTitle': 'Goals Definition',
        'newGoal': 'New Goal',
        'investmentsCenterTitle': 'Investments Center',
        'newInvestment': 'New Investment',
        'activeInvestments': 'Active Investments',
        'fixedCosts': 'Fixed Costs',
        'variableCosts': 'Variable Costs',
        'workingCapital': 'Working Capital',
        'monthlyValueLabel': 'Monthly Value',
        'percentageOrValueLabel': 'Percentage or Value',
        'suppliersListTitle': 'Suppliers List',
        'newSupplier': 'New Supplier',
        'nameLabel': 'Name',
        'income': 'Income',
        'expenses': 'Expenses',
        'addTransaction': 'Add Transaction',
        'transactionHistory': 'Transaction History',
        'myBusinesses': 'My Businesses',
        'newCompany': 'New Company',
        'reportsAndAnalysis': 'Reports & Analysis',
        'monthlyComparison': 'Monthly Comparison',
        'bimonthlyComparison': 'Bimonthly Comparison',
        'semesterComparison': 'Semester Comparison',
        'annualComparison': 'Annual Comparison',
        'scenarioAnalysis': 'Scenario Analysis',
        'categoryDistribution': 'Category Distribution',
        'financialReport': 'Financial Report',
        'generatedAt': 'Generated at',
        'generalSummary': 'General Summary',
        'totalIncomeLabel': 'Total Income',
        'totalExpenseLabel': 'Total Expense',
        'balanceLabel': 'Balance',
        'monthlyAverageExpense': 'Monthly Average Expense',
        'totalTransactionsLabel': 'Total Transactions',
        'expenseByCategory': 'Expense by Category',
        'close': 'Close',
        'reportPdfDownloaded': 'PDF report downloaded successfully!',
        'reportExcelDownloaded': 'Excel report downloaded successfully!',
        'reportCsvDownloaded': 'CSV report downloaded successfully!',
        'accountsManagement': 'Accounts Management',
        'payableAccounts': 'Payable Accounts',
        'receivableAccounts': 'Receivable Accounts',
        'proLabore': 'Pro-Labore',
        'proLaboreMonthlyFixedLabel': 'Monthly Value (Fixed Pro-Labore)',
        'setProLabore': 'Set Pro-Labore',
        'capitalInitialExample': 'Ex: Initial Cash',
        'proLaboreConfigured': 'Pro-Labore Configured',
        'monthlyValue': 'Monthly Value',
        'annualValue': 'Annual',
        'calendarTitle': 'Payments and Receivables Calendar',
        'monthJanuary': 'January',
        'monthFebruary': 'February',
        'monthMarch': 'March',
        'monthApril': 'April',
        'monthMay': 'May',
        'monthJune': 'June',
        'monthJuly': 'July',
        'monthAugust': 'August',
        'monthSeptember': 'September',
        'monthOctober': 'October',
        'monthNovember': 'November',
        'monthDecember': 'December',
        'dayShortSun': 'Sun',
        'dayShortMon': 'Mon',
        'dayShortTue': 'Tue',
        'dayShortWed': 'Wed',
        'dayShortThu': 'Thu',
        'dayShortFri': 'Fri',
        'dayShortSat': 'Sat',
        'contact': 'Contact',
        'contactPlaceholder': 'Phone/Email',
        'categoryPlaceholder': 'Product/Service',
        'paymentTerms': 'Payment Terms',
        'paymentTermsPlaceholder': 'Ex: 30 days',
        'myProfile': 'My Profile',
        'companySlogan': 'Company Slogan',
        'noSlogan': 'No slogan set',
        'sloganInputPlaceholder': 'Enter your company slogan...',
        'cancel': 'Cancel',
        'save': 'Save',
        'edit': 'Edit',
        'type': 'Type',
        'gain': 'Gain',
        'expense': 'Expense',
        'category': 'Category',
        'selectCategory': 'Select a category',
        'description': 'Description',
        'securityTitle': 'Security',
        'changePassword': 'Change Password',
        'currentPassword': 'Current Password',
        'currentPasswordPlaceholder': 'Your current password',
        'newPassword': 'New Password',
        'newPasswordPlaceholder': 'New password',
        'confirmNewPassword': 'Confirm New Password',
        'confirmPasswordPlaceholder': 'Confirm password',
        'confirm': 'Confirm',
        'cancel': 'Cancel',
        'passwordMinLength6': 'New password must be at least 6 characters!',
        'passwordsDontMatch': 'Passwords do not match!',
        'passwordChanged': 'Password changed successfully!',
        'passwordChangeError': 'Error changing password.',
        'companySloganUpdated': 'Slogan updated successfully!',

        'examples': 'Ex: Salary, Shopping...',
        'amount': 'Amount (R$)',
        'placeholderAmount': '0.00',
        'date': 'Date',
        'add': 'Add',
        'filterByType': 'Filter by type:',
        'all': 'All',
        'filterByCategory': 'Filter by category:',
        'allCategories': 'All categories',
        'searchDescription': 'Search by description...',
        'clearFilters': 'Clear Filters',
        'passwordsDoNotMatch': 'Passwords do not match!',
        'passwordMinLength4': 'Password must be at least 4 characters',
        'accountCreated': 'Account created successfully!',
        'accountCreatedCheckEmail': 'Account created! Check your email to confirm access.',
        'companyCreated': 'Company created successfully! Select it to view specific data.',
        'companyUpdated': 'Company updated!',
        'confirmDeleteCompany': 'Do you really want to delete this company?',
        'companyDeleted': 'Company deleted!',
        'accountPayableAdded': 'Payable account added!',
        'accountReceivableAdded': 'Receivable account added!',
        'proLaboreSet': 'Fixed Pro-Labore set to {amount}',
        'supplierDeleted': 'Supplier deleted!',
        'confirmDeleteSupplier': 'Delete supplier?',
        'investmentRegistered': 'Investment registered!',
        'noTransactions': 'No transactions recorded yet',
        'noTransactionsFiltered': 'No transactions found with the applied filters',
        'fillAllFields': 'Please fill in all fields',
        'valueGreaterZero': 'Value must be greater than zero',
        'transactionAdded': 'Transaction added successfully!',
        'transactionRemoved': 'Transaction removed successfully!',
        'confirmDeleteTransaction': 'Do you really want to delete this transaction?',
        'delete': 'Delete',
        'cnpjCpfLabel': 'CNPJ/CPF',
        'balanceLabel': 'Balance',
        'edit': 'Edit',
        'companySelected': '{company} selected!',
        'descriptionLabel': 'Description',
        'descriptionExample': 'Ex: Rent, Supplier...',
        'supplierLabel': 'Supplier',
        'supplierPlaceholder': 'Supplier name',
        'clientLabel': 'Client',
        'clientPlaceholder': 'Client name',
        'amountLabel': 'Amount',
        'amountPlaceholder': '0.00',
        'dueDateLabel': 'Due date',
        'dueDatePlaceholder': 'yyyy-mm-dd',
        'registerBtn': 'Register',
        'statusPending': 'Pending',
        'statusPaid': 'Paid',
        'allCompanies': 'All companies',
        'noReportsCompany': 'This company has no transactions recorded to generate reports.',
        'noReportsAny': 'No company has transactions recorded to generate reports.',
        'generateReport': 'Generate Report',
        'scenarioAnalysisTitle': 'Financial Scenario Analysis',
        'currentBalanceLabel': 'Current Balance',
        'avgMonthlyExpenseLabel': 'Average Monthly Expense',
        'monthsAutonomyLabel': 'Months of Autonomy',
        'optimisticScenarioLabel': 'Optimistic Scenario (+15% income)',
        'pessimisticScenarioLabel': 'Pessimistic Scenario (-15% income)',
        'autonomyLabel': 'Autonomy',
        'monthsLabel': 'months',
        
        // Confirmations
        'confirmExit': 'Do you really want to exit?',
        'confirmDeleteCompany': 'Do you really want to delete this company?',
        'confirmDeleteSupplier': 'Delete supplier?',
        'revokeAccessConfirm': 'Are you sure you want to revoke access?',
        'loginWithAnotherAccount': 'Do you want to login with another account? You will be logged out.',
        'deleteAccountConfirm': 'Are you sure you want to delete your account? This action is irreversible!',
        'deleteAccountFinalWarning': 'This is your last chance! All your data will be lost!',
        
        // Alerts
        'phoneFormatError': 'Enter the phone in format (65)99999-9999',
        'paymentTermsNumberError': 'Enter the payment terms in days (numbers only)',
        'companyNotFound': 'Company not found.',
        'invalidEmail': 'Enter a valid email!',
        'cannotShareWithSelf': 'You cannot share with yourself!',
        
        // Success messages
        'accountCreatedSuccess': 'Account created successfully!',
        'companyDeletedSuccess': 'Company deleted!',
        'supplierAdded': 'Supplier added!',
        'supplierDeletedSuccess': 'Supplier deleted!',
        'investmentRegisteredSuccess': 'Investment registered!',
        'reportExcelDownloadedSuccess': 'Excel report downloaded successfully!',
        'reportCsvDownloadedSuccess': 'CSV report downloaded successfully!',
        'sloganUpdatedSuccess': 'Slogan updated successfully!',
        'accessRevokedSuccess': 'Access revoked!',
        'accountDeletedSuccess': 'Account deleted successfully!',
        'accountPayableAddedSuccess': 'Payable account added!',
        'accountReceivableAddedSuccess': 'Receivable account added!',

        // Accessibility
        'audioReaderActive': 'Deactivate audio reader',
        'librasActive': 'Deactivate LIBRAS interpreter',
        'languageChanged': 'Language changed to English',
        'fontSizeMessage': 'Font size:',
        'librasWindowMessage': 'LIBRAS interpreter\n<small>Waiting for text activation</small>'
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

function applyLanguage(lang, options = { showMessage: false, persist: true }) {
    currentLanguage = lang;
    if (options.persist) {
        storageSet('language', lang);
    }
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'pt-BR');

    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.getAttribute('data-lang') === lang) {
            opt.classList.add('active');
        }
    });

    const dropdown = document.getElementById('langDropdown');
    if (dropdown) dropdown.style.display = 'none';

    if (audioReaderActive && speechSynthesisUtterance) {
        speechSynthesisUtterance.lang = lang === 'en' ? 'en-US' : 'pt-BR';
    }

    updateUILanguage();

    const businessesTitle = document.querySelector('[data-i18n="myBusinesses"]');
    if (businessesTitle) {
        businessesTitle.textContent = lang === 'en' ? 'My Businesses' : 'Meus Negócios';
    }
    const newCompanyBtn = document.querySelector('[data-i18n="newCompany"]');
    if (newCompanyBtn) {
        newCompanyBtn.textContent = lang === 'en' ? 'New Company' : 'Nova Empresa';
    }

    const isEnglish = lang === 'en';
    const textMap = [
        { selector: '[data-i18n="addTransaction"]', pt: 'Adicionar Transação', en: 'Add Transaction' },
        { selector: 'label[for="transType"]', pt: 'Tipo', en: 'Type' },
        { selector: 'label[for="transCategory"]', pt: 'Categoria', en: 'Category' },
        { selector: 'label[for="transDescription"]', pt: 'Descrição', en: 'Description' },
        { selector: 'label[for="transEmpresa"]', pt: 'Empresa', en: 'Company' },
        { selector: 'label[for="transAmount"]', pt: 'Valor (R$)', en: 'Amount (R$)' },
        { selector: 'label[for="transDate"]', pt: 'Data', en: 'Date' },
        { selector: '[data-i18n="transactionHistory"]', pt: 'Histórico de Transações', en: 'Transaction History' },
        { selector: 'label[for="filterType"]', pt: 'Filtrar por Tipo:', en: 'Filter by type:' },
        { selector: 'label[for="filterCategory"]', pt: 'Filtrar por Categoria:', en: 'Filter by category:' },
        { selector: '#clearFilters', pt: 'Limpar Filtros', en: 'Clear Filters' }
    ];
    textMap.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) el.textContent = isEnglish ? item.en : item.pt;
    });

    const transDescriptionInput = document.getElementById('transDescription');
    if (transDescriptionInput) {
        transDescriptionInput.placeholder = isEnglish ? 'Ex: Salary, Shopping...' : 'Ex: Salário, Compras...';
    }

    const transType = document.getElementById('transType');
    if (transType) {
        const ganho = transType.querySelector('option[value="ganho"]');
        const gasto = transType.querySelector('option[value="gasto"]');
        if (ganho) ganho.textContent = isEnglish ? 'Gain' : 'Ganho';
        if (gasto) gasto.textContent = isEnglish ? 'Expense' : 'Gasto';
    }

    const transCategory = document.getElementById('transCategory');
    if (transCategory) {
        const placeholder = transCategory.querySelector('option[value=""]');
        if (placeholder) {
            placeholder.textContent = isEnglish ? 'Select a category' : 'Selecione uma categoria';
        }
    }

    const addBtn = document.querySelector('#transactionForm .btn.btn-success span');
    if (addBtn) {
        addBtn.textContent = isEnglish ? 'Add' : 'Adicionar';
    }

    const filterType = document.getElementById('filterType');
    if (filterType) {
        const all = filterType.querySelector('option[value=""]');
        const ganho = filterType.querySelector('option[value="ganho"]');
        const gasto = filterType.querySelector('option[value="gasto"]');
        if (all) all.textContent = isEnglish ? 'All' : 'Todos';
        if (ganho) ganho.textContent = isEnglish ? 'Gain' : 'Ganhos';
        if (gasto) gasto.textContent = isEnglish ? 'Expense' : 'Gastos';
    }

    const filterCategory = document.getElementById('filterCategory');
    if (filterCategory) {
        const allCategories = filterCategory.querySelector('option[value=""]');
        if (allCategories) {
            allCategories.textContent = isEnglish ? 'All categories' : 'Todas as categorias';
        }
    }

    const searchInput = document.getElementById('searchTransaction');
    if (searchInput) {
        searchInput.placeholder = isEnglish ? 'Search by description...' : 'Buscar por descrição...';
    }

    if (options.showMessage) {
        showSuccessMessage(t('languageChanged'));
    }
}

function changeLanguage(lang) {
    applyLanguage(lang, { showMessage: true, persist: true });
}

function updateUILanguage() {
    const activeLangBtn = document.querySelector('.lang-option.active');
    if (activeLangBtn) {
        const activeLang = activeLangBtn.getAttribute('data-lang');
        if (activeLang === 'pt-BR' || activeLang === 'en') {
            currentLanguage = activeLang;
        }
    }

    // Auto translate via data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = typeof t === 'function' ? t(key) : (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]);
        if (translated && translated !== key) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.hasAttribute('placeholder')) {
                    el.placeholder = translated;
                } else if (el.type === 'button' || el.type === 'submit') {
                    el.value = translated;
                }
            } else {
                el.textContent = translated;
            }
        }
    });

    const audioBtn = document.getElementById('audioReaderBtn');
    if (audioBtn) {
        audioBtn.title = audioReaderActive ? t('audioReaderActive') : t('audioReaderTitle');
    }

    // Se botao libras removido, não faz nada, se manter ativo, atualiza também
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

    // Navegação
    const navItems = [
        { selector: '.nav-link[data-section="dashboard"]', key: 'dashboard' },
        { selector: '.nav-link[data-section="empresas"]', key: 'companies' },
        { selector: '.nav-link[data-section="transacoes"]', key: 'transactions' },
        { selector: '.nav-link[data-section="relatorios"]', key: 'reports' },
        { selector: '.nav-link[data-section="contas"]', key: 'payable' },
        { selector: '.nav-link[data-section="metas"]', key: 'goals' },
        { selector: '.nav-link[data-section="investimentos"]', key: 'investments' },
        { selector: '.nav-link[data-section="fornecedores"]', key: 'suppliers' },
        { selector: '.nav-link[data-section="calendario"]', key: 'calendar' },
        { selector: '.nav-link[data-section="perfil"]', key: 'profile' }
    ];

    navItems.forEach(item => {
        const textEl = document.querySelector(`${item.selector} .nav-text`);
        if (textEl) {
            textEl.textContent = t(item.key);
        } else {
            const el = document.querySelector(item.selector);
            if (el) el.textContent = t(item.key);
        }
    });

    // Formulários de login/cadastro
    const textMap = [
        { selector: 'label[for="loginEmail"]', key: 'email' },
        { selector: 'label[for="loginPassword"]', key: 'password' },
        { selector: 'label[for="registerName"]', key: 'name' },
        { selector: 'label[for="registerEmail"]', key: 'email' },
        { selector: 'label[for="registerPassword"]', key: 'password' },
        { selector: 'label[for="registerPassword2"]', key: 'confirmPassword' }
    ];

    textMap.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) el.textContent = t(item.key);
    });

    const placeholderMap = [
        { selector: '#loginEmail', key: 'yourEmail' },
        { selector: '#loginPassword', key: 'yourPassword' },
        { selector: '#registerName', key: 'name' },
        { selector: '#registerEmail', key: 'yourEmail' },
        { selector: '#registerPassword', key: 'createPassword' },
        { selector: '#registerPassword2', key: 'confirmPwd' }
    ];

    placeholderMap.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) el.placeholder = t(item.key);
    });

    const buttonMap = [
        { selector: '#loginBtn', key: 'login' },
        { selector: '#registerBtn', key: 'register' },
        { selector: '.toggle-form a', key: 'goLogin' }
    ];

    buttonMap.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) el.textContent = t(item.key);
    });

    const librasText = document.querySelector('.libras-text');
    if (librasText) {
        librasText.innerHTML = t('librasWindowMessage');
    }

    // Translating all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        if (!key) return;
        const translated = t(key);
        if (!translated) return;

        const tag = element.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') {
            element.placeholder = translated;
        } else {
            element.innerHTML = translated;
        }
    });

    // Re-render dynamic UI parts that depend on language key values
    updateCategoryOptions();
    renderTransactions();
    updateDashboard();

    // Re-render the calendar header/weekdays if the calendar section is visible (for language change)
    const calendarioSection = document.getElementById('calendario-section');
    if (calendarioSection && calendarioSection.style.display !== 'none') {
        const today = new Date();
        renderCalendar(today.getFullYear(), today.getMonth());
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
let capitalGiro = [];
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

function getLastUserEmail() {
    return storageGet('lastUserEmail');
}

async function hashPassword(value) {
    if (!('crypto' in window) || !window.crypto.subtle) {
        return `plain:${value}`;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(digest));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `sha256:${hashHex}`;
}

function getStoredPasswordHash(email) {
    return storageGet(`user_pass_${email}`);
}

async function verifyPassword(email, password) {
    const stored = getStoredPasswordHash(email);
    if (!stored) return false;
    const current = await hashPassword(password);
    return stored === current;
}

function setLoginEmail(email) {
    const input = document.getElementById('loginEmail');
    if (input && email) {
        input.value = email;
    }
}

function updateLoginEmailVisibility() {
    const emailGroup = document.getElementById('loginEmailGroup');
    const emailHint = document.getElementById('loginEmailHint');
    const lastEmail = getLastUserEmail();
    if (emailGroup) {
        emailGroup.style.display = lastEmail ? 'none' : 'block';
    }
    if (emailHint) {
        emailHint.style.display = lastEmail ? 'flex' : 'none';
    }
    if (lastEmail) {
        setLoginEmail(lastEmail);
    }
}

// ==================== INICIALIZAÇÃO ====================
async function initApp() {
    const loginScreen = document.getElementById('loginScreen');
    const mainScreen = document.getElementById('mainScreen');
    if (loginScreen) {
        loginScreen.classList.remove('active');
        loginScreen.style.display = 'none';
    }
    if (mainScreen) {
        mainScreen.classList.remove('active');
        mainScreen.style.display = 'none';
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations()
            .then((regs) => Promise.all(regs.map((reg) => reg.unregister())))
            .then(() => console.log('[App] Service Worker desativado para desenvolvimento'))
            .catch((error) => console.log('[App] Erro ao desativar SW:', error));
    }

    initializeTheme();
    initAccessibility();
    applyLanguage('pt-BR', { showMessage: false, persist: true });

    setupEventListeners();

    try {
        if (DEMO_AUTH) {
            const stored = getStoredUser();
            const lastEmail = stored?.email || getLastUserEmail();
            if (lastEmail) {
                setLoginEmail(lastEmail);
            }
            updateLoginEmailVisibility();
            setTimeout(() => transitionFromSplash('login'), 1600);
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

    document.querySelectorAll('.lang-option').forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            const lang = btn.getAttribute('data-lang') || 'pt-BR';
            applyLanguage(lang, { showMessage: true, persist: true });
        });
    });

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const handleLoginEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleLogin(event);
        }
    };
    if (loginEmailInput) {
        loginEmailInput.addEventListener('keydown', handleLoginEnter);
    }
    if (loginPasswordInput) {
        loginPasswordInput.addEventListener('keydown', handleLoginEnter);
    }

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

    const empresaForm = document.getElementById('empresaForm');
    if (empresaForm) {
        empresaForm.addEventListener('submit', handleEmpresaFormSubmit);
    }

    const empresaDocInput = document.getElementById('empresaDocumento');
    if (empresaDocInput) {
        empresaDocInput.addEventListener('input', () => {
            empresaDocInput.value = formatDocumento(empresaDocInput.value);
        });
    }

    const closeEmpresaBtn = document.getElementById('closeEmpresaModal');
    if (closeEmpresaBtn) {
        closeEmpresaBtn.addEventListener('click', closeEmpresaModal);
    }

    const cancelEmpresaBtn = document.getElementById('cancelEmpresaModal');
    if (cancelEmpresaBtn) {
        cancelEmpresaBtn.addEventListener('click', closeEmpresaModal);
    }

    const empresaModal = document.getElementById('empresaModal');
    if (empresaModal) {
        empresaModal.addEventListener('click', (event) => {
            if (event.target === empresaModal) {
                closeEmpresaModal();
            }
        });
    }

    if (document.getElementById('addMetaBtn')) {
        document.getElementById('addMetaBtn').addEventListener('click', openMetaModal);
    }

    if (document.getElementById('addInvestimentoBtn')) {
        document.getElementById('addInvestimentoBtn').addEventListener('click', openInvestimentoModal);
    }

    if (document.getElementById('formCustosFixos')) {
        document.getElementById('formCustosFixos').addEventListener('submit', handleAddCustosFixos);
    }

    if (document.getElementById('formCustosVariaveis')) {
        document.getElementById('formCustosVariaveis').addEventListener('submit', handleAddCustosVariaveis);
    }

    if (document.getElementById('formCapitalGiro')) {
        document.getElementById('formCapitalGiro').addEventListener('submit', handleAddCapitalGiro);
    }

    const metasEmpresa = document.getElementById('metasEmpresa');
    if (metasEmpresa) {
        metasEmpresa.addEventListener('change', () => {
            renderMetas();
        });
    }

    const investimentosEmpresa = document.getElementById('investimentosEmpresa');
    if (investimentosEmpresa) {
        investimentosEmpresa.addEventListener('change', () => {
            renderInvestimentos();
        });
    }

    const custosFixosEmpresa = document.getElementById('custosFixosEmpresa');
    if (custosFixosEmpresa) {
        custosFixosEmpresa.addEventListener('change', () => {
            renderCustosFixos();
        });
    }

    const custosVariaveisEmpresa = document.getElementById('custosVariaveisEmpresa');
    if (custosVariaveisEmpresa) {
        custosVariaveisEmpresa.addEventListener('change', () => {
            renderCustosVariaveis();
        });
    }

    const capitalGiroEmpresa = document.getElementById('capitalGiroEmpresa');
    if (capitalGiroEmpresa) {
        capitalGiroEmpresa.addEventListener('change', () => {
            renderCapitalGiro();
        });
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

    const reportsFilter = document.getElementById('reportsEmpresaFilter');
    if (reportsFilter) {
        reportsFilter.addEventListener('change', () => {
            renderReportsByCompany();
        });
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

    if (document.getElementById('formFornecedor')) {
        document.getElementById('formFornecedor').addEventListener('submit', handleAddFornecedor);
    }

    const fornecedorContato = document.getElementById('fornecedorContato');
    if (fornecedorContato) {
        fornecedorContato.addEventListener('input', () => {
            fornecedorContato.value = formatPhoneValue(fornecedorContato.value);
        });
    }
}

// ==================== AUTENTICAÇÃO ====================
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const effectiveEmail = email || getLastUserEmail();

    if (!effectiveEmail || !password) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    if (DEMO_AUTH) {
        const isValid = await verifyPassword(effectiveEmail, password);
        if (!isValid) {
            alert('Senha inválida!');
            return;
        }
        clearLegacyAuthStorage();
        currentUser = { email: effectiveEmail, name: effectiveEmail.split('@')[0] || 'Usuário' };
        storageSet('currentUser', JSON.stringify(currentUser));
        storageSet('lastUserEmail', effectiveEmail);
        loadUserData();
        showMainScreen();
        clearLoginForm();
        return;
    }

    try {
        await Auth.login(effectiveEmail, password);
        const user = await Auth.getCurrentUser();
        clearLegacyAuthStorage();
        currentUser = {
            email: user?.email || effectiveEmail,
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
        alert(t('fillAllFields'));
        return;
    }

    if (password !== password2) {
        alert(t('passwordsDoNotMatch'));
        return;
    }

    if (password.length < 4) {
        alert(t('passwordMinLength4'));
        return;
    }

    if (DEMO_AUTH) {
        const passHash = await hashPassword(password);
        storageSet(`user_pass_${email}`, passHash);
        storageSet('lastUserEmail', email);
        clearRegisterForm();
        showSuccessMessage('Conta criada! Faça login com sua senha.');
        toggleLoginRegister(e);
        updateLoginEmailVisibility();
        return;
    }

    try {
        await Auth.register({ name, email, password, skipAutoLogin: true });
        const session = await Auth.getSession();
        if (!session) {
            showSuccessMessage(t('accountCreatedCheckEmail'));
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
        showSuccessMessage(t('accountCreatedSuccess'));
    } catch (error) {
        alert(error.message || 'Erro ao criar conta.');
    }
}

async function handleLogout() {
    if (confirm(t('confirmExit'))) {
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
    updateTransactionEmpresaOptions();
    updateMetasEmpresaOptions();
    updateInvestimentosEmpresaOptions();
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
        updateTransactionEmpresaOptions();
        renderTransactions();
    } else if (section === 'empresas') {
        renderEmpresas();
    } else if (section === 'metas') {
        updateMetasEmpresaOptions();
        renderMetas();
    } else if (section === 'investimentos') {
        updateInvestimentosEmpresaOptions();
        renderInvestimentos();
        renderCustosFixos();
        renderCustosVariaveis();
        renderCapitalGiro();
    } else if (section === 'fornecedores') {
        renderFornecedores();
    } else if (section === 'perfil') {
        renderProfile();
    } else if (section === 'relatorios') {
        updateReportsEmpresaOptions();
        setTimeout(initCharts, 300);
    } else if (section === 'contas') {
        updateContasEmpresaOptions();
        loadContasData();
    } else if (section === 'calendario') {
        initCalendar();
    }
}

function isSectionVisible(sectionId) {
    const el = document.getElementById(sectionId);
    return !!el && el.style.display !== 'none';
}

// ==================== EMPRESAS ====================
function renderEmpresas() {
    const container = document.getElementById('empresasList');
    if (!container) return;

    if (empresas.length === 0) {
        container.innerHTML = `<p class="empty-message">${t('noCompanies')}</p>`;
        return;
    }

    container.innerHTML = empresas.map(emp => {
        const income = transactions
            .filter(t => t.type === 'ganho' && isSameEmpresaId(t.empresaId, emp.id))
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === 'gasto' && isSameEmpresaId(t.empresaId, emp.id))
            .reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expenses;

        return `
            <div class="empresa-card" onclick="selectEmpresa(${emp.id})">
                <h3>${emp.nome}</h3>
                <p class="text-muted">${emp.tipo}</p>
                <p><strong>${t('cnpjCpfLabel')}:</strong> ${emp.documento}</p>
                <p><strong>${t('balanceLabel')}:</strong> ${formatCurrency(balance)}</p>
                <div class="card-actions">
                    <button class="btn btn-small" onclick="editEmpresa(${emp.id}, event)"><i class="fas fa-edit"></i> ${t('edit')}</button>
                    <button class="btn btn-small btn-danger" onclick="deleteEmpresa(${emp.id}, event)"><i class="fas fa-trash"></i> ${t('delete')}</button>
                </div>
            </div>
        `;
    }).join('');
}

function selectEmpresa(id) {
    currentEmpresa = empresas.find(e => e.id === id);
    loadUserData();
    updateDashboard();
    if (currentEmpresa) {
        showSuccessMessage(t('companySelected').replace('{company}', currentEmpresa.nome));
    }
}

function openEmpresaModal() {
    const modal = document.getElementById('empresaModal');
    if (!modal) return;
    const form = document.getElementById('empresaForm');
    const nameInput = document.getElementById('empresaNome');
    const typeSelect = document.getElementById('empresaTipo');
    const docInput = document.getElementById('empresaDocumento');
    if (form) form.reset();
    if (typeSelect) typeSelect.value = '';
    if (docInput) docInput.value = '';
    modal.style.display = 'flex';
    if (nameInput) nameInput.focus();
}

function closeEmpresaModal() {
    const modal = document.getElementById('empresaModal');
    if (modal) modal.style.display = 'none';
}

function formatDocumento(value) {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    if (digits.length > 11) {
        return digits;
    }
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function handleEmpresaFormSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('empresaNome');
    const typeSelect = document.getElementById('empresaTipo');
    const docInput = document.getElementById('empresaDocumento');
    if (!nameInput || !typeSelect || !docInput) return;

    const nome = nameInput.value.trim();
    const tipo = typeSelect.value;
    const rawDigits = docInput.value.replace(/\D/g, '');
    const documento = formatDocumento(rawDigits);

    if (!nome || !tipo) {
        alert('Preencha todos os campos.');
        return;
    }

    if (rawDigits.length !== 11 && rawDigits.length !== 14) {
        alert('Digite 11 numeros para CPF ou 14 numeros para CNPJ.');
        return;
    }

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
    saveUserData();
    renderEmpresas();
    updateTransactionEmpresaOptions();
    updateContasEmpresaOptions();
    updateDashboard();
    if (isSectionVisible('relatorios-section')) {
        updateReportsEmpresaOptions();
        renderReportsByCompany();
    }
    closeEmpresaModal();
    showSuccessMessage('Empresa criada com sucesso! Selecione para ver dados específicos.');
}

function editEmpresa(id, e) {
    if (e) e.stopPropagation();
    const emp = empresas.find(e => e.id === id);
    if (!emp) return;
    const nome = prompt('Novo nome:', emp.nome);
    if (nome !== null) {
        const trimmed = nome.trim();
        if (!trimmed) return;
        emp.nome = trimmed;
        saveUserData();
        renderEmpresas();
        updateTransactionEmpresaOptions();
        updateContasEmpresaOptions();
        if (isSectionVisible('relatorios-section')) {
            updateReportsEmpresaOptions();
            renderReportsByCompany();
        }
        showSuccessMessage(t('companyUpdated'));
    }
}

function deleteEmpresa(id, e) {
    if (e) e.stopPropagation();
    if (confirm(t('confirmDeleteCompany'))) {
        empresas = empresas.filter(e => e.id !== id);
        if (currentEmpresa?.id === id) currentEmpresa = null;
        saveUserData();
        renderEmpresas();
        updateTransactionEmpresaOptions();
        updateContasEmpresaOptions();
        if (isSectionVisible('relatorios-section')) {
            updateReportsEmpresaOptions();
            renderReportsByCompany();
        }
        showSuccessMessage(t('companyDeletedSuccess'));
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
    const empresaSelect = document.getElementById('transEmpresa');
    const selectedEmpresaId = empresaSelect && empresaSelect.value ? parseInt(empresaSelect.value, 10) : null;
    const empresaId = selectedEmpresaId || currentEmpresa?.id || getFallbackEmpresaId();

    if (!category || !description || !amount || !date) {
        alert(t('fillAllFields'));
        return;
    }

    if (amount <= 0) {
        alert(t('valueGreaterZero'));
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
        empresaId,
        fixed: false,
        variable: false
    };

    transactions.push(transaction);
    saveUserData();
    renderTransactions();
    updateDashboard();
    if (isSectionVisible('relatorios-section')) {
        renderReportsByCompany();
    }

    document.getElementById('transactionForm').reset();
    setTodayDate();
    updateCategoryOptions();
    updateTransactionEmpresaOptions();
    showSuccessMessage(t('transactionAdded'));
}

function updateTransactionEmpresaOptions() {
    const group = document.getElementById('transEmpresaGroup');
    const select = document.getElementById('transEmpresa');
    const label = document.getElementById('transEmpresaLabel');
    if (!group || !select) return;

    if (!empresas || empresas.length === 0) {
        group.style.display = 'none';
        select.innerHTML = '';
        if (label) label.style.display = 'none';
        return;
    }

    if (empresas.length === 1) {
        const only = empresas[0];
        group.style.display = 'none';
        select.innerHTML = `<option value="${only.id}">${only.nome}</option>`;
        if (label) {
            label.textContent = `Empresa selecionada: ${only.nome}`;
            label.style.display = 'block';
        }
        return;
    }

    group.style.display = 'block';
    const options = empresas
        .map(emp => `<option value="${emp.id}">${emp.nome}</option>`)
        .join('');
    select.innerHTML = options;

    const fallbackId = currentEmpresa?.id || getFallbackEmpresaId();
    if (fallbackId) {
        select.value = String(fallbackId);
    }

    if (label) {
        const selected = empresas.find(emp => String(emp.id) === select.value);
        label.textContent = selected ? `Empresa selecionada: ${selected.nome}` : '';
        label.style.display = selected ? 'block' : 'none';
    }
}

function getSelectedEmpresaId(selectId) {
    const select = document.getElementById(selectId);
    if (!select || !select.value) return null;
    const value = parseInt(select.value, 10);
    return Number.isNaN(value) ? null : value;
}

function resolveEmpresaId(selectId) {
    return getSelectedEmpresaId(selectId) || currentEmpresa?.id || getFallbackEmpresaId();
}

function getEmpresaNameById(empresaId) {
    if (!empresaId) return 'Sem empresa';
    const empresa = empresas.find(emp => isSameEmpresaId(emp.id, empresaId));
    return empresa ? empresa.nome : 'Sem empresa';
}

function updateInvestimentosEmpresaOptions() {
    const groups = [
        { groupId: 'investimentosEmpresaGroup', selectId: 'investimentosEmpresa' },
        { groupId: 'custosFixosEmpresaGroup', selectId: 'custosFixosEmpresa' },
        { groupId: 'custosVariaveisEmpresaGroup', selectId: 'custosVariaveisEmpresa' },
        { groupId: 'capitalGiroEmpresaGroup', selectId: 'capitalGiroEmpresa' }
    ];

    if (!empresas || empresas.length === 0) {
        groups.forEach(({ groupId, selectId }) => {
            const group = document.getElementById(groupId);
            const select = document.getElementById(selectId);
            if (group) group.style.display = 'none';
            if (select) select.innerHTML = '';
        });
        return;
    }

    const shouldShow = empresas.length > 1;
    const options = empresas
        .map(emp => `<option value="${emp.id}">${emp.nome}</option>`)
        .join('');

    groups.forEach(({ groupId, selectId }) => {
        const group = document.getElementById(groupId);
        const select = document.getElementById(selectId);
        if (!group || !select) return;
        group.style.display = shouldShow ? 'block' : 'none';
        select.innerHTML = options;

        const fallbackId = currentEmpresa?.id || getFallbackEmpresaId();
        if (fallbackId) {
            select.value = String(fallbackId);
        }
    });
}

function updateMetasEmpresaOptions() {
    const group = document.getElementById('metasEmpresaGroup');
    const select = document.getElementById('metasEmpresa');
    if (!group || !select) return;

    if (!empresas || empresas.length === 0) {
        group.style.display = 'none';
        select.innerHTML = '';
        return;
    }

    const shouldShow = empresas.length > 1;
    group.style.display = shouldShow ? 'block' : 'none';
    select.innerHTML = empresas
        .map(emp => `<option value="${emp.id}">${emp.nome}</option>`)
        .join('');

    const fallbackId = currentEmpresa?.id || getFallbackEmpresaId();
    if (fallbackId) {
        select.value = String(fallbackId);
    }
}

function getFallbackEmpresaId() {
    if (!empresas || empresas.length === 0) return null;
    const ordered = [...empresas].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return ordered[0]?.id || null;
}

function deleteTransaction(id) {
    if (confirm(t('confirmDeleteTransaction'))) {
        transactions = transactions.filter(t => t.id !== id);
        saveUserData();
        renderTransactions();
        updateDashboard();
        if (isSectionVisible('relatorios-section')) {
            renderReportsByCompany();
        }
        showSuccessMessage(t('transactionRemoved'));
    }
}

function renderTransactions() {
    const container = document.getElementById('transactionsList');

    if (transactions.length === 0) {
        container.innerHTML = `<p class="empty-message">${t('noTransactions')}</p>`;
        return;
    }

    const filtered = getFilteredTransactions();

    if (filtered.length === 0) {
        container.innerHTML = `<p class="empty-message">${t('noTransactionsFiltered')}</p>`;
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
    const formattedDate = dateObj.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'pt-BR');
    const icon = ICONS_MAP[transaction.category] || 'fas fa-circle';
    const symbol = transaction.type === 'ganho' ? '+' : '-';
    const amount = formatCurrency(transaction.amount);
    const companyName = empresas.find(e => e.id === transaction.empresaId)?.nome || 'Sem empresa';

    return `
        <div class="transaction-item ${transaction.type}">
            <div class="transaction-left">
                <div class="transaction-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="transaction-info">
                    <h4>${transaction.description}</h4>
                    <p>${formattedDate}</p>
                    <span class="transaction-company">Empresa: ${companyName}</span>
                    <span class="transaction-category">${transaction.category}</span>
                </div>
            </div>
            <div class="transaction-right">
                <div class="transaction-amount">
                    ${symbol} ${amount}
                </div>
                <button class="btn-delete" data-id="${transaction.id}" title="${t('delete')}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

// ==================== DASHBOARD ====================
function updateDashboard() {
    normalizeTransactionsEmpresaIds();
    renderCompanyDashboards();

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

function isSameEmpresaId(a, b) {
    if (a === null || a === undefined || b === null || b === undefined) return false;
    return String(a) === String(b);
}

function normalizeTransactionsEmpresaIds() {
    if (!empresas || empresas.length === 0) return;
    const fallbackId = currentEmpresa?.id || getFallbackEmpresaId();
    if (!fallbackId) return;

    let updated = false;
    transactions.forEach((t) => {
        if (!t.empresaId) {
            t.empresaId = fallbackId;
            updated = true;
        }
    });

    if (updated) {
        saveUserData();
    }
}

function renderCompanyDashboards() {
    const container = document.getElementById('companyDashboards');
    if (!container) return;

    if (!empresas || empresas.length === 0) {
        container.innerHTML = '';
        return;
    }

    const ordered = [...empresas].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    container.innerHTML = ordered.map((emp) => {
        const income = transactions
            .filter(t => t.type === 'ganho' && isSameEmpresaId(t.empresaId, emp.id))
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = transactions
            .filter(t => t.type === 'gasto' && isSameEmpresaId(t.empresaId, emp.id))
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;

        return `
            <div class="company-dashboard">
                <h3 class="company-dashboard-title">${t('companyLabel')}: ${emp.nome}</h3>
                <div class="cards-container company-cards">
                    <div class="card card-balance">
                        <div class="card-icon">
                            <i class="fas fa-piggy-bank"></i>
                        </div>
                        <div class="card-content">
                            <h3>${t('balanceLabel')}</h3>
                            <p class="amount">${formatCurrency(balance)}</p>
                        </div>
                    </div>
                    <div class="card card-income">
                        <div class="card-icon">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                        <div class="card-content">
                            <h3>${t('income')}</h3>
                            <p class="amount income">${formatCurrency(income)}</p>
                        </div>
                    </div>
                    <div class="card card-expense">
                        <div class="card-icon">
                            <i class="fas fa-arrow-down"></i>
                        </div>
                        <div class="card-content">
                            <h3>${t('expenses')}</h3>
                            <p class="amount expense">${formatCurrency(expenses)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
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

    categorySelect.innerHTML = `<option value="">${t('selectCategory')}</option>` +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

    const allCategories = [...new Set(transactions.map(t => t.category))].sort();
    filterCategorySelect.innerHTML = `<option value="">${t('allCategories')}</option>` +
        allCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

    const transTypeSelect = document.getElementById('transType');
    if (transTypeSelect) {
        transTypeSelect.innerHTML =
            `<option value="ganho">${t('gain')}</option>` +
            `<option value="gasto">${t('expense')}</option>`;
    }

    const filterTypeSelect = document.getElementById('filterType');
    if (filterTypeSelect) {
        filterTypeSelect.innerHTML =
            `<option value="">${t('all')}</option>` +
            `<option value="ganho">${t('gain')}</option>` +
            `<option value="gasto">${t('expense')}</option>`;
    }
}

// ==================== CONTAS A PAGAR/RECEBER ====================
function handleAddContaPagar(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input');
    const empresaSelect = document.getElementById('contasPagarEmpresa');
    const empresaId = empresaSelect && empresaSelect.value ? parseInt(empresaSelect.value, 10) : (currentEmpresa?.id || getFallbackEmpresaId());

    const conta = {
        id: Date.now(),
        descricao: inputs[0].value,
        fornecedor: inputs[1].value,
        valor: parseFloat(inputs[2].value),
        dataVencimento: inputs[3].value,
        status: 'pendente',
        empresaId
    };

    contasPagar.push(conta);
    saveUserData();
    loadContasData();
    form.reset();
    showSuccessMessage(t('accountPayableAddedSuccess'));
}

function handleAddContaReceber(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input');
    const empresaSelect = document.getElementById('contasReceberEmpresa');
    const empresaId = empresaSelect && empresaSelect.value ? parseInt(empresaSelect.value, 10) : (currentEmpresa?.id || getFallbackEmpresaId());

    const conta = {
        id: Date.now(),
        descricao: inputs[0].value,
        cliente: inputs[1].value,
        valor: parseFloat(inputs[2].value),
        dataVencimento: inputs[3].value,
        status: 'pendente',
        empresaId
    };

    contasReceber.push(conta);
    saveUserData();
    loadContasData();
    form.reset();
    showSuccessMessage(t('accountReceivableAddedSuccess'));
}

function handleSetProLabore(e) {
    e.preventDefault();
    const empresaSelect = document.getElementById('proLaboreEmpresa');
    const empresaId = empresaSelect && empresaSelect.value ? parseInt(empresaSelect.value, 10) : (currentEmpresa?.id || getFallbackEmpresaId());
    const valor = parseFloat(document.getElementById('proLaboreValor').value);
    proLabore = valor;
    if (empresaId) {
        currentEmpresa = empresas.find(e => e.id === empresaId) || currentEmpresa;
    }
    saveUserData();
    showSuccessMessage(`Pró-Labore fixo definido em ${formatCurrency(valor)}`);
    updateProLaboreInfo();
}

function updateContasEmpresaOptions() {
    const groups = [
        { groupId: 'contasPagarEmpresaGroup', selectId: 'contasPagarEmpresa' },
        { groupId: 'contasReceberEmpresaGroup', selectId: 'contasReceberEmpresa' },
        { groupId: 'proLaboreEmpresaGroup', selectId: 'proLaboreEmpresa' }
    ];

    if (!empresas || empresas.length === 0) {
        groups.forEach(({ groupId, selectId }) => {
            const group = document.getElementById(groupId);
            const select = document.getElementById(selectId);
            if (group) group.style.display = 'none';
            if (select) select.innerHTML = '';
        });
        return;
    }

    const shouldShow = empresas.length > 1;
    const options = empresas
        .map(emp => `<option value="${emp.id}">${emp.nome}</option>`)
        .join('');

    groups.forEach(({ groupId, selectId }) => {
        const group = document.getElementById(groupId);
        const select = document.getElementById(selectId);
        if (!group || !select) return;
        group.style.display = shouldShow ? 'block' : 'none';
        select.innerHTML = options;

        const fallbackId = currentEmpresa?.id || getFallbackEmpresaId();
        if (fallbackId) {
            select.value = String(fallbackId);
        }
    });
}

function loadContasData() {
    const pagarContainer = document.getElementById('contasPagarList');
    const dateLocale = currentLanguage === 'en' ? 'en-US' : 'pt-BR';
    const getStatusLabel = (status) => {
        if (status === 'pago') return t('statusPaid');
        return t('statusPending');
    };
    if (pagarContainer) {
        pagarContainer.innerHTML = contasPagar
            .filter(c => !currentEmpresa || c.empresaId === currentEmpresa.id)
            .map(c => `
                <div class="account-item">
                    <div>
                        <h4>${c.descricao}</h4>
                        <p><strong>${t('supplierLabel')}:</strong> ${c.fornecedor}</p>
                        <p><strong>${t('dueDateLabel')}:</strong> ${new Date(c.dataVencimento).toLocaleDateString(dateLocale)}</p>
                    </div>
                    <div>
                        <strong>${formatCurrency(c.valor)}</strong>
                        <span class="status-badge status-${c.status}">${getStatusLabel(c.status)}</span>
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
                        <p><strong>${t('clientLabel')}:</strong> ${c.cliente}</p>
                        <p><strong>${t('dueDateLabel')}:</strong> ${new Date(c.dataVencimento).toLocaleDateString(dateLocale)}</p>
                    </div>
                    <div>
                        <strong>${formatCurrency(c.valor)}</strong>
                        <span class="status-badge status-${c.status}">${getStatusLabel(c.status)}</span>
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
            <h4>${t('proLaboreConfigured')}</h4>
            <p><strong>${t('monthlyValue')}:</strong> ${formatCurrency(proLabore)}</p>
            <p><strong>${t('annualValue')}:</strong> ${formatCurrency(proLabore * 12)}</p>
        `;
    }
}

// ==================== METAS ====================
function openMetaModal() {
    const descricao = prompt(t('metaDescriptionPrompt'));
    if (!descricao) return;

    const valor = parseFloat(prompt(t('metaTargetValuePrompt')));
    if (isNaN(valor)) return;

    const dataVencimento = prompt(t('metaDeadlinePrompt'));
    if (!dataVencimento) return;

    const meta = {
        id: Date.now(),
        descricao,
        valor,
        realizado: 0,
        dataVencimento,
        empresaId: resolveEmpresaId('metasEmpresa')
    };

    metas.push(meta);
    saveUserData();
    renderMetas();
    showSuccessMessage(t('goalCreated'));
}

function renderMetas() {
    const container = document.getElementById('metasList');
    if (!container) return;

    if (metas.length === 0) {
        container.innerHTML = `<p class="empty-message">${t('noGoals')}</p>`;
        return;
    }

    const filterEmpresaId = getSelectedEmpresaId('metasEmpresa') || currentEmpresa?.id;

    container.innerHTML = metas
        .filter(m => !filterEmpresaId || isSameEmpresaId(m.empresaId, filterEmpresaId))
        .map(m => {
            const percentual = (m.realizado / m.valor * 100).toFixed(0);
            return `
                <div class="goal-item">
                    <h4>${m.descricao}</h4>
                    <p>${t('goal')}: ${formatCurrency(m.valor)} | ${t('achieved')}: ${formatCurrency(m.realizado)}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentual}%"></div>
                    </div>
<<<<<<< Updated upstream
                    <p class="text-muted">${percentual}% ${t('goalProgress')}</p>
=======
                    <p class="text-muted">Empresa: ${getEmpresaNameById(m.empresaId)}</p>
                    <p class="text-muted">${percentual}% completo</p>
>>>>>>> Stashed changes
                </div>
            `;
        }).join('');
}

// ==================== FORNECEDORES ====================
function openFornecedorModal() {
    const nome = prompt(t('supplierNamePrompt'));
    if (!nome) return;

    const contato = prompt(t('supplierContactPrompt'));
    if (!contato) return;

    const categoria = prompt(t('supplierCategoryPrompt'));
    if (!categoria) return;

    const prazo = prompt(t('supplierPaymentTermsPrompt'));
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
    showSuccessMessage(t('supplierAdded'));
}

function renderFornecedores() {
    const container = document.getElementById('fornecedoresList');
    if (!container) return;

    container.innerHTML = fornecedores
        .filter(f => !currentEmpresa || f.empresaId === currentEmpresa.id)
        .map(f => `
            <div class="supplier-card">
                <h3>${f.nome}</h3>
                <p><strong>${t('category')}:</strong> ${f.categoria}</p>
                <p><strong>${t('contact')}:</strong> ${f.contato}</p>
                <p><strong>${t('paymentTerms')}:</strong> ${f.prazo}</p>
                <button class="btn btn-small btn-danger" onclick="deleteFornecedor(${f.id})">
                    <i class="fas fa-trash"></i> ${t('delete')}
                </button>
            </div>
        `).join('');
}

function handleAddFornecedor(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input');
    const nome = inputs[0].value.trim();
    const contatoRaw = formatPhoneValue(inputs[1].value.trim());
    const categoria = inputs[2].value.trim();
    const prazoRaw = inputs[3].value.trim();

    if (!nome || !contatoRaw || !categoria || !prazoRaw) {
        alert(t('fillAllFields'));
        return;
    }

    const phonePattern = /^\(\d{2}\)\d{5}-\d{4}$/;
    if (!phonePattern.test(contatoRaw)) {
        alert(t('phoneFormatError'));
        return;
    }

    const prazo = parseInt(prazoRaw, 10);
    if (Number.isNaN(prazo) || prazo <= 0) {
        alert(t('paymentTermsNumberError'));
        return;
    }

    const fornecedor = {
        id: Date.now(),
        nome,
        contato: contatoRaw,
        categoria,
        prazo: `${prazo} dias`,
        empresaId: currentEmpresa?.id || getFallbackEmpresaId()
    };

    fornecedores.push(fornecedor);
    saveUserData();
    renderFornecedores();
    form.reset();
    showSuccessMessage(t('supplierAdded'));
}

function formatPhoneValue(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) {
        return digits ? `(${digits}` : '';
    }
    if (digits.length <= 7) {
        return `(${digits.slice(0, 2)})${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function deleteFornecedor(id) {
    if (confirm(t('confirmDeleteSupplier'))) {
        fornecedores = fornecedores.filter(f => f.id !== id);
        saveUserData();
        renderFornecedores();
        showSuccessMessage(t('supplierDeletedSuccess'));
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
        empresaId: resolveEmpresaId('investimentosEmpresa')
    };

    investimentos.push(investimento);
    saveUserData();
    activateTab('investimentos-ativos');
    renderInvestimentos();
    showSuccessMessage(t('investmentRegisteredSuccess'));
}

function renderInvestimentos() {
    const container = document.getElementById('investimentosList');
    if (!container) return;

    const tab = document.getElementById('investimentos-ativos');
    const filterEmpresaId = getSelectedEmpresaId('investimentosEmpresa') || currentEmpresa?.id;
    const filtered = investimentos
        .filter(i => !filterEmpresaId || isSameEmpresaId(i.empresaId, filterEmpresaId));

    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum investimento registrado.</p>';
        if (tab) tab.classList.add('is-empty');
        return;
    }

    if (tab) tab.classList.remove('is-empty');

    container.innerHTML = filtered
        .map(i => `
            <div class="investment-item">
                <h4>${i.descricao}</h4>
                <p>Tipo: ${i.tipo}</p>
                <p>Valor: ${formatCurrency(i.valor)}</p>
                <p class="text-muted">Empresa: ${getEmpresaNameById(i.empresaId)}</p>
                <p class="text-muted">Data: ${new Date(i.dataAquisicao).toLocaleDateString('pt-BR')}</p>
            </div>
        `).join('');
}

function parseValueInput(value) {
    if (typeof value !== 'string') return null;
    const normalized = value.replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(normalized);
    return Number.isNaN(parsed) ? null : parsed;
}

function handleAddCustosFixos(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input');
    const descricao = inputs[0].value.trim();
    const valor = parseFloat(inputs[1].value);
    const empresaId = resolveEmpresaId('custosFixosEmpresa');

    if (!descricao || Number.isNaN(valor)) {
        alert('Preencha descricao e valor corretamente.');
        return;
    }

    custosFixos.push({
        id: Date.now(),
        descricao,
        valor,
        empresaId
    });

    saveUserData();
    renderCustosFixos();
    form.reset();
    showSuccessMessage('Custo fixo adicionado!');
}

function handleAddCustosVariaveis(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input');
    const descricao = inputs[0].value.trim();
    const valorTexto = inputs[1].value.trim();
    const valorNumero = parseValueInput(valorTexto);
    const empresaId = resolveEmpresaId('custosVariaveisEmpresa');

    if (!descricao || !valorTexto) {
        alert('Preencha descricao e valor corretamente.');
        return;
    }

    custosVariaveis.push({
        id: Date.now(),
        descricao,
        valorTexto,
        valorNumero,
        empresaId
    });

    saveUserData();
    renderCustosVariaveis();
    form.reset();
    showSuccessMessage('Custo variavel adicionado!');
}

function handleAddCapitalGiro(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input');
    const descricao = inputs[0].value.trim();
    const valor = parseFloat(inputs[1].value);
    const empresaId = resolveEmpresaId('capitalGiroEmpresa');

    if (!descricao || Number.isNaN(valor)) {
        alert('Preencha descricao e valor corretamente.');
        return;
    }

    capitalGiro.push({
        id: Date.now(),
        descricao,
        valor,
        empresaId,
        data: new Date().toISOString().split('T')[0]
    });

    saveUserData();
    renderCapitalGiro();
    form.reset();
    showSuccessMessage('Capital de giro adicionado!');
}

function renderCustosFixos() {
    const container = document.getElementById('custosFizosList');
    if (!container) return;

    const filterEmpresaId = getSelectedEmpresaId('custosFixosEmpresa') || currentEmpresa?.id;
    const filtered = custosFixos
        .filter(c => !filterEmpresaId || isSameEmpresaId(c.empresaId, filterEmpresaId));

    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum custo fixo registrado.</p>';
        return;
    }

    container.innerHTML = filtered
        .map(c => `
            <div class="cost-item">
                <div class="cost-item-header">
                    <h4>${c.descricao}</h4>
                    <button class="btn-delete" data-cost-id="${c.id}" data-cost-type="fixo" title="Deletar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <p>Valor: ${formatCurrency(c.valor)}</p>
                <p class="text-muted">Empresa: ${getEmpresaNameById(c.empresaId)}</p>
            </div>
        `).join('');

    container.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteCusto(btn.dataset.costId, btn.dataset.costType));
    });
}

function renderCustosVariaveis() {
    const container = document.getElementById('custosVariaveisList');
    if (!container) return;

    const filterEmpresaId = getSelectedEmpresaId('custosVariaveisEmpresa') || currentEmpresa?.id;
    const filtered = custosVariaveis
        .filter(c => !filterEmpresaId || isSameEmpresaId(c.empresaId, filterEmpresaId));

    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum custo variavel registrado.</p>';
        return;
    }

    container.innerHTML = filtered
        .map(c => `
            <div class="cost-item">
                <div class="cost-item-header">
                    <h4>${c.descricao}</h4>
                    <button class="btn-delete" data-cost-id="${c.id}" data-cost-type="variavel" title="Deletar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <p>Valor: ${c.valorTexto}</p>
                <p class="text-muted">Empresa: ${getEmpresaNameById(c.empresaId)}</p>
            </div>
        `).join('');

    container.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteCusto(btn.dataset.costId, btn.dataset.costType));
    });
}

function renderCapitalGiro() {
    const container = document.getElementById('capitalGiroList');
    const analysis = document.getElementById('capitalGiroAnalysis');
    if (!container || !analysis) return;

    const filterEmpresaId = getSelectedEmpresaId('capitalGiroEmpresa') || currentEmpresa?.id;
    const filtered = capitalGiro
        .filter(c => !filterEmpresaId || isSameEmpresaId(c.empresaId, filterEmpresaId));

    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum capital de giro registrado.</p>';
        analysis.innerHTML = '';
        return;
    }

    const total = filtered.reduce((sum, item) => sum + item.valor, 0);
    container.innerHTML = filtered
        .map(c => `
            <div class="cost-item">
                <div class="cost-item-header">
                    <h4>${c.descricao}</h4>
                    <button class="btn-delete" data-cost-id="${c.id}" data-cost-type="capital" title="Deletar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <p>Valor: ${formatCurrency(c.valor)}</p>
                <p class="text-muted">Empresa: ${getEmpresaNameById(c.empresaId)}</p>
                <p class="text-muted">Data: ${new Date(c.data).toLocaleDateString('pt-BR')}</p>
            </div>
        `).join('');

    analysis.innerHTML = `
        <strong>Total de Capital de Giro:</strong> ${formatCurrency(total)}
    `;

    container.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteCusto(btn.dataset.costId, btn.dataset.costType));
    });
}

function deleteCusto(id, type) {
    const parsedId = parseInt(id, 10);
    if (Number.isNaN(parsedId)) return;
    if (!confirm('Deletar registro?')) return;

    if (type === 'fixo') {
        custosFixos = custosFixos.filter(c => c.id !== parsedId);
        renderCustosFixos();
    } else if (type === 'variavel') {
        custosVariaveis = custosVariaveis.filter(c => c.id !== parsedId);
        renderCustosVariaveis();
    } else if (type === 'capital') {
        capitalGiro = capitalGiro.filter(c => c.id !== parsedId);
        renderCapitalGiro();
    }

    saveUserData();
    showSuccessMessage('Registro deletado!');
}

// ==================== GRÁFICOS ====================
function initCharts() {
    renderReportsByCompany();
}

function updateReportsEmpresaOptions() {
    const select = document.getElementById('reportsEmpresaFilter');
    const group = document.getElementById('reportsEmpresaFilterGroup');
    if (!select || !group) return;

    if (!empresas || empresas.length <= 1) {
        group.style.display = 'none';
        select.innerHTML = '';
        return;
    }

    group.style.display = 'block';
    const options = [`<option value="all">${t('allCompanies')}</option>`]
        .concat(empresas.map(emp => `<option value="${emp.id}">${emp.nome}</option>`))
        .join('');
    select.innerHTML = options;

    if (!select.value) {
        select.value = 'all';
    }
}

function renderReportsByCompany() {
    const container = document.getElementById('reportsCompanies');
    if (!container) return;

    if (!empresas || empresas.length === 0) {
        container.innerHTML = `<p class="empty-message">${t('noCompanies')}</p>`;
        return;
    }

    const ordered = [...empresas].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const filterSelect = document.getElementById('reportsEmpresaFilter');
    const selectedId = filterSelect && filterSelect.value && filterSelect.value !== 'all'
        ? parseInt(filterSelect.value, 10)
        : null;

    const filteredCompanies = selectedId
        ? ordered.filter((emp) => emp.id === selectedId)
        : ordered;

    const withTransactions = filteredCompanies.filter((emp) =>
        transactions.some((t) => t.empresaId === emp.id)
    );

    if (withTransactions.length === 0) {
        container.innerHTML = selectedId
            ? `<p class="empty-message">${t('noReportsCompany')}</p>`
            : `<p class="empty-message">${t('noReportsAny')}</p>`;
        return;
    }

    container.innerHTML = withTransactions.map((emp) => `
        <div class="company-dashboard">
            <div class="section-header">
                <h3 class="company-dashboard-title">${t('companyLabel')}: ${emp.nome}</h3>
                <button class="btn btn-small btn-primary" onclick="generateReportForCompany(${emp.id})">
                    <i class="fas fa-download"></i> ${t('generateReport')}
                </button>
            </div>
            <div class="reports-container">
                <div class="report-card">
                    <h3>${t('monthlyComparison')}</h3>
                    <canvas id="monthlyChart-${emp.id}"></canvas>
                </div>
                <div class="report-card">
                    <h3>${t('bimonthlyComparison')}</h3>
                    <canvas id="bimonthlyChart-${emp.id}"></canvas>
                </div>
                <div class="report-card">
                    <h3>${t('semesterComparison')}</h3>
                    <canvas id="semesterChart-${emp.id}"></canvas>
                </div>
                <div class="report-card">
                    <h3>${t('annualComparison')}</h3>
                    <canvas id="annualChart-${emp.id}"></canvas>
                </div>
                <div class="report-card">
                    <h3>${t('scenarioAnalysis')}</h3>
                    <div id="scenarioAnalysis-${emp.id}"></div>
                </div>
                <div class="report-card">
                    <h3>${t('categoryDistribution')}</h3>
                    <canvas id="categoryChart-${emp.id}"></canvas>
                </div>
            </div>
        </div>
    `).join('');

    withTransactions.forEach((emp) => {
        generateMonthlyComparison(emp.id, `monthlyChart-${emp.id}`);
        generateBimonthlyComparison(emp.id, `bimonthlyChart-${emp.id}`);
        generateSemesterComparison(emp.id, `semesterChart-${emp.id}`);
        generateAnnualComparison(emp.id, `annualChart-${emp.id}`);
        generateCategoryChart(emp.id, `categoryChart-${emp.id}`);
        generateScenarioAnalysis(emp.id, `scenarioAnalysis-${emp.id}`);
    });
}

function generateMonthlyComparison(companyId, canvasId) {
    const container = document.getElementById(canvasId || 'monthlyChart');
    if (!container) return;

    const dates = getLast12Months();
    const income = dates.map(date => getMonthIncome(date, companyId));
    const expense = dates.map(date => getMonthExpense(date, companyId));

    const ctx = container.getContext('2d');
    const monthLocale = currentLanguage === 'en' ? 'en-US' : 'pt-BR';
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(d => d.toLocaleDateString(monthLocale, { month: 'short' })),
            datasets: [
                {
                    label: t('income'),
                    data: income,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: t('expenses'),
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

function generateBimonthlyComparison(companyId, canvasId) {
    const container = document.getElementById(canvasId || 'bimonthlyChart');
    if (!container) return;

    const bimonths = getLast6Bimonths();
    const data = bimonths.map(bm => ({
        period: bm,
        income: getBimonthIncome(bm, companyId),
        expense: getBimonthExpense(bm, companyId)
    }));

    const ctx = container.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.period),
            datasets: [
                {
                    label: t('income'),
                    data: data.map(d => d.income),
                    backgroundColor: '#10b981'
                },
                {
                    label: t('expenses'),
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

function generateSemesterComparison(companyId, canvasId) {
    const container = document.getElementById(canvasId || 'semesterChart');
    if (!container) return;

    const semesters = getLastSemesters();
    const data = semesters.map(sem => ({
        period: sem,
        income: getSemesterIncome(sem, companyId),
        expense: getSemesterExpense(sem, companyId)
    }));

    const ctx = container.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.period),
            datasets: [
                {
                    label: t('income'),
                    data: data.map(d => d.income),
                    backgroundColor: '#10b981'
                },
                {
                    label: t('expenses'),
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

function generateAnnualComparison(companyId, canvasId) {
    const container = document.getElementById(canvasId || 'annualChart');
    if (!container) return;

    const years = getLastYears();
    const data = years.map(year => ({
        year,
        income: getYearIncome(year, companyId),
        expense: getYearExpense(year, companyId)
    }));

    const ctx = container.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.year),
            datasets: [
                {
                    label: t('income'),
                    data: data.map(d => d.income),
                    backgroundColor: '#10b981'
                },
                {
                    label: t('expenses'),
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

function generateCategoryChart(companyId, canvasId) {
    const container = document.getElementById(canvasId || 'categoryChart');
    if (!container) return;

    const categoryData = getExpensesByCategory(companyId);
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

function generateScenarioAnalysis(companyId, containerId) {
    const container = document.getElementById(containerId || 'scenarioAnalysis');
    if (!container) return;

    const currentBalance = getTotalBalance(companyId);
    const monthlyAvg = getMonthlyAverageExpense(companyId);
    const months = monthlyAvg > 0 ? Math.floor(currentBalance / monthlyAvg) : 0;

    container.innerHTML = `
        <div style="padding: 20px;">
            <h4>${t('scenarioAnalysisTitle')}</h4>
            <p><strong>${t('currentBalanceLabel')}:</strong> ${formatCurrency(currentBalance)}</p>
            <p><strong>${t('avgMonthlyExpenseLabel')}:</strong> ${formatCurrency(monthlyAvg)}</p>
            <p><strong>${t('monthsAutonomyLabel')}:</strong> ${months} ${t('monthsLabel')}</p>
            <hr style="margin: 15px 0;">
            <p><strong>${t('optimisticScenarioLabel')}:</strong></p>
            <p>${t('autonomyLabel')}: ${Math.ceil(months * 1.15)} ${t('monthsLabel')}</p>
            <hr style="margin: 15px 0;">
            <p><strong>${t('pessimisticScenarioLabel')}:</strong></p>
            <p>${t('autonomyLabel')}: ${Math.floor(months * 0.85)} ${t('monthsLabel')}</p>
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

function getMonthIncome(date, companyId) {
    return transactions
        .filter(t => {
            const tDate = new Date(t.date);
            const matchCompany = companyId ? t.empresaId === companyId : true;
            return t.type === 'ganho' && tDate.getMonth() === date.getMonth() && matchCompany;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

function getMonthExpense(date, companyId) {
    return transactions
        .filter(t => {
            const tDate = new Date(t.date);
            const matchCompany = companyId ? t.empresaId === companyId : true;
            return t.type === 'gasto' && tDate.getMonth() === date.getMonth() && matchCompany;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

function getBimonthIncome(bmStr, companyId) {
    const [month, year] = bmStr.split('/').map(Number);
    const startMonth = (month - 1) * 2;
    const endMonth = startMonth + 1;
    const fullYear = parseInt('20' + year);

    return transactions
        .filter(t => {
            const tDate = new Date(t.date);
            const tMonth = tDate.getMonth();
            const tYear = tDate.getFullYear();
                 const matchCompany = companyId ? t.empresaId === companyId : true;
                 return t.type === 'ganho' && tYear === fullYear &&
                     (tMonth === startMonth || tMonth === endMonth) && matchCompany;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

        function getBimonthExpense(bmStr, companyId) {
    const [month, year] = bmStr.split('/').map(Number);
    const startMonth = (month - 1) * 2;
    const endMonth = startMonth + 1;
    const fullYear = parseInt('20' + year);

    return transactions
        .filter(t => {
            const tDate = new Date(t.date);
            const tMonth = tDate.getMonth();
            const tYear = tDate.getFullYear();
                 const matchCompany = companyId ? t.empresaId === companyId : true;
                 return t.type === 'gasto' && tYear === fullYear &&
                     (tMonth === startMonth || tMonth === endMonth) && matchCompany;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

        function getSemesterIncome(semStr, companyId) {
    const [sem, year] = semStr.split('/').map(Number);
    const startMonth = (sem - 1) * 6;
    const endMonth = startMonth + 5;

    return transactions
        .filter(t => {
            const tDate = new Date(t.date);
            const tMonth = tDate.getMonth();
            const tYear = tDate.getFullYear();
                 const matchCompany = companyId ? t.empresaId === companyId : true;
                 return t.type === 'ganho' && tYear === year &&
                     tMonth >= startMonth && tMonth <= endMonth && matchCompany;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

        function getSemesterExpense(semStr, companyId) {
    const [sem, year] = semStr.split('/').map(Number);
    const startMonth = (sem - 1) * 6;
    const endMonth = startMonth + 5;

    return transactions
        .filter(t => {
            const tDate = new Date(t.date);
            const tMonth = tDate.getMonth();
            const tYear = tDate.getFullYear();
            const matchCompany = companyId ? t.empresaId === companyId : true;
            return t.type === 'gasto' && tYear === year &&
                   tMonth >= startMonth && tMonth <= endMonth && matchCompany;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

function getYearIncome(year, companyId) {
    return transactions
        .filter(t => {
            const matchCompany = companyId ? t.empresaId === companyId : true;
            return t.type === 'ganho' && new Date(t.date).getFullYear() === year && matchCompany;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

function getYearExpense(year, companyId) {
    return transactions
        .filter(t => {
            const matchCompany = companyId ? t.empresaId === companyId : true;
            return t.type === 'gasto' && new Date(t.date).getFullYear() === year && matchCompany;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

function getExpensesByCategory(companyId) {
    const categories = {};
    transactions
        .filter(t => t.type === 'gasto' && (companyId ? t.empresaId === companyId : true))
        .forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        });
    return categories;
}

function getTotalBalance(companyId) {
    const income = transactions
        .filter(t => t.type === 'ganho' && (companyId ? t.empresaId === companyId : true))
        .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
        .filter(t => t.type === 'gasto' && (companyId ? t.empresaId === companyId : true))
        .reduce((sum, t) => sum + t.amount, 0);
    return income - expense;
}

function getMonthlyAverageExpense(companyId) {
    const currentMonth = new Date().getMonth();
    const monthExpenses = transactions
        .filter(t => {
            const matchCompany = companyId ? t.empresaId === companyId : true;
            return t.type === 'gasto' && new Date(t.date).getMonth() === currentMonth && matchCompany;
        })
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

    openReportModal(reports, 'Relatório Financeiro');
}

function generateReportForCompany(companyId) {
    const company = empresas.find((emp) => emp.id === companyId);
    if (!company) {
        alert(t('companyNotFound'));
        return;
    }

    const companyTransactions = transactions.filter((t) => t.empresaId === companyId);
    const reports = {
        totalIncome: companyTransactions.filter(t => t.type === 'ganho').reduce((sum, t) => sum + t.amount, 0),
        totalExpense: companyTransactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0),
        balance: getTotalBalance(companyId),
        monthlyAverage: getMonthlyAverageExpense(companyId),
        transactionCount: companyTransactions.length,
        categories: getExpensesByCategory(companyId),
        generatedAt: new Date().toLocaleString('pt-BR'),
        companyName: company.nome
    };

    openReportModal(reports, `Relatório Financeiro — ${company.nome}`);
}

function openReportModal(reports, title) {

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
            <h2 style="margin-top: 0; color: #7c3aed;">${title || t('financialReport')}</h2>
            <p><strong>${t('generatedAt')}:</strong> ${reports.generatedAt}</p>

            <h3 style="color: #7c3aed;">${t('generalSummary')}</h3>
            <p><strong>${t('totalIncomeLabel')}:</strong> ${formatCurrency(reports.totalIncome)}</p>
            <p><strong>${t('totalExpenseLabel')}:</strong> ${formatCurrency(reports.totalExpense)}</p>
            <p><strong>${t('balanceLabel')}:</strong> ${formatCurrency(reports.balance)}</p>
            <p><strong>${t('monthlyAverageExpense')}:</strong> ${formatCurrency(reports.monthlyAverage)}</p>
            <p><strong>${t('totalTransactionsLabel')}:</strong> ${reports.transactionCount}</p>

            <hr style="margin: 20px 0;">

            <h3 style="color: #7c3aed;">${t('expenseByCategory')}</h3>
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
                    ${t('close')}
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
        <h2>${t('financialReport')} FinCore</h2>
        <p>${t('generatedAt')}: ${reports.generatedAt}</p>

        <h3>${t('generalSummary')}</h3>
        <p>${t('totalIncomeLabel')}: ${formatCurrency(reports.totalIncome)}</p>
        <p>${t('totalExpenseLabel')}: ${formatCurrency(reports.totalExpense)}</p>
        <p>${t('balanceLabel')}: ${formatCurrency(reports.balance)}</p>
        <p>${t('monthlyAverageExpense')}: ${formatCurrency(reports.monthlyAverage)}</p>
        <p>${t('totalTransactionsLabel')}: ${reports.transactionCount}</p>

        <h3>${t('expenseByCategory')}</h3>
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
    showSuccessMessage(t('reportPdfDownloaded'));
    document.querySelector('[data-report-modal]').remove();
}

function exportExcel() {
    const reports = window.currentReportData;
    const wb = XLSX.utils.book_new();

    const resumoData = [
        [`${t('financialReport')} FinCore`],
        [`${t('generatedAt')}:`, reports.generatedAt],
        [],
        [t('generalSummary')],
        [t('totalIncomeLabel'), formatCurrency(reports.totalIncome)],
        [t('totalExpenseLabel'), formatCurrency(reports.totalExpense)],
        [t('balanceLabel'), formatCurrency(reports.balance)],
        [t('monthlyAverageExpense'), formatCurrency(reports.monthlyAverage)],
        [t('totalTransactionsLabel'), reports.transactionCount]
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
    showSuccessMessage(t('reportExcelDownloadedSuccess'));
    document.querySelector('[data-report-modal]').remove();
}

function exportCSV() {
    const reports = window.currentReportData;

    let csvContent = `${t('financialReport')} FinCore\n`;
    csvContent += `${t('generatedAt')}: ${reports.generatedAt}\n\n`;
    csvContent += `${t('generalSummary')}\n`;
    csvContent += `${t('totalIncomeLabel')},${reports.totalIncome}\n`;
    csvContent += `${t('totalExpenseLabel')},${reports.totalExpense}\n`;
    csvContent += `${t('balanceLabel')},${reports.balance}\n`;
    csvContent += `${t('monthlyAverageExpense')},${reports.monthlyAverage}\n`;
    csvContent += `${t('totalTransactionsLabel')},${reports.transactionCount}\n\n`;
    csvContent += `${t('expenseByCategory')}\n`;
    csvContent += `${t('category')},${t('amount')}\n`;

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

    showSuccessMessage(t('reportCsvDownloadedSuccess'));
    document.querySelector('[data-report-modal]').remove();
}

// ==================== CALENDÁRIO ====================
let calendarYear = null;
let calendarMonth = null;

function initCalendar() {
    const today = new Date();
    calendarYear = today.getFullYear();
    calendarMonth = today.getMonth();
    renderCalendar(calendarYear, calendarMonth);
}

function renderCalendar(year, month) {
    const monthYearDisplay = document.getElementById('monthYearDisplay');
    const calendarTable = document.getElementById('calendarTable');

    if (!monthYearDisplay || !calendarTable) return;

    const monthNames = [
        t('monthJanuary'), t('monthFebruary'), t('monthMarch'), t('monthApril'),
        t('monthMay'), t('monthJune'), t('monthJuly'), t('monthAugust'),
        t('monthSeptember'), t('monthOctober'), t('monthNovember'), t('monthDecember')
    ];

    const weekDayNames = [
        t('dayShortSun'), t('dayShortMon'), t('dayShortTue'), t('dayShortWed'),
        t('dayShortThu'), t('dayShortFri'), t('dayShortSat')
    ];

    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const headerCells = weekDayNames.map(dayName => `<th>${dayName}</th>`).join('');

    let html = `
        <thead>
            <tr>
                ${headerCells}
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
    if (calendarYear === null || calendarMonth === null) {
        initCalendar();
        return;
    }
    calendarMonth -= 1;
    if (calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear -= 1;
    }
    renderCalendar(calendarYear, calendarMonth);
}

function nextMonth() {
    if (calendarYear === null || calendarMonth === null) {
        initCalendar();
        return;
    }
    calendarMonth += 1;
    if (calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear += 1;
    }
    renderCalendar(calendarYear, calendarMonth);
}

function activateTab(tabId) {
    const tab = document.getElementById(tabId);
    if (!tab) return;
    const container = tab.parentElement?.querySelector('.tabs-container');
    const button = container ? container.querySelector(`[data-tab="${tabId}"]`) : null;
    if (button) {
        switchTab(button);
        return;
    }

    const tabsContainer = tab.closest('section')?.querySelector('.tabs-container');
    if (!tabsContainer) return;
    tabsContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    tab.parentElement.querySelectorAll('.tab-content').forEach(item => item.classList.remove('active'));
    tab.classList.add('active');
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
                showSuccessMessage(t('sloganUpdatedSuccess'));
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
            const currentPass = document.getElementById('currentPassword').value;
            const newPass = document.getElementById('newPassword').value;
            const confirm = document.getElementById('confirmPassword').value;

            if (newPass.length < 6) {
                alert(t('passwordMinLength6'));
                return;
            }

            if (newPass !== confirm) {
                alert(t('passwordsDontMatch'));
                return;
            }

            if (DEMO_AUTH) {
                const email = currentUser?.email || getLastUserEmail();
                if (!email) {
                    alert('Conta nao encontrada.');
                    return;
                }
                const valid = await verifyPassword(email, currentPass);
                if (!valid) {
                    alert('Senha atual incorreta.');
                    return;
                }
                const passHash = await hashPassword(newPass);
                storageSet(`user_pass_${email}`, passHash);
                storageSet('lastUserEmail', email);
                showSuccessMessage('Senha alterada com sucesso!');
                cancelChangePassword();
                return;
            }

            try {
                await Auth.updatePassword(newPass);
                showSuccessMessage(t('passwordChanged'));
                cancelChangePassword();
            } catch (error) {
                alert(t('passwordChangeError'));
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
                alert(t('invalidEmail'));
                return;
            }

            if (email === currentUser.email) {
                alert(t('cannotShareWithSelf'));
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
    if (confirm(t('revokeAccessConfirm'))) {
        userProfile.sharedAccounts = userProfile.sharedAccounts.filter(s => s.id !== shareId);
        saveUserData();
        showSuccessMessage(t('accessRevokedSuccess'));
        renderSharedAccounts();
    }
}

function switchAccount() {
    if (confirm(t('loginWithAnotherAccount'))) {
        handleLogout();
    }
}

function deleteAccount() {
    if (confirm(t('deleteAccountConfirm'))) {
        if (confirm(t('deleteAccountFinalWarning'))) {
            const userKey = `user_${currentUser.email}`;
            storageRemove(userKey);
            storageRemove('currentUser');
            const lastEmail = getLastUserEmail();
            if (lastEmail && lastEmail === currentUser.email) {
                storageRemove('lastUserEmail');
            }
            alert(t('accountDeletedSuccess'));
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
        capitalGiro,
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
        capitalGiro = parsed.capitalGiro || [];
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
    const baseSize = 16;
    document.documentElement.style.fontSize = baseSize + 'px';
    if (!document.body) {
        return;
    }

    if ('zoom' in document.body.style) {
        document.body.style.zoom = String(currentFontSize);
    } else {
        document.body.style.transform = currentFontSize === 1 ? '' : `scale(${currentFontSize})`;
        document.body.style.transformOrigin = currentFontSize === 1 ? '' : 'top left';
        document.body.style.width = currentFontSize === 1 ? '' : `${100 / currentFontSize}%`;
    }
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
window.decreaseFontSize = decreaseFontSize;
window.increaseFontSize = increaseFontSize;
window.t = t;
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
window.selectEmpresa = selectEmpresa;
window.editEmpresa = editEmpresa;
window.deleteEmpresa = deleteEmpresa;
window.generateReportForCompany = generateReportForCompany;
window.exportPDF = exportPDF;
window.exportExcel = exportExcel;
window.exportCSV = exportCSV;

initApp();

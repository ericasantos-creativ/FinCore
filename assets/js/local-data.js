import { Store } from './store.js';
import { Utils } from './utils.js';

const STORAGE_KEY = 'fincore_local_data';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { accounts: [], transactions: [] };
    const parsed = JSON.parse(raw);
    return {
      accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [],
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : []
    };
  } catch (error) {
    console.warn('[LocalData] Falha ao ler localStorage:', error);
    return { accounts: [], transactions: [] };
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function normalizeAccount(account) {
  const saldoBase = Number(account.saldo_atual ?? account.saldo ?? account.saldo_inicial ?? 0) || 0;
  return {
    id: account.id || Utils.generateId(),
    nome: account.nome || 'Conta',
    saldo: saldoBase,
    saldo_inicial: Number(account.saldo_inicial ?? saldoBase) || 0,
    saldo_atual: Number(account.saldo_atual ?? saldoBase) || 0,
    tipo: account.tipo || 'corrente',
    banco: account.banco || '',
    agencia: account.agencia || '',
    numero: account.numero || '',
    ativa: account.ativa !== false,
    empresa_id: account.empresa_id ?? null
  };
}

function normalizeTransaction(tx) {
  return {
    id: tx.id || Utils.generateId(),
    tipo: tx.tipo === 'despesa' ? 'despesa' : 'receita',
    valor: Number(tx.valor || 0) || 0,
    conta_id: tx.conta_id || tx.contaId || null,
    contaId: tx.contaId || tx.conta_id || null,
    data: tx.data || new Date().toISOString().slice(0, 10),
    descricao: tx.descricao || '',
    status: tx.status || 'efetivada',
    categoria: tx.categoria || '',
    empresa_id: tx.empresa_id ?? null
  };
}

export const LocalData = {
  init() {
    const data = loadData();
    Store.setState({
      accounts: data.accounts,
      transactions: data.transactions
    });
  },

  addConta(account) {
    const data = loadData();
    const record = normalizeAccount(account);
    data.accounts.push(record);
    saveData(data);
    Store.setState({ accounts: data.accounts });
    return record;
  },

  updateConta(id, patch) {
    const data = loadData();
    const index = data.accounts.findIndex((acc) => acc.id === id);
    if (index === -1) return null;
    const merged = normalizeAccount({ ...data.accounts[index], ...patch, id });
    data.accounts[index] = merged;
    saveData(data);
    Store.setState({ accounts: data.accounts });
    return merged;
  },

  deleteConta(id) {
    const data = loadData();
    data.accounts = data.accounts.filter((acc) => acc.id !== id);
    saveData(data);
    Store.setState({ accounts: data.accounts });
  },

  addTransacao(transaction) {
    const data = loadData();
    const record = normalizeTransaction(transaction);
    const accountIndex = data.accounts.findIndex((acc) => acc.id === record.conta_id);

    if (accountIndex >= 0) {
      const account = data.accounts[accountIndex];
      const delta = record.tipo === 'receita' ? record.valor : -record.valor;
      const nextSaldo = Number(account.saldo_atual ?? account.saldo ?? 0) + delta;
      data.accounts[accountIndex] = {
        ...account,
        saldo: nextSaldo,
        saldo_atual: nextSaldo
      };
    }

    data.transactions.push(record);
    saveData(data);
    Store.setState({
      accounts: data.accounts,
      transactions: data.transactions
    });
    return record;
  },

  calcularResumo(accounts, transactions) {
    const totalBalance = accounts.reduce((sum, acc) => {
      const saldo = Number(acc.saldo_atual ?? acc.saldo ?? 0) || 0;
      return sum + saldo;
    }, 0);

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const receitaMes = transactions.reduce((sum, tx) => {
      const date = new Date(tx.data);
      if (tx.tipo === 'receita' && date.getMonth() === month && date.getFullYear() === year) {
        return sum + (Number(tx.valor) || 0);
      }
      return sum;
    }, 0);

    const despesaMes = transactions.reduce((sum, tx) => {
      const date = new Date(tx.data);
      if (tx.tipo === 'despesa' && date.getMonth() === month && date.getFullYear() === year) {
        return sum + (Number(tx.valor) || 0);
      }
      return sum;
    }, 0);

    return {
      totalBalance,
      receitaMes,
      despesaMes,
      saldoLiquido: receitaMes - despesaMes
    };
  }
};

// Funcoes solicitadas
export function addConta(data) {
  return LocalData.addConta(data);
}

export function addTransacao(data) {
  return LocalData.addTransacao(data);
}

export function calcularResumo(accounts, transactions) {
  return LocalData.calcularResumo(accounts, transactions);
}

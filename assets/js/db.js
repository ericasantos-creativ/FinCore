const DB_NAME = 'fincore_db';
const DB_VERSION = 1;
let dbInstance = null;

import { supabase } from './supabase.js';
import { Store } from './store.js';

const TABLE_MAP = {
  users: 'profiles',
  companies: 'companies',
  accounts: 'accounts',
  categories: 'categories',
  transactions: 'transactions',
  goals: 'goals',
  investments: 'investments',
  suppliers: 'suppliers'
};

const FIELD_MAP = {
  companies: {
    nome: 'name',
    cnpj: 'cnpj',
    segmento: 'segment',
    logo: 'logo_base64',
    cor: 'color_hex',
    ativa: 'is_active',
    criado_em: 'created_at',
    atualizado_em: 'updated_at'
  },
  accounts: {
    empresa_id: 'company_id',
    nome: 'name',
    tipo: 'type',
    banco: 'bank',
    agencia: 'agency',
    numero: 'account_number',
    saldo_inicial: 'initial_balance',
    saldo_atual: 'current_balance',
    limite_credito: 'credit_limit',
    cor: 'color_hex',
    icone: 'icon',
    ativa: 'is_active',
    criado_em: 'created_at',
    atualizado_em: 'updated_at'
  },
  categories: {
    nome: 'name',
    tipo: 'type',
    icone: 'icon',
    cor: 'color_hex',
    pai_id: 'parent_id',
    sistema: 'is_system',
    criado_em: 'created_at',
    atualizado_em: 'updated_at'
  },
  transactions: {
    empresa_id: 'company_id',
    conta_id: 'account_id',
    categoria_id: 'category_id',
    fornecedor_id: 'supplier_id',
    tipo: 'type',
    descricao: 'description',
    valor: 'amount',
    data: 'date',
    status: 'status',
    recorrente: 'is_recurring',
    frequencia: 'frequency',
    observacao: 'notes',
    anexo: 'attachment_base64',
    transferencia_conta_destino: 'transfer_account_id',
    criado_em: 'created_at',
    atualizado_em: 'updated_at'
  },
  suppliers: {
    empresa_id: 'company_id',
    nome: 'name',
    cnpj_cpf: 'document',
    categoria: 'category',
    email: 'email',
    telefone: 'phone',
    endereco: 'address',
    conta: 'bank_account',
    chave_pix: 'pix_key',
    ativo: 'is_active',
    observacao: 'notes',
    criado_em: 'created_at',
    atualizado_em: 'updated_at'
  },
  goals: {
    nome: 'name',
    descricao: 'description',
    categoria: 'category',
    valor_alvo: 'target_value',
    valor_atual: 'current_value',
    data_inicio: 'start_date',
    data_prazo: 'due_date',
    conta_vinculada: 'linked_account_id',
    icone: 'icon',
    cor: 'color_hex',
    concluida: 'is_completed',
    criado_em: 'created_at',
    atualizado_em: 'updated_at'
  },
  investments: {
    conta_id: 'account_id',
    nome: 'name',
    tipo: 'type',
    valor_aportado: 'invested_value',
    quantidade: 'quantity',
    preco_medio: 'average_price',
    preco_atual: 'current_price',
    data_vencimento: 'maturity_date',
    rentabilidade: 'contracted_yield',
    corretora: 'broker',
    criado_em: 'created_at',
    atualizado_em: 'updated_at'
  },
  users: {
    nome: 'full_name',
    avatar: 'avatar_url',
    moeda: 'currency',
    idioma: 'locale',
    tema: 'theme',
    notificacoes: 'notifications_enabled',
    default_company: 'active_company_id',
    criado_em: 'created_at',
    atualizado_em: 'updated_at'
  }
};

function getTable(store) {
  return TABLE_MAP[store] || store;
}

function mapFields(store, record, direction) {
  const map = FIELD_MAP[store] || {};
  const mapped = {};
  Object.entries(record || {}).forEach(([key, value]) => {
    const targetKey = direction === 'toDb' ? map[key] || key : reverseFieldKey(map, key);
    mapped[targetKey] = value;
  });
  return mapped;
}

function reverseFieldKey(map, key) {
  const entry = Object.entries(map).find(([, v]) => v === key);
  return entry ? entry[0] : key;
}

function mapFromDb(store, record) {
  return mapFields(store, record, 'fromDb');
}

function mapToDb(store, record) {
  return mapFields(store, record, 'toDb');
}

function applyUserFilter(query, store) {
  const userId = Store.getState().user?.id;
  if (!userId) return query;

  if (store === 'categories') {
    return query.or(`user_id.eq.${userId},user_id.is.null`);
  }

  if (store !== 'users') {
    return query.eq('user_id', userId);
  }

  return query;
}

function mapFilters(store, filters) {
  if (!filters) return {};
  const map = FIELD_MAP[store] || {};
  return Object.entries(filters).reduce((acc, [key, value]) => {
    acc[map[key] || key] = value;
    return acc;
  }, {});
}

export const DB = {
  async init() {
    return Promise.resolve();
  },

  async get(store, id) {
    const table = getTable(store);
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) throw error;
    return mapFromDb(store, data);
  },

  async getAll(store, filters = {}) {
    const table = getTable(store);
    let query = supabase.from(table).select('*');
    query = applyUserFilter(query, store);

    const mappedFilters = mapFilters(store, filters);
    Object.entries(mappedFilters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((item) => mapFromDb(store, item));
  },

  async add(store, record) {
    const table = getTable(store);
    const payload = mapToDb(store, record);
    if (!payload.user_id && store !== 'users') {
      payload.user_id = Store.getState().user?.id || null;
    }

    const { data, error } = await supabase.from(table).insert(payload).select('*').single();
    if (error) throw error;
    return mapFromDb(store, data);
  },

  async update(store, id, patch) {
    const table = getTable(store);
    const payload = mapToDb(store, patch);
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from(table).update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return mapFromDb(store, data);
  },

  async delete(store, id) {
    const table = getTable(store);
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  },

  async clear(store) {
    const table = getTable(store);
    let query = supabase.from(table).delete();
    query = applyUserFilter(query, store);
    const { error } = await query;
    if (error) throw error;
  },

  async count(store) {
    const table = getTable(store);
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    query = applyUserFilter(query, store);
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },

  async exportAll() {
    const exports = {};
    const stores = Object.keys(TABLE_MAP);
    for (const store of stores) {
      exports[store] = await this.getAll(store);
    }
    return exports;
  },

  async importAll(json) {
    if (!json || typeof json !== 'object') throw new Error('Invalid import data');

    for (const [store, items] of Object.entries(json)) {
      if (!Array.isArray(items) || items.length === 0) continue;
      const table = getTable(store);
      const payload = items.map((item) => mapToDb(store, item));
      const { error } = await supabase.from(table).insert(payload);
      if (error) throw error;
    }
  }
};

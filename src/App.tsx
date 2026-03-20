import React, { useEffect, useMemo, useState } from 'react';

type Conta = {
  id: string;
  nome: string;
  saldo: number;
};

type Transacao = {
  id: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  contaId: string;
  data: string;
  descricao: string;
};

type Resumo = {
  saldoTotal: number;
  receitasMes: number;
  despesasMes: number;
  saldoLiquido: number;
};

const STORAGE_KEY = 'fincore_react_data';

function readStorage(): { contas: Conta[]; transacoes: Transacao[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { contas: [], transacoes: [] };
    const parsed = JSON.parse(raw);
    return {
      contas: Array.isArray(parsed.contas) ? parsed.contas : [],
      transacoes: Array.isArray(parsed.transacoes) ? parsed.transacoes : []
    };
  } catch {
    return { contas: [], transacoes: [] };
  }
}

function writeStorage(contas: Conta[], transacoes: Transacao[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ contas, transacoes }));
}

function calcularResumo(contas: Conta[], transacoes: Transacao[]): Resumo {
  const saldoTotal = contas.reduce((sum, conta) => sum + conta.saldo, 0);

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const receitasMes = transacoes.reduce((sum, tx) => {
    const date = new Date(tx.data);
    if (tx.tipo === 'receita' && date.getMonth() === month && date.getFullYear() === year) {
      return sum + tx.valor;
    }
    return sum;
  }, 0);

  const despesasMes = transacoes.reduce((sum, tx) => {
    const date = new Date(tx.data);
    if (tx.tipo === 'despesa' && date.getMonth() === month && date.getFullYear() === year) {
      return sum + tx.valor;
    }
    return sum;
  }, 0);

  return {
    saldoTotal,
    receitasMes,
    despesasMes,
    saldoLiquido: receitasMes - despesasMes
  };
}

function generateId() {
  return crypto.randomUUID();
}

export default function App() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  const [novaContaNome, setNovaContaNome] = useState('');
  const [transacaoContaId, setTransacaoContaId] = useState('');
  const [transacaoTipo, setTransacaoTipo] = useState<'receita' | 'despesa'>('receita');
  const [transacaoValor, setTransacaoValor] = useState('');
  const [transacaoData, setTransacaoData] = useState(() => new Date().toISOString().slice(0, 10));
  const [transacaoDescricao, setTransacaoDescricao] = useState('');

  useEffect(() => {
    const data = readStorage();
    setContas(data.contas);
    setTransacoes(data.transacoes);
  }, []);

  useEffect(() => {
    writeStorage(contas, transacoes);
  }, [contas, transacoes]);

  function addConta(nome: string) {
    const trimmed = nome.trim();
    if (!trimmed) return;
    const novaConta: Conta = {
      id: generateId(),
      nome: trimmed,
      saldo: 0
    };
    setContas((prev) => [...prev, novaConta]);
    setNovaContaNome('');
  }

  function addTransacao(transacao: Omit<Transacao, 'id'>) {
    const contaIndex = contas.findIndex((c) => c.id === transacao.contaId);
    if (contaIndex === -1) return;

    const novaTransacao: Transacao = {
      id: generateId(),
      ...transacao
    };

    setContas((prev) => {
      const next = [...prev];
      const conta = next[contaIndex];
      const delta = transacao.tipo === 'receita' ? transacao.valor : -transacao.valor;
      next[contaIndex] = { ...conta, saldo: conta.saldo + delta };
      return next;
    });

    setTransacoes((prev) => [novaTransacao, ...prev]);

    setTransacaoContaId('');
    setTransacaoTipo('receita');
    setTransacaoValor('');
    setTransacaoDescricao('');
    setTransacaoData(new Date().toISOString().slice(0, 10));
  }

  const resumo = useMemo(() => calcularResumo(contas, transacoes), [contas, transacoes]);

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Dashboard Financeiro</h1>

      <section style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div>
          <strong>Saldo Total</strong>
          <div>R$ {resumo.saldoTotal.toFixed(2)}</div>
        </div>
        <div>
          <strong>Receitas do Mes</strong>
          <div>R$ {resumo.receitasMes.toFixed(2)}</div>
        </div>
        <div>
          <strong>Despesas do Mes</strong>
          <div>R$ {resumo.despesasMes.toFixed(2)}</div>
        </div>
        <div>
          <strong>Saldo Liquido</strong>
          <div>R$ {resumo.saldoLiquido.toFixed(2)}</div>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Nova Conta</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={novaContaNome}
            onChange={(e) => setNovaContaNome(e.target.value)}
            placeholder="Nome da conta"
          />
          <button onClick={() => addConta(novaContaNome)}>Nova Conta</button>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Nova Transacao</h2>
        <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
          <select value={transacaoContaId} onChange={(e) => setTransacaoContaId(e.target.value)}>
            <option value="">Selecione uma conta</option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.nome}
              </option>
            ))}
          </select>
          <select value={transacaoTipo} onChange={(e) => setTransacaoTipo(e.target.value as 'receita' | 'despesa')}>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
          <input
            type="number"
            step="0.01"
            value={transacaoValor}
            onChange={(e) => setTransacaoValor(e.target.value)}
            placeholder="Valor"
          />
          <input type="date" value={transacaoData} onChange={(e) => setTransacaoData(e.target.value)} />
          <input
            value={transacaoDescricao}
            onChange={(e) => setTransacaoDescricao(e.target.value)}
            placeholder="Descricao"
          />
          <button
            onClick={() => {
              const valor = Number(transacaoValor);
              if (!transacaoContaId || Number.isNaN(valor) || valor <= 0) return;
              addTransacao({
                tipo: transacaoTipo,
                valor,
                contaId: transacaoContaId,
                data: transacaoData,
                descricao: transacaoDescricao
              });
            }}
          >
            Nova Transacao
          </button>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Contas</h2>
        {contas.length === 0 ? (
          <div>Nenhuma conta cadastrada ainda</div>
        ) : (
          <ul>
            {contas.map((conta) => (
              <li key={conta.id}>
                {conta.nome} - R$ {conta.saldo.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Transacoes</h2>
        {transacoes.length === 0 ? (
          <div>Nenhuma transacao registrada ainda</div>
        ) : (
          <ul>
            {transacoes.map((tx) => (
              <li key={tx.id}>
                {tx.data} - {tx.descricao} - {tx.tipo} - R$ {tx.valor.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

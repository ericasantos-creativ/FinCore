# 📋 PRD — FinCore: Sistema de Controle Financeiro
**Product Requirements Document**
**Versão:** 1.0.0
**Data:** Março / 2026
**Status:** Em Desenvolvimento

---

## 📌 Índice

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Identidade Visual](#2-identidade-visual)
3. [Arquitetura e Tecnologias](#3-arquitetura-e-tecnologias)
4. [PWA — Progressive Web App](#4-pwa--progressive-web-app)
5. [Tema Claro e Escuro](#5-tema-claro-e-escuro)
6. [Estrutura do HTML](#6-estrutura-do-html)
7. [Telas e Seções](#7-telas-e-seções)
8. [Componentes CSS e Animações](#8-componentes-css-e-animações)
9. [Funções JavaScript](#9-funções-javascript)
10. [Schema de Tabelas (LocalStorage / IndexedDB)](#10-schema-de-tabelas-localstorage--indexeddb)
11. [APIs e Integrações Externas](#11-apis-e-integrações-externas)
12. [Fluxo de Dados](#12-fluxo-de-dados)
13. [Responsividade](#13-responsividade)
14. [Acessibilidade](#14-acessibilidade)
15. [Fases de Implementação](#15-fases-de-implementação)
16. [Critérios de Aceite](#16-critérios-de-aceite)
17. [Riscos e Mitigações](#17-riscos-e-mitigações)

---

## 1. Visão Geral do Produto

### O que é o FinCore?

O **FinCore** É uma aplicação web do tipo **Progressive Web App (PWA)** para controle financeiro pessoal e empresarial. Ele permite que usuários gerenciem receitas, despesas, investimentos, metas financeiras, contas bancárias, fornecedores, transações e relatórios — tudo em uma interface moderna, responsiva e offline-first.

### Proposta de Valor

- Controle financeiro completo em uma única plataforma
- Acesso em qualquer dispositivo (desktop, tablet, mobile)
- Funciona offline via Service Worker
- Instalável como aplicativo nativo (PWA)
- Suporte a múltiplas empresas / contas
- Relatórios visuais em tempo real
- Tema claro e escuro

### Público-Alvo

| Perfil | Descrição |
|---|---|
| Empreendedor Individual | Controla suas finanças pessoais e do negócio |
| Pequena Empresa | Gestão de fluxo de caixa, fornecedores e contas |
| Profissional Liberal | Controle de receitas variáveis e investimentos |
| Pessoa Física | Organização de orçamento pessoal e metas |

---

## 2. Identidade Visual

### Conceito

A identidade visual do FinCore é construída sobre os pilares de **confiança**, **clareza** e **prosperidade**. O azul remete à solidez financeira, segurança bancária e tecnologia. O preto confere sofisticação e seriedade. Tons de verde são usados como elementos de aprovação/ganho, e vermelho para alertas/perdas.

---

### 2.1 Paleta de Cores — Tema Escuro (Padrão)

| Token | Nome | Hex | Uso |
|---|---|---|---|
| `--color-bg-primary` | Azul Noturno | `#0A0F1E` | Background principal |
| `--color-bg-secondary` | Azul Escuro | `#0D1526` | Cards, sidebars |
| `--color-bg-tertiary` | Azul Médio Escuro | `#111D35` | Inputs, modais |
| `--color-accent-primary` | Azul Elétrico | `#1A6BFF` | CTAs, links, destaques |
| `--color-accent-secondary` | Azul Ciano | `#00C2FF` | Ícones, gradientes |
| `--color-accent-glow` | Azul Brilho | `#2979FF` | Efeitos de glow |
| `--color-success` | Verde Esmeralda | `#00D68F` | Ganhos, confirmações |
| `--color-danger` | Vermelho Coral | `#FF4D6A` | Perdas, erros, alertas |
| `--color-warning` | Âmbar | `#FFB830` | Avisos, pendências |
| `--color-text-primary` | Branco Puro | `#FFFFFF` | Títulos, textos principais |
| `--color-text-secondary` | Cinza Claro | `#A8B3C8` | Subtítulos, labels |
| `--color-text-muted` | Cinza Médio | `#5A6A82` | Placeholder, texto inativo |
| `--color-border` | Azul Borda | `#1E2D4A` | Bordas de cards e inputs |
| `--color-gradient-start` | Azul Royal | `#1A6BFF` | Início do gradiente |
| `--color-gradient-end` | Azul Ciano | `#00C2FF` | Fim do gradiente |

---

### 2.2 Paleta de Cores — Tema Claro

| Token | Nome | Hex | Uso |
|---|---|---|---|
| `--color-bg-primary` | Branco Nuvem | `#F4F7FF` | Background principal |
| `--color-bg-secondary` | Branco Gelo | `#FFFFFF` | Cards |
| `--color-bg-tertiary` | Azul Muito Claro | `#EAF0FF` | Inputs, modais |
| `--color-accent-primary` | Azul Royal | `#1A6BFF` | CTAs, links |
| `--color-accent-secondary` | Azul Médio | `#0050CC` | Hover, selecionado |
| `--color-success` | Verde Sálvia | `#00B87A` | Ganhos |
| `--color-danger` | Vermelho Vivo | `#E63152` | Perdas |
| `--color-warning` | Laranja Suave | `#F59E0B` | Avisos |
| `--color-text-primary` | Azul Carvão | `#0A1628` | Títulos |
| `--color-text-secondary` | Azul Aço | `#3D5280` | Subtítulos |
| `--color-text-muted` | Cinza Azulado | `#8298B8` | Placeholders |
| `--color-border` | Azul Névoa | `#D0DCF5` | Bordas |

---

### 2.3 Tipografia

| Função | Fonte | Peso | Tamanho |
|---|---|---|---|
| Marca / Logo | `Inter` | 800 | 24px |
| Títulos de Tela | `Inter` | 700 | 22–28px |
| Subtítulos / Labels | `Inter` | 600 | 14–18px |
| Corpo de Texto | `Inter` | 400 | 14–16px |
| Valores Monetários | `JetBrains Mono` | 600 | 16–32px |
| Código / Dados Técnicos | `JetBrains Mono` | 400 | 13px |

---

### 2.4 Espaçamento e Grid

- **Base unit:** `4px`
- **Grid:** 12 colunas com gutter de 16px (mobile) / 24px (desktop)
- **Border Radius:** `8px` (small), `12px` (medium), `16px` (large), `24px` (cards)
- **Sombra Padrão (dark):** `0 4px 20px rgba(26, 107, 255, 0.12)`
- **Sombra Hover (dark):** `0 8px 32px rgba(26, 107, 255, 0.24)`

---

## 3. Arquitetura e Tecnologias

### 3.1 Stack Tecnológico

| Camada | Tecnologia | Versão | Justificativa |
|---|---|---|---|
| **Frontend Core** | HTML5 | — | Estrutura semântica |
| **Estilização** | CSS3 + CSS Custom Properties | — | Temas, animações nativas |
| **Lógica** | JavaScript (ES2022+) | — | Vanilla JS, zero dependências de framework |
| **PWA** | Service Worker API | — | Offline-first, instalação nativa |
| **Armazenamento Local** | LocalStorage + IndexedDB | — | Dados offline |
| **Gráficos** | Chart.js | 4.x | Gráficos de linha, barra, pizza |
| **Ícones** | Lucide Icons (SVG inline) | — | Ícones leves e acessíveis |
| **Fontes** | Google Fonts (Inter + JetBrains Mono) | — | Tipografia profissional |
| **Notificações** | Web Notifications API | — | Alertas de metas e vencimentos |
| **Exportação** | jsPDF + SheetJS | — | Exportar relatórios em PDF e XLSX |
| **Formatação** | Intl.NumberFormat | — | Formatação monetária localizada (pt-BR) |

---

### 3.2 Estrutura de Arquivos

```
fincore/
├── index.html              # Shell da aplicação (SPA)
├── manifest.json           # Manifesto PWA
├── service-worker.js       # Service Worker (cache + offline)
├── assets/
│   ├── css/
│   │   ├── variables.css   # CSS Custom Properties (tokens de design)
│   │   ├── reset.css       # Reset / Normalize
│   │   ├── animations.css  # Keyframes globais
│   │   ├── components.css  # Botões, inputs, cards, badges
│   │   ├── layout.css      # Grid, sidebar, header, footer
│   │   ├── screens.css     # Estilos específicos por tela
│   │   └── responsive.css  # Media queries
│   ├── js/
│   │   ├── app.js          # Bootstrap da aplicação
│   │   ├── router.js       # Roteamento entre telas
│   │   ├── store.js        # Gerenciamento de estado (Store pattern)
│   │   ├── db.js           # Abstração IndexedDB
│   │   ├── auth.js         # Autenticação e sessão
│   │   ├── theme.js        # Alternância de tema
│   │   ├── charts.js       # Inicialização de gráficos
│   │   ├── utils.js        # Helpers e formatação
│   │   └── modules/
│   │       ├── dashboard.js
│   │       ├── transactions.js
│   │       ├── companies.js
│   │       ├── reports.js
│   │       ├── accounts.js
│   │       ├── goals.js
│   │       ├── investments.js
│   │       ├── suppliers.js
│   │       ├── calendar.js
│   │       └── profile.js
│   ├── icons/
│   │   └── icon-*.png      # Ícones PWA (72, 96, 128, 144, 152, 192, 384, 512px)
│   └── splash/
│       └── splash-*.png    # Splash screens iOS
└── offline.html            # Página fallback offline
```

---

### 3.3 Padrões de Código

- **Padrão de módulos:** ES Modules nativos (`import/export`)
- **Estado:** Singleton Store com pub/sub
- **Eventos:** Event Delegation no document
- **Componentização:** Web Components nativos (Custom Elements)
- **Nomenclatura CSS:** BEM (Block__Element--Modifier)
- **Nomenclatura JS:** camelCase para funções, UPPER_SNAKE_CASE para constantes

---

## 4. PWA — Progressive Web App

### 4.1 Manifesto (`manifest.json`)

```json
{
  "name": "FinCore — Controle Financeiro",
  "short_name": "FinCore",
  "description": "Sistema completo de controle financeiro pessoal e empresarial",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#0A0F1E",
  "theme_color": "#1A6BFF",
  "lang": "pt-BR",
  "categories": ["finance", "productivity", "business"],
  "icons": [
    { "src": "assets/icons/icon-72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "assets/icons/icon-96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "assets/icons/icon-128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "assets/icons/icon-144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "assets/icons/icon-152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "assets/icons/icon-384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "screenshots": [
    { "src": "assets/screenshots/desktop.png", "sizes": "1280x800", "type": "image/png", "form_factor": "wide" },
    { "src": "assets/screenshots/mobile.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow" }
  ]
}
```

---

### 4.2 Service Worker

**Estratégias de Cache:**

| Recurso | Estratégia | TTL |
|---|---|---|
| HTML Shell (`index.html`) | Network First | 24h |
| CSS / JS (assets estáticos) | Cache First | 30 dias |
| Fontes Google | Stale While Revalidate | 365 dias |
| Ícones / Imagens | Cache First | 30 dias |
| API calls / dados dinâmicos | Network First + fallback local | — |

**Eventos do Service Worker:**

```
install   → Pre-cache de assets estáticos
activate  → Limpeza de caches antigos
fetch     → Intercepta requests e aplica estratégia
sync      → Background Sync para operações offline
push      → Web Push Notifications (alertas de metas)
```

---

### 4.3 Critérios Lighthouse PWA

| Critério | Meta |
|---|---|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 90 |
| PWA Score | 100% |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3.0s |
| Offline funcionando | ✅ |
| Instalável | ✅ |

---

## 5. Tema Claro e Escuro

### Implementação

O sistema de temas é baseado exclusivamente em **CSS Custom Properties** e um atributo `data-theme` no elemento `<html>`. Sem JavaScript extra em tempo de execução para aplicar temas.

```css
/* Tema escuro (padrão) */
:root,
[data-theme="dark"] {
  --color-bg-primary: #0A0F1E;
  --color-bg-secondary: #0D1526;
  /* ... demais tokens ... */
}

/* Tema claro */
[data-theme="light"] {
  --color-bg-primary: #F4F7FF;
  --color-bg-secondary: #FFFFFF;
  /* ... demais tokens ... */
}

/* Preferência do sistema operacional */
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    --color-bg-primary: #F4F7FF;
    /* ... */
  }
}
```

**Persistência:** A preferência de tema é salva em `localStorage` com a chave `fincore_theme`.

**Transição:** Todas as propriedades de cor têm `transition: color 0.3s ease, background-color 0.3s ease` para uma troca suave.

---

## 6. Estrutura do HTML

### 6.1 Hierarquia de Telas

```
#splash-screen          → Capa animada de entrada
#auth-screen            → Login / Registro
#app-shell              → Wrapper principal da aplicação
  ├── #sidebar          → Navegação lateral (desktop)
  ├── #header           → Cabeçalho (mobile + desktop)
  ├── #main-content     → Container de telas
  │   ├── #screen-dashboard
  │   ├── #screen-transactions
  │   ├── #screen-companies
  │   ├── #screen-reports
  │   ├── #screen-accounts
  │   ├── #screen-goals
  │   ├── #screen-investments
  │   ├── #screen-suppliers
  │   ├── #screen-calendar
  │   └── #screen-profile
  └── #bottom-nav       → Navegação inferior (mobile)
```

---

### 6.2 Elementos Globais

| Elemento | ID / Classe | Descrição |
|---|---|---|
| Modal container | `#modal-container` | Wrapper de todos os modais |
| Toast notifications | `#toast-container` | Notificações temporárias |
| Loading overlay | `#loading-overlay` | Spinner global de carregamento |
| Confirm dialog | `#confirm-dialog` | Diálogo de confirmação genérico |
| Search overlay | `#search-overlay` | Busca global com atalho `Ctrl+K` |
| FAB button | `#fab-btn` | Botão flutuante "+" (mobile) |

---

## 7. Telas e Seções

### 7.1 🎬 Splash Screen

**Objetivo:** Apresentar a marca com uma animação de entrada enquanto o app carrega.

**Elementos:**
- Logo animado com efeito `pulse` + `fadeIn`
- Nome "FinCore" com animação de digitação (typewriter)
- Barra de progresso de carregamento (0–100%)
- Tagline: *"Seu financeiro. Sob controle."*
- Partículas flutuantes no background (CSS puro)

**Duração:** 2.5s (automático) ou até assets carregados

**Comportamento:** Ao concluir, transita com `fadeOut` + `scaleDown` para a tela de login.

---

### 7.2 🔐 Login Screen

**Objetivo:** Autenticar o usuário.

**Campos:**
- E-mail (input type="email", validação em tempo real)
- Senha (input type="password", toggle de visibilidade)
- Checkbox "Lembrar-me" (token em localStorage)
- Botão "Entrar"
- Link "Esqueci minha senha"
- Link "Criar conta"

**Validações:**
- E-mail com formato válido
- Senha mínimo 8 caracteres
- Feedback visual inline (borda verde/vermelha + mensagem)
- Shake animation em erro

**Autenticação Local:** Para o MVP, usuários são armazenados no IndexedDB. Suporte a autenticação via JWT em versões futuras com backend.

---

### 7.3 🏠 Dashboard

**Objetivo:** Visão geral consolidada das finanças.

**Widgets / Cards:**

| Widget | Descrição |
|---|---|
| Saldo Total | Soma de todas as contas ativas |
| Receitas do Mês | Total de entradas no mês corrente |
| Despesas do Mês | Total de saídas no mês corrente |
| Saldo Líquido | Receitas - Despesas |
| Gráfico Fluxo de Caixa | Linha: últimos 6 meses |
| Gráfico Categorias | Pizza: distribuição de despesas |
| Transações Recentes | Lista das 5 últimas movimentações |
| Metas em Progresso | Cards de metas com barra de progresso |
| Investimentos | Resumo de rentabilidade |
| Alertas / Lembretes | Contas a vencer nos próximos 7 dias |

---

### 7.4 💸 Transações

**Objetivo:** Registrar e gerenciar todas as movimentações financeiras.

**Funcionalidades:**
- Listagem com filtros (tipo, categoria, período, conta, empresa)
- Busca por descrição
- Paginação (50 registros por página) ou scroll infinito
- Ordenação por coluna
- Adição de transação (modal)
- Edição inline
- Exclusão com confirmação
- Importação via CSV/OFX
- Exportação para CSV/PDF
- Transferência entre contas

**Campos de Transação:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| tipo | enum (receita/despesa/transferência) | ✅ |
| descricao | string (max 120) | ✅ |
| valor | decimal (2 casas) | ✅ |
| data | date | ✅ |
| categoria_id | FK | ✅ |
| conta_id | FK | ✅ |
| empresa_id | FK | — |
| fornecedor_id | FK | — |
| recorrente | boolean | — |
| frequencia | enum (diária/semanal/mensal/anual) | — |
| observacao | text | — |
| anexo | base64 (max 2MB) | — |
| status | enum (efetivada/pendente/cancelada) | ✅ |
| tags | array(string) | — |

---

### 7.5 🏢 Empresas

**Objetivo:** Gerenciar múltiplas empresas/negócios.

**Funcionalidades:**
- CRUD de empresas
- Seleção de empresa ativa (contexto global)
- Dashboard por empresa
- Separação de finanças por entidade

**Campos:**

| Campo | Tipo |
|---|---|
| nome | string |
| cnpj | string (formatado) |
| segmento | string |
| logo | base64 |
| cor_identificadora | hex |
| ativa | boolean |

---

### 7.6 📊 Relatórios

**Objetivo:** Análise financeira avançada com gráficos interativos.

**Tipos de Relatório:**

| Relatório | Gráfico | Filtros |
|---|---|---|
| Fluxo de Caixa | Linha | Período, Empresa, Conta |
| DRE Simplificado | Barra agrupada | Mês/Ano |
| Despesas por Categoria | Pizza + Barra | Período |
| Evolução Patrimonial | Área | Período |
| Receitas vs Despesas | Barra comparativa | Período, Categoria |
| Extrato Detalhado | Tabela | Todos os filtros |
| Análise de Investimentos | Linha + Retorno % | Período |
| Projeção Financeira | Linha tracejada | 3, 6, 12 meses |

**Exportação:** PDF (jsPDF) e XLSX (SheetJS)

---

### 7.7 🏦 Contas

**Objetivo:** Gerenciar contas bancárias, carteiras e cartões.

**Tipos de Conta:**
- Conta Corrente
- Conta Poupança
- Cartão de Crédito
- Carteira Digital
- Caixa (dinheiro físico)
- Investimento (conta custódia)

**Campos:**

| Campo | Tipo |
|---|---|
| nome | string |
| tipo | enum |
| banco | string |
| agencia | string |
| numero | string |
| saldo_inicial | decimal |
| saldo_atual | decimal (calculado) |
| limite_credito | decimal |
| cor | hex |
| icone | string |
| ativa | boolean |
| empresa_id | FK |

---

### 7.8 🎯 Metas

**Objetivo:** Definir e acompanhar objetivos financeiros.

**Funcionalidades:**
- Criação de meta com valor alvo e prazo
- Depósitos manuais em metas
- Progresso visual (barra animada)
- Projeção de alcance (baseado no ritmo atual)
- Notificação ao atingir meta
- Categorias de meta: Emergência, Viagem, Bem, Educação, Aposentadoria, Outro

**Campos:**

| Campo | Tipo |
|---|---|
| nome | string |
| descricao | text |
| valor_alvo | decimal |
| valor_atual | decimal |
| data_inicio | date |
| data_prazo | date |
| categoria | enum |
| icone | string |
| cor | hex |
| conta_vinculada | FK |
| concluida | boolean |

---

### 7.9 📈 Investimentos

**Objetivo:** Acompanhar carteira de investimentos.

**Tipos de Ativo:**
- Renda Fixa (CDB, LCI, LCA, Tesouro)
- Renda Variável (Ações, FIIs)
- Criptomoedas
- Fundos de Investimento
- Previdência Privada

**Funcionalidades:**
- Registro de aportes e resgates
- Rentabilidade % por ativo e total
- Gráfico de evolução patrimonial
- Comparação com benchmarks (CDI, IBOVESPA, IPCA)
- Cotação em tempo real (via API externa — opcional)

**Campos:**

| Campo | Tipo |
|---|---|
| nome | string |
| ticker | string |
| tipo | enum |
| valor_aportado | decimal |
| quantidade | decimal |
| preco_medio | decimal |
| preco_atual | decimal (manual ou API) |
| data_vencimento | date |
| rentabilidade_contratada | string |
| corretora | string |
| conta_id | FK |

---

### 7.10 🤝 Fornecedores

**Objetivo:** Cadastro e gestão de fornecedores.

**Funcionalidades:**
- CRUD completo
- Histórico de pagamentos
- Filtros por status, categoria, empresa

**Campos:**

| Campo | Tipo |
|---|---|
| nome | string |
| cnpj_cpf | string |
| categoria | string |
| email | string |
| telefone | string |
| endereco | object |
| banco | string |
| agencia | string |
| conta | string |
| chave_pix | string |
| ativo | boolean |
| observacao | text |

---

### 7.11 📅 Calendário

**Objetivo:** Visualização temporal de transações, vencimentos e metas.

**Funcionalidades:**
- Visão mensal / semanal / diária
- Indicadores coloridos por tipo (receita/despesa/meta)
- Clique no dia para ver transações
- Destaque de datas com vencimentos
- Agendamento de transações futuras

---

### 7.12 👤 Perfil

**Objetivo:** Configurações do usuário e da aplicação.

**Seções:**
- Dados pessoais (nome, e-mail, avatar)
- Troca de senha
- Preferências (moeda, idioma, tema, notificações)
- Categorias personalizadas
- Backup / Exportar dados (JSON)
- Restaurar backup
- Excluir conta
- Sobre o FinCore (versão, licença)

---

## 8. Componentes CSS e Animações

### 8.1 Keyframes Globais

```css
/* Entrada suave */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Flutuação contínua (splash / decorações) */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
}

/* Pulso (logo, badges de alerta) */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.05); opacity: 0.85; }
}

/* Brilho (botões CTA, ícones de destaque) */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 8px rgba(26, 107, 255, 0.4); }
  50%       { box-shadow: 0 0 24px rgba(26, 107, 255, 0.8); }
}

/* Shake (erro de formulário) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}

/* Slide In (modais, drawers) */
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

/* Contagem numérica (valores no dashboard) */
@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Barra de progresso */
@keyframes progressFill {
  from { width: 0%; }
  to   { width: var(--progress-value); }
}

/* Rotação (loading spinner) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Typewriter (splash screen) */
@keyframes typewriter {
  from { width: 0; }
  to   { width: 100%; }
}
```

---

### 8.2 Componentes Principais

| Componente | Classe BEM | Descrição |
|---|---|---|
| Card | `.card` | Container com borda, sombra e padding padrão |
| Card Hover | `.card--interactive` | Card com elevação ao hover |
| Botão Primário | `.btn--primary` | CTA com gradiente azul |
| Botão Secundário | `.btn--secondary` | Outline azul |
| Botão Danger | `.btn--danger` | Vermelho para exclusão |
| Badge | `.badge` | Etiqueta colorida para status |
| Input | `.input` | Campo de texto estilizado |
| Select | `.select` | Dropdown customizado |
| Toggle Switch | `.toggle` | Checkbox estilo iOS |
| Progress Bar | `.progress-bar` | Barra de progresso animada |
| Skeleton | `.skeleton` | Placeholder de carregamento |
| Avatar | `.avatar` | Foto de perfil com fallback |
| Tooltip | `.tooltip` | Dica ao hover |
| Chip / Tag | `.chip` | Tag removível |
| Divider | `.divider` | Linha separadora |
| Stat Card | `.stat-card` | Card de métrica com ícone e valor |
| Modal | `.modal` | Overlay com conteúdo centralizado |
| Drawer | `.drawer` | Painel lateral deslizante |
| Toast | `.toast` | Notificação temporária |
| Dropdown Menu | `.dropdown` | Menu contextual |
| Table | `.data-table` | Tabela responsiva com ordenação |
| Empty State | `.empty-state` | Ilustração quando sem dados |

---

### 8.3 Efeitos Hover e Transições

```css
/* Transição padrão global */
* {
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Card hover */
.card--interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(26, 107, 255, 0.2);
}

/* Botão hover */
.btn--primary:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

/* Link hover */
a:hover {
  color: var(--color-accent-secondary);
  text-decoration: underline;
}

/* Sidebar item hover */
.nav-item:hover {
  background: rgba(26, 107, 255, 0.12);
  border-left: 3px solid var(--color-accent-primary);
  padding-left: calc(var(--spacing) - 3px);
}
```

---

## 9. Funções JavaScript

### 9.1 `store.js` — Gerenciamento de Estado

```
Store.getState()        → Retorna estado atual
Store.setState(patch)   → Merge com estado atual + notifica subscribers
Store.subscribe(fn)     → Inscreve listener para mudanças
Store.unsubscribe(fn)   → Remove listener
Store.reset()           → Restaura estado inicial
```

**Estado global:**
```json
{
  "user": {},
  "activeCompany": null,
  "activeScreen": "dashboard",
  "theme": "dark",
  "transactions": [],
  "accounts": [],
  "categories": [],
  "goals": [],
  "investments": [],
  "suppliers": [],
  "companies": [],
  "filters": {},
  "isLoading": false,
  "notifications": []
}
```

---

### 9.2 `db.js` — Abstração IndexedDB

```
DB.init()                         → Abre / cria o banco
DB.get(store, id)                 → Busca por ID
DB.getAll(store, filters?)        → Busca com filtros opcionais
DB.add(store, record)             → Insere novo registro
DB.update(store, id, patch)       → Atualiza parcialmente
DB.delete(store, id)              → Remove por ID
DB.clear(store)                   → Limpa toda a store
DB.count(store)                   → Conta registros
DB.exportAll()                    → Exporta todo o banco como JSON
DB.importAll(json)                → Importa backup JSON
```

---

### 9.3 `auth.js` — Autenticação

```
Auth.login(email, password)       → Valida credenciais e inicia sessão
Auth.logout()                     → Limpa sessão e redireciona
Auth.register(userData)           → Cria novo usuário
Auth.isAuthenticated()            → Verifica sessão ativa
Auth.getSession()                 → Retorna dados do usuário logado
Auth.updatePassword(old, new)     → Atualiza senha com validação
Auth.requestPasswordReset(email)  → Envia token de recuperação
```

---

### 9.4 `modules/dashboard.js`

```
Dashboard.init()                  → Inicializa widgets
Dashboard.loadSummary()           → Calcula saldo, receitas, despesas
Dashboard.renderCharts()          → Renderiza Chart.js (fluxo + categorias)
Dashboard.loadRecentTransactions()→ Busca últimas 5 transações
Dashboard.loadGoalsProgress()     → Calcula % de cada meta
Dashboard.loadAlerts()            → Transações vencendo em 7 dias
Dashboard.refreshAll()            → Re-render completo do dashboard
```

---

### 9.5 `modules/transactions.js`

```
Transactions.init()               → Carrega lista com filtros padrão
Transactions.loadList(filters)    → Busca com filtros aplicados
Transactions.openModal(id?)       → Abre modal (criação ou edição)
Transactions.save(data)           → Valida e salva transação
Transactions.delete(id)           → Remove com confirmação
Transactions.toggleStatus(id)     → Alterna efetivada/pendente
Transactions.importCSV(file)      → Importa arquivo CSV
Transactions.importOFX(file)      → Importa arquivo OFX
Transactions.export(format)       → Exporta como CSV ou PDF
Transactions.applyFilters()       → Aplica filtros ativos
Transactions.clearFilters()       → Limpa todos os filtros
Transactions.createRecurrence()   → Gera transações recorrentes
```

---

### 9.6 `modules/reports.js`

```
Reports.init()                    → Carrega relatório padrão
Reports.render(type, filters)     → Renderiza relatório específico
Reports.renderCashFlow()          → Fluxo de caixa (Chart.js)
Reports.renderByCategory()        → Pizza de categorias
Reports.renderPatrimony()         → Evolução patrimonial
Reports.renderProjection()        → Projeção futura com regressão linear
Reports.exportPDF()               → Gera PDF com jsPDF
Reports.exportXLSX()              → Gera planilha com SheetJS
```

---

### 9.7 `charts.js`

```
Charts.createLine(ctx, data, options)    → Cria gráfico de linha
Charts.createBar(ctx, data, options)     → Cria gráfico de barra
Charts.createPie(ctx, data, options)     → Cria gráfico de pizza
Charts.createArea(ctx, data, options)    → Cria gráfico de área
Charts.update(chartId, newData)          → Atualiza dados sem re-render
Charts.destroy(chartId)                  → Destrói instância
Charts.applyTheme(theme)                 → Aplica cores do tema atual
```

---

### 9.8 `utils.js`

```
Utils.formatCurrency(value, currency?)  → "R$ 1.234,56"
Utils.formatDate(date, format?)         → "15/03/2026"
Utils.formatPercent(value)              → "12,5%"
Utils.parseDate(string)                 → Date object
Utils.generateId()                      → UUID v4
Utils.debounce(fn, delay)               → Debounce
Utils.throttle(fn, delay)               → Throttle
Utils.deepClone(obj)                    → Clona objeto sem referência
Utils.groupBy(array, key)               → Agrupa array por chave
Utils.sumBy(array, key)                 → Soma valores de campo
Utils.sortBy(array, key, dir)           → Ordena array
Utils.validateCNPJ(cnpj)               → Valida CNPJ
Utils.validateCPF(cpf)                  → Valida CPF
Utils.validateEmail(email)              → Regex de email
Utils.maskCurrency(input)               → Máscara de moeda no input
Utils.showToast(msg, type, duration)    → Exibe notificação toast
Utils.showConfirm(msg)                  → Retorna Promise (confirm dialog)
```

---

### 9.9 `theme.js`

```
Theme.init()           → Lê preferência e aplica tema inicial
Theme.toggle()         → Alterna entre dark/light
Theme.setTheme(name)   → Define tema específico
Theme.getCurrent()     → Retorna "dark" ou "light"
Theme.persist(name)    → Salva no localStorage
```

---

### 9.10 `router.js`

```
Router.init()              → Registra rotas e inicializa
Router.navigate(screen)    → Navega para tela
Router.getCurrentScreen()  → Retorna tela ativa
Router.back()              → Retorna para tela anterior
Router.onBeforeNavigate(fn)→ Hook antes de navegar
Router.onAfterNavigate(fn) → Hook após navegar
```

---

## 10. Schema de Tabelas (LocalStorage / IndexedDB)

### 10.1 Stores do IndexedDB

**Banco:** `fincore_db` — **Versão:** `1`

---

#### `users`

| Campo | Tipo | Descrição |
|---|---|---|
| id | string (UUID) | PK |
| nome | string | Nome completo |
| email | string | E-mail único |
| password_hash | string | Hash SHA-256 + salt |
| avatar | string (base64) | Foto de perfil |
| moeda | string | Default "BRL" |
| idioma | string | Default "pt-BR" |
| tema | enum | "dark" \| "light" \| "system" |
| notificacoes | boolean | Default true |
| criado_em | ISO8601 | Data de criação |
| atualizado_em | ISO8601 | Última atualização |

---

#### `companies`

| Campo | Tipo | Descrição |
|---|---|---|
| id | string (UUID) | PK |
| user_id | string | FK → users.id |
| nome | string | Razão social / nome |
| cnpj | string | CNPJ formatado |
| segmento | string | Setor de atuação |
| logo | string (base64) | Logo |
| cor | string (hex) | Cor identificadora |
| ativa | boolean | Status |
| criado_em | ISO8601 | — |

---

#### `accounts`

| Campo | Tipo | Descrição |
|---|---|---|
| id | string (UUID) | PK |
| user_id | string | FK → users.id |
| empresa_id | string | FK → companies.id |
| nome | string | Nome da conta |
| tipo | enum | corrente\|poupanca\|cartao\|carteira\|caixa\|investimento |
| banco | string | Nome do banco |
| agencia | string | Número da agência |
| numero | string | Número da conta |
| saldo_inicial | decimal | Saldo de abertura |
| saldo_atual | decimal | Calculado via transactions |
| limite_credito | decimal | Somente cartão |
| cor | string (hex) | Cor identificadora |
| icone | string | Nome do ícone |
| ativa | boolean | Status |
| criado_em | ISO8601 | — |

---

#### `categories`

| Campo | Tipo | Descrição |
|---|---|---|
| id | string (UUID) | PK |
| user_id | string | FK (null = sistema) |
| nome | string | Nome da categoria |
| tipo | enum | receita\|despesa |
| icone | string | Ícone Lucide |
| cor | string (hex) | Cor |
| pai_id | string | FK (subcategoria) |
| sistema | boolean | Categoria padrão |

---

#### `transactions`

| Campo | Tipo | Descrição |
|---|---|---|
| id | string (UUID) | PK |
| user_id | string | FK → users.id |
| empresa_id | string | FK → companies.id |
| conta_id | string | FK → accounts.id |
| categoria_id | string | FK → categories.id |
| fornecedor_id | string | FK → suppliers.id |
| tipo | enum | receita\|despesa\|transferencia |
| descricao | string | Descrição |
| valor | decimal | Valor absoluto |
| data | date | Data da transação |
| status | enum | efetivada\|pendente\|cancelada |
| recorrente | boolean | É recorrente? |
| recorrencia_id | string | UUID do grupo recorrente |
| frequencia | enum | diaria\|semanal\|mensal\|anual |
| observacao | text | Notas adicionais |
| anexo | string (base64) | Comprovante (max 2MB) |
| tags | array(string) | Tags livres |
| transferencia_conta_destino | string | FK conta destino |
| criado_em | ISO8601 | — |
| atualizado_em | ISO8601 | — |

---

#### `goals`

| Campo | Tipo | Descrição |
|---|---|---|
| id | string (UUID) | PK |
| user_id | string | FK |
| nome | string | Nome da meta |
| descricao | text | Descrição |
| categoria | enum | emergencia\|viagem\|bem\|educacao\|aposentadoria\|outro |
| valor_alvo | decimal | Valor objetivo |
| valor_atual | decimal | Valor acumulado |
| data_inicio | date | Início |
| data_prazo | date | Prazo |
| conta_vinculada | string | FK → accounts.id |
| icone | string | Ícone |
| cor | string (hex) | Cor |
| concluida | boolean | Status |
| criado_em | ISO8601 | — |

---

#### `investments`

| Campo | Tipo | Descrição |
|---|---|---|
| id | string (UUID) | PK |
| user_id | string | FK |
| conta_id | string | FK → accounts.id |
| nome | string | Nome do ativo |
| ticker | string | Código do ativo |
| tipo | enum | renda_fixa\|acoes\|fii\|cripto\|fundo\|previdencia |
| valor_aportado | decimal | Total investido |
| quantidade | decimal | Qtd de cotas/unidades |
| preco_medio | decimal | Preço médio de compra |
| preco_atual | decimal | Cotação atual (manual) |
| data_vencimento | date | Para renda fixa |
| rentabilidade | string | "CDI+0.5%" |
| corretora | string | Instituição |
| criado_em | ISO8601 | — |

---

#### `suppliers`

| Campo | Tipo | Descrição |
|---|---|---|
| id | string (UUID) | PK |
| user_id | string | FK |
| empresa_id | string | FK |
| nome | string | Nome / Razão social |
| cnpj_cpf | string | Documento |
| categoria | string | Tipo de serviço |
| email | string | E-mail de contato |
| telefone | string | Telefone |
| endereco | JSON object | Endereço completo |
| banco | string | Banco para pagamento |
| agencia | string | — |
| conta_bancaria | string | — |
| chave_pix | string | Chave Pix |
| ativo | boolean | Status |
| observacao | text | Notas |
| criado_em | ISO8601 | — |

---

### 10.2 Chaves LocalStorage

| Chave | Tipo | Conteúdo |
|---|---|---|
| `fincore_theme` | string | "dark" \| "light" |
| `fincore_session` | JSON | `{ userId, token, expiresAt }` |
| `fincore_active_company` | string | UUID da empresa ativa |
| `fincore_dashboard_widgets` | JSON | Configuração de widgets |
| `fincore_filters_transactions` | JSON | Últimos filtros usados |
| `fincore_onboarding_done` | boolean | Se completou onboarding |
| `fincore_db_version` | number | Versão do schema IndexedDB |
| `fincore_last_sync` | ISO8601 | Última sincronização |
| `fincore_app_version` | string | Versão instalada do PWA |

---

## 11. APIs e Integrações Externas

### 11.1 APIs Utilizadas (MVP)

| API | Uso | Autenticação | Gratuito? |
|---|---|---|---|
| Google Fonts API | Carregamento de fontes Inter + JetBrains Mono | Pública | ✅ |
| Web Notifications API | Alertas de vencimentos e metas | Permissão do usuário | ✅ |
| Web Share API | Compartilhar relatórios | Permissão do usuário | ✅ |
| Clipboard API | Copiar valores / PIX | Permissão do usuário | ✅ |
| File System Access API | Importar/exportar arquivos | Permissão do usuário | ✅ |

---

### 11.2 APIs Externas Opcionais (Futuro)

| API | Uso | Plano |
|---|---|---|
| Open Finance Brasil | Sincronização bancária automatizada | Fase 3 |
| AwesomeAPI / ExchangeRate | Cotação de moedas e câmbio | Fase 2 |
| Alpha Vantage / Brapi | Cotação de ações e FIIs | Fase 2 |
| CoinGecko | Cotação de criptomoedas | Fase 2 |
| Firebase Auth | Autenticação com Google/Email | Fase 3 |
| Firebase Firestore | Sincronização em nuvem | Fase 3 |
| Sendgrid | E-mails de recuperação de senha | Fase 3 |

---

### 11.3 Formato de Importação

**CSV Padrão FinCore:**
```
data,descricao,tipo,valor,categoria,conta,status,observacao
2026-03-15,Salário,receita,5000.00,Salário,Conta Corrente Nubank,efetivada,
2026-03-16,Supermercado,despesa,320.50,Alimentação,Conta Corrente Nubank,efetivada,Compras do mês
```

**OFX (Open Financial Exchange):** Parser nativo para importação de extratos bancários.

---

## 12. Fluxo de Dados

```
Usuário interage com UI
        ↓
Event Handler (JS)
        ↓
Validação de entrada (utils.js)
        ↓
Store.setState() — atualiza estado em memória
        ↓
DB.add/update/delete() — persiste no IndexedDB
        ↓
Store notifica subscribers
        ↓
Módulos re-renderizam (DOM update)
        ↓
Charts.update() se necessário
        ↓
Toast de feedback ao usuário
```

---

### 12.1 Fluxo de Autenticação

```
App inicia
    ↓
service-worker.js registrado
    ↓
auth.isAuthenticated()?
    ├── NÃO → exibe Splash (2.5s) → exibe Login Screen
    └── SIM → exibe Splash (1.5s) → carrega App Shell
                                          ↓
                                   Router.navigate('dashboard')
                                          ↓
                                   Dashboard.init()
```

---

### 12.2 Fluxo de Transação

```
Usuário clica "Nova Transação"
    ↓
Transactions.openModal()
    ↓
Preenche formulário
    ↓
Transactions.save(data)
    ↓
Utils.validateForm(data)
    ├── INVÁLIDO → shake + mensagens de erro
    └── VÁLIDO
           ↓
        DB.add('transactions', record)
           ↓
        Store.setState({ transactions: [...] })
           ↓
        Dashboard.refreshAll()
           ↓
        Toast "Transação salva!"
           ↓
        Modal fecha
```

---

## 13. Responsividade

### 13.1 Breakpoints

| Nome | Largura | Dispositivo |
|---|---|---|
| `xs` | < 480px | Smartphone pequeno |
| `sm` | 480px – 767px | Smartphone grande |
| `md` | 768px – 1023px | Tablet |
| `lg` | 1024px – 1279px | Laptop |
| `xl` | ≥ 1280px | Desktop |

---

### 13.2 Adaptações por Breakpoint

| Elemento | Mobile (xs/sm) | Tablet (md) | Desktop (lg/xl) |
|---|---|---|---|
| Navegação | Bottom Nav (5 ícones) | Sidebar mini (ícones) | Sidebar completa (ícones + labels) |
| Dashboard widgets | 1 coluna | 2 colunas | 3–4 colunas |
| Tabelas | Cards empilhados | Tabela simplificada | Tabela completa |
| Modais | Full screen | Centrado 80% | Centrado 560px max |
| Gráficos | 100% largura | 100% largura | Lado a lado |
| FAB | Visível (bottom-right) | Visível | Botão no header |
| Filtros | Drawer lateral | Inline colapsável | Sempre visível |
| Header | Logo + avatar | Logo + busca + avatar | Logo + busca + notif + avatar |

---

### 13.3 Mobile-First

Todos os estilos base são escritos para mobile e sobrescritos com `min-width` para telas maiores:

```css
/* Mobile (base) */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}
```

---

## 14. Acessibilidade

| Requisito | Implementação |
|---|---|
| Contraste de cores | Mínimo WCAG AA (4.5:1 para texto, 3:1 para UI) |
| Navegação por teclado | `tabindex`, `focus-visible`, skip links |
| Leitores de tela | `aria-label`, `aria-describedby`, `role`, `aria-live` |
| Texto alternativo | `alt` em imagens, `aria-label` em ícones |
| Tamanho de toque | Mínimo 44x44px em mobile |
| Zoom | Funciona até 200% sem quebra de layout |
| Animações | `prefers-reduced-motion` desativa animações decorativas |
| Foco visível | Outline de 2px sólido azul em todos os elementos focáveis |
| Formulários | Labels associados, fieldsets agrupados, mensagens de erro por `aria-describedby` |

---

## 15. Fases de Implementação

### 📦 Fase 1 — Fundação (Semanas 1–3)

**Objetivo:** Estrutura base funcional com autenticação e dashboard.

**Entregas:**
- Setup do projeto (estrutura de arquivos, git, linting)
- `manifest.json` e `service-worker.js` básico
- CSS Variables e reset global
- Splash Screen animada
- Tela de Login (autenticação local via IndexedDB)
- App Shell (sidebar, header, bottom nav)
- Router de telas
- Store de estado global
- Abstração do IndexedDB (`db.js`)
- Tela de Dashboard (layout + cards estáticos)
- Sistema de Temas Claro/Escuro
- Responsividade base (mobile-first)

**Critério de sucesso:** App instalável como PWA, login funcional, dashboard visível em mobile e desktop.

---

### 📦 Fase 2 — Core Financeiro (Semanas 4–7)

**Objetivo:** Funcionalidades principais de controle financeiro.

**Entregas:**
- CRUD completo de Contas Bancárias
- CRUD completo de Categorias
- CRUD completo de Transações (com validação, modal, filtros)
- Transações recorrentes (criação automática)
- Cálculo de saldo em tempo real
- Dashboard com dados reais (Chart.js)
- Importação CSV de transações
- Exportação CSV de transações
- CRUD de Empresas
- Seleção de empresa ativa

**Critério de sucesso:** Usuário consegue registrar 30 dias de finanças e ver o saldo correto no dashboard.

---

### 📦 Fase 3 — Planejamento e Análise (Semanas 8–11)

**Objetivo:** Metas, relatórios e investimentos.

**Entregas:**
- CRUD de Metas com progresso
- Depósitos em metas vinculados a contas
- Tela de Relatórios com 5 tipos de gráfico
- Exportação de relatórios em PDF (jsPDF)
- Exportação de relatórios em XLSX (SheetJS)
- CRUD de Investimentos
- Dashboard de rentabilidade de investimentos
- CRUD de Fornecedores
- Histórico de pagamentos por fornecedor

**Critério de sucesso:** Relatórios geráveis e exportáveis, metas visíveis com progresso correto.

---

### 📦 Fase 4 — Calendário e Notificações (Semanas 12–13)

**Objetivo:** Visão temporal e alertas proativos.

**Entregas:**
- Tela de Calendário (mensal/semanal/diário)
- Indicadores visuais por tipo no calendário
- Web Push Notifications (vencimentos, metas)
- Alertas in-app de contas a vencer
- Background Sync para operações offline
- Tela de Perfil completa
- Backup/Restaurar dados (JSON)
- Configurações de notificação

**Critério de sucesso:** Usuário recebe notificação de contas a vencer com 3 dias de antecedência.

---

### 📦 Fase 5 — Qualidade e PWA Completo (Semanas 14–15)

**Objetivo:** Polimento, performance e PWA score 100%.

**Entregas:**
- Testes de acessibilidade (Axe, Lighthouse)
- Otimização de performance (lazy loading, code splitting)
- Offline mode completo e testado
- Splash screens iOS e Android
- Onboarding (tour guiado para novos usuários)
- Empty states em todas as telas
- Skeleton loaders
- Tratamento de erros global
- Busca global (`Ctrl+K`)
- Documentação técnica final

**Critério de sucesso:** Lighthouse ≥ 90 em todos os critérios, PWA 100%, funciona 100% offline.

---

### 📦 Fase 6 — Backend e Sincronização (Futuro — pós-MVP)

**Objetivo:** Adicionar backend para multi-dispositivo e segurança avançada.

**Entregas:**
- API REST (Node.js + Fastify ou NestJS)
- Banco de dados PostgreSQL
- Autenticação JWT + OAuth (Google)
- Sincronização em nuvem (Firebase ou própria)
- Cotação automática de ativos (APIs externas)
- Open Finance (integração bancária)
- Planos (Free / Premium)
- Deploy (Vercel / Cloudflare Pages)

---

## 16. Critérios de Aceite

### Funcionais

- [ ] Login e logout funcionam corretamente
- [ ] Transação criada aparece instantaneamente no dashboard e lista
- [ ] Saldo da conta é atualizado corretamente após cada transação
- [ ] Filtros de transações retornam apenas os registros corretos
- [ ] Importação CSV cria transações corretamente
- [ ] Exportação PDF/XLSX gera arquivos válidos
- [ ] Meta com 100% de progresso é marcada como concluída
- [ ] Tema claro/escuro alterna sem recarregar a página
- [ ] App funciona sem internet após primeira visita
- [ ] App pode ser instalado via "Adicionar à tela inicial"

### Não-Funcionais

- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse PWA = 100%
- [ ] First Contentful Paint < 1.5s
- [ ] Funciona em Chrome, Firefox, Safari, Edge (últimas 2 versões)
- [ ] Funciona em iOS 14+ e Android 10+
- [ ] Responsivo de 320px a 2560px de largura
- [ ] Sem erro de console em uso normal
- [ ] Dados persistem após fechar e reabrir o navegador

---

## 17. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| IndexedDB com limite de armazenamento | Média | Alto | Avisar usuário ao atingir 80% do quota; oferecer exportação |
| Service Worker com cache desatualizado | Média | Médio | Versionar assets e limpar caches antigos no `activate` |
| Compatibilidade Safari iOS (PWA limitado) | Alta | Médio | Usar fallbacks, testar no Safari regularmente |
| Perda de dados local | Baixa | Alto | Backup automático semanal em JSON, avisar usuário |
| Performance em devices low-end | Média | Médio | Skeleton loaders, lazy render, animações reduzidas |
| Importação OFX com formatos divergentes | Alta | Médio | Parser robusto com fallbacks e mensagens de erro claras |

---

## Resumo Final

O **FinCore** é uma PWA de controle financeiro completo, construída com tecnologias web nativas (HTML5, CSS3, JavaScript ES2022+), zero dependências de framework de UI, funcionamento offline-first via Service Worker, e armazenamento local via IndexedDB. Conta com suporte total a temas claro/escuro, responsividade mobile-first, acessibilidade WCAG AA, e uma identidade visual consistente baseada na paleta Azul/Preto que transmite confiança, sofisticação e prosperidade financeira. O roadmap de 15 semanas entrega um MVP completo e funcional, com caminho claro para evolução para um produto com backend, sincronização em nuvem e Open Finance.

---

*Documento elaborado em Março de 2026 — FinCore PRD v1.0.0*

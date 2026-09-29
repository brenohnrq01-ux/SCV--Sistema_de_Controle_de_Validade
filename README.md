# 📦 SCV — Sistema de Controle de Validade

<p align="center">
  Aplicação full-stack para controle de validade de produtos, prevenção de perdas e gestão operacional.
</p>

<p align="center">
  <a href="https://scv-supermercadoalvorada.vercel.app">
    <img src="https://img.shields.io/badge/🚀_Acessar_Demo-Vercel-000000?style=for-the-badge" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

## 🎯 O problema

Produtos vencidos representam perda financeira e risco operacional. O **SCV** foi criado para facilitar a conferência de lotes, destacar produtos próximos do vencimento e registrar movimentações importantes.

## ✨ Funcionalidades

- 🔐 Autenticação de usuários
- 📊 Dashboard operacional
- ➕ Cadastro de produtos
- 📋 Listagem com busca e filtros
- 🗑️ Remoção controlada de produtos
- 🔔 Área de notificações
- 👥 Visualização e gerenciamento de usuários
- 📈 Relatório de perdas
- 📱 Interface responsiva
- 🧾 Registro de lote, quantidade, valor, entrega e validade

## 🎨 Controle visual de validade

| Situação | Faixa |
|---|---|
| 🔵 Azul | 90 dias ou mais |
| 🟢 Verde | 50 a 89 dias |
| 🟡 Amarelo | 20 a 49 dias |
| 🔴 Vermelho | 1 a 19 dias |
| ⚫ Preto | Produto vencido |

A aplicação calcula automaticamente a diferença entre a data atual e a validade do produto, permitindo localizar rapidamente itens que exigem atenção.

## 🧰 Stack

- **Next.js 16.3.4**
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Supabase JS / Supabase SSR**
- **PostgreSQL**
- **Lucide React**
- **Vercel**

## 📁 Estrutura

```text
Projetos/scv/
├── app/
│   ├── dashboard/
│   ├── notificacoes/
│   ├── produtos/
│   │   ├── cadastrar/
│   │   └── remover/
│   ├── relatorios/perdas/
│   └── usuarios/
├── src/lib/supabase/
├── public/
├── package.json
└── tsconfig.json
```

## 🚀 Executando localmente

```bash
git clone https://github.com/brenohnrq01-ux/SCV--Sistema_de_Controle_de_Validade.git
cd SCV--Sistema_de_Controle_de_Validade/Projetos/scv
npm install
npm run dev
```

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=seu_projeto_supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
```

Depois acesse o endereço informado pelo Next.js no terminal.

## 🧪 Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 🔐 Observação

As credenciais do Supabase não devem ser adicionadas diretamente ao repositório. O projeto utiliza variáveis de ambiente para configuração.

## 📌 Status

🟢 Em desenvolvimento ativo.

---

<p align="center">
  Desenvolvido por <strong>Breno Henrique</strong>
</p>

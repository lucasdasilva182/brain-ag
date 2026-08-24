# Brain Agriculture - Frontend

Interface web para gerenciamento de cadastro de produtores rurais, propriedades, safras e culturas plantadas, com dashboard de indicadores.

## Tecnologias

- React 19 + TypeScript
- Redux Toolkit (gerenciamento de estado)
- React Router (rotas + query params para filtros e atalhos)
- styled-components (CSS in JS)
- Recharts (gráficos de pizza do dashboard)
- lucide-react (ícones)
- Atomic Design (atoms / molecules / organisms / templates / pages)
- Jest + React Testing Library (testes)

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

Por padrão ela tenta se conectar à API em `http://localhost:3000` (configurável via `VITE_API_URL` no `.env`). Se a API não estiver disponível, cada tela cai automaticamente em dados mockados, para que a navegação continue funcionando mesmo sem o backend rodando.

## Testes

```bash
npm run test
```

## Build de produção

```bash
npm run build
```

## Rotas da aplicação

| Rota | Página |
|---|---|
| `/` | Dashboard (totais, gráficos, acesso rápido) |
| `/produtores` | Listagem de produtores |
| `/produtores/:id` | Detalhe de um produtor (propriedades, safras e culturas) |
| `/propriedades` | Listagem de propriedades (aceita `?produtorId=` para filtrar) |
| `/safras` | Listagem de safras (culturas editáveis inline) |

As telas de listagem também aceitam `?novo=1` na URL para abrir o modal de cadastro automaticamente (usado pelos atalhos de "Acesso rápido" do Dashboard).

## Estrutura do projeto

```
src/
  components/
    atoms/                 # Button, Input, Card, Logo, DocumentoInput — peças menores
    molecules/              # Modal, DataTable (com paginação), StatCard
    organisms/
      produtores/           # ProdutorForm, ProdutorList
      propriedades/         # PropriedadeForm, PropriedadeList
      safras/                # SafraForm, SafraList (culturas inline)
      NavBar.tsx, PieChartCard.tsx
    templates/               # MainLayout
  pages/                     # DashboardPage, ProdutoresPage, ProdutorDetalhePage,
                              # PropriedadesPage, SafrasPage
  store/
    slices/                  # produtores, propriedades, safras, dashboard
  services/                  # chamadas HTTP para a API (axios)
  mocks/                     # dados mockados usados como fallback e em testes
  types/                     # tipos TypeScript do domínio
  utils/                     # formatação de CPF/CNPJ, máscara de documento, hectares
  constants/                 # lista de estados brasileiros
  hooks/                     # hooks tipados do Redux
  test-utils/                # helpers compartilhados entre testes
```

## Funcionalidades

**Produtores**
- Cadastro, edição e remoção (com confirmação), validação de CPF/CNPJ com máscara automática enquanto digita.
- Página de detalhe (`/produtores/:id`) mostrando as propriedades do produtor, com barra de proporção de uso do solo e safras/culturas.
- Link direto da listagem para as propriedades de um produtor específico.

**Propriedades**
- Cadastro, edição e remoção, vinculadas a um produtor.
- Atalho para criar uma safra já vinculada a uma propriedade específica.
- Filtro por produtor via URL (`?produtorId=`).

**Safras**
- Cadastro com culturas plantadas opcionais (várias por safra).
- Adição e remoção de culturas diretamente na listagem, sem precisar editar a safra inteira.

**Dashboard**
- Total de fazendas e área total registrada em destaque.
- Gráficos de pizza: por estado, por cultura plantada, por uso do solo.
- Seção de "Acesso rápido" com atalhos que já abrem o modal de cadastro na tela certa.

**Geral**
- Tabelas com paginação (componente `DataTable` genérico e reutilizável).
- Menu responsivo (hambúrguer em telas estreitas).
- Tema escuro com identidade visual própria.

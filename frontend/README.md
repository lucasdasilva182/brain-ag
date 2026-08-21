# Brain Agriculture - Frontend

Interface web para gerenciamento de cadastro de produtores rurais, propriedades, safras e culturas plantadas, com dashboard de indicadores.

## Tecnologias

- React 19 + TypeScript
- Redux Toolkit (gerenciamento de estado)
- React Router
- styled-components (CSS in JS)
- Recharts (gráficos de pizza do dashboard)
- Atomic Design (atoms / molecules / organisms / templates / pages)
- Jest + React Testing Library (testes)

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

Por padrão ela tenta se conectar à API em `http://localhost:3000` (configurável via `VITE_API_URL` no `.env`). Se a API não estiver disponível, a aplicação cai automaticamente em dados mockados, para que o dashboard e a listagem continuem navegáveis mesmo sem o backend rodando.

## Testes

```bash
npm run test
```

## Build de produção

```bash
npm run build
```

## Estrutura do projeto

```
src/
  components/
    atoms/       # Button, Input, Card — peças visuais menores
    molecules/   # StatCard — combina átomos
    organisms/   # ProdutorForm, ProdutorList, PieChartCard, NavBar
    templates/   # MainLayout
  pages/         # DashboardPage, ProdutoresPage
  store/         # Redux Toolkit (slices de produtores e dashboard)
  services/      # chamadas HTTP para a API (axios)
  mocks/         # dados mockados usados como fallback e em testes
  types/         # tipos TypeScript do domínio
  utils/         # formatação de CPF/CNPJ e hectares
```

## Funcionalidades

- Dashboard com total de fazendas, total de hectares e 3 gráficos de pizza (por estado, por cultura plantada, por uso do solo).
- Cadastro e listagem de produtores rurais.
- Remoção de produtores.
- Fallback para dados mockados quando a API não está acessível.

# Brain Agriculture

Sistema de gerenciamento de cadastro de produtores rurais, propriedades, safras e culturas plantadas, com dashboard de indicadores.

Projeto full-stack desenvolvido como teste técnico: backend em NestJS + Prisma + PostgreSQL, frontend em React + TypeScript + Redux Toolkit.

## Estrutura do repositório

```
brain-agriculture/
  backend/    # API REST (NestJS + Prisma + PostgreSQL)
  frontend/   # Interface web (React + Redux + styled-components)
```

Cada pasta tem seu próprio README com instruções detalhadas de instalação, execução e testes.

## Como rodar o projeto completo

1. Suba o backend (veja `backend/README.md`) — ele expõe a API em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/docs`.
2. Suba o frontend (veja `frontend/README.md`) — ele expõe a interface em `http://localhost:5173` e já vem configurado para consumir a API local.

## Tecnologias

**Backend:** NestJS, Prisma ORM, PostgreSQL, Docker, Jest (testes unitários e de integração), Swagger, class-validator.

**Frontend:** React, TypeScript, Redux Toolkit, styled-components, Recharts, Jest + React Testing Library, Atomic Design.

## Funcionalidades

- Cadastro, edição e remoção de produtores rurais, com validação de CPF/CNPJ.
- Cadastro de propriedades rurais vinculadas a um produtor, com validação de que a soma da área agricultável e de vegetação não ultrapassa a área total.
- Cadastro de safras e culturas plantadas por propriedade.
- Dashboard com total de fazendas, total de hectares e gráficos de pizza (por estado, por cultura plantada e por uso do solo).
- Health check da API (`/health`) para monitoramento.

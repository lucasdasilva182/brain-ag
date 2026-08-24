# Brain Agriculture - API

API REST para gerenciamento de cadastro de produtores rurais, suas propriedades, safras e culturas plantadas.

## Tecnologias

- NestJS + TypeScript
- Prisma ORM
- PostgreSQL
- Docker / Docker Compose
- Jest (testes unitários e de integração)
- Swagger / OpenAPI (documentação da API)
- class-validator (validação de DTOs)
- @nestjs/terminus (health check)

## Como rodar (com Docker)

```bash
docker compose up --build
```

A API sobe em `http://localhost:3000` e o Postgres em `localhost:5432`. As migrações do banco rodam automaticamente ao iniciar o container (não precisa de nenhum passo manual).

## Como rodar localmente (sem Docker, só para desenvolvimento)

```bash
npm install
npx prisma migrate dev
npm run start:dev
```

Requer um Postgres rodando localmente (pode usar `docker compose up postgres` só pra subir o banco). O Prisma Client é gerado automaticamente após o `npm install` (script `postinstall`).

## Documentação da API (Swagger / OpenAPI)

Com a aplicação rodando, acesse: `http://localhost:3000/docs`

## Health check

`GET /health` — verifica se a aplicação e a conexão com o banco de dados estão saudáveis. Usado por orquestradores (Docker, Kubernetes) para monitoramento.

## Testes

**Unitários** (validação de CPF/CNPJ, validação de área — não dependem de banco):
```bash
npm run test
```

**De integração / e2e** (batem em endpoints HTTP reais, contra um banco Postgres de verdade):
```bash
npm run test:e2e
```

> Os testes de integração rodam em série (`maxWorkers: 1`), já que todos compartilham o mesmo banco de dados — rodar em paralelo causaria testes disputando os mesmos dados.

## Estrutura do projeto

```
src/
  prisma/         # conexão com o banco (PrismaService)
  common/         # validadores e utilitários compartilhados (CPF/CNPJ)
  produtores/     # CRUD de produtores rurais
  propriedades/   # CRUD de propriedades (fazendas)
  safras/         # CRUD de safras e culturas plantadas
  dashboard/      # endpoint de totais e dados para gráficos
  health/         # health check (/health)
test/             # testes de integração (e2e), um arquivo por módulo
```

## Regras de negócio implementadas

- Validação de CPF/CNPJ com algoritmo de dígito verificador (não é só contagem de números).
- A soma da área agricultável com a área de vegetação não pode ultrapassar a área total da propriedade.
- Um produtor pode ter 0, 1 ou várias propriedades.
- Uma propriedade pode ter 0, 1 ou várias safras, cada safra com 0, 1 ou várias culturas plantadas.
- Não é permitido cadastrar duas safras do mesmo ano para a mesma propriedade.

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| GET | / | Informações básicas da API |
| GET | /health | Health check (aplicação + banco) |
| POST | /produtores | Cadastrar produtor |
| GET | /produtores | Listar produtores |
| GET | /produtores/:id | Buscar produtor (com propriedades, safras e culturas) |
| PATCH | /produtores/:id | Atualizar produtor |
| DELETE | /produtores/:id | Remover produtor |
| POST | /propriedades | Cadastrar propriedade |
| GET | /propriedades | Listar propriedades |
| GET | /propriedades/:id | Buscar propriedade |
| PATCH | /propriedades/:id | Atualizar propriedade |
| DELETE | /propriedades/:id | Remover propriedade |
| POST | /safras | Cadastrar safra (com culturas opcionais) |
| GET | /safras | Listar safras |
| GET | /safras/:id | Buscar safra |
| POST | /safras/:id/culturas | Adicionar cultura a uma safra |
| DELETE | /safras/:id | Remover safra |
| DELETE | /safras/culturas/:culturaId | Remover uma cultura plantada |
| GET | /dashboard/resumo | Totais e dados para os gráficos |

Detalhes completos de request/response na documentação Swagger (`/docs`).

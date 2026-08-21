# Brain Agriculture - API

API REST para gerenciamento de cadastro de produtores rurais, suas propriedades, safras e culturas plantadas.

## Tecnologias

- NestJS + TypeScript
- Prisma ORM
- PostgreSQL
- Docker / Docker Compose
- Jest (testes unitários)
- Swagger (documentação da API)

## Como rodar (com Docker)

```bash
docker compose up --build
```

A API sobe em `http://localhost:3000` e o Postgres em `localhost:5432`.

Depois que os containers subirem, rode as migrações do banco (em outro terminal):

```bash
docker compose exec api npx prisma migrate deploy
```

## Como rodar localmente (sem Docker, só para desenvolvimento)

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

Requer um Postgres rodando localmente (pode usar `docker compose up postgres` só pra subir o banco).

## Documentação da API (Swagger)

Com a aplicação rodando, acesse: `http://localhost:3000/docs`

## Testes

```bash
npm run test
```

## Estrutura do projeto

```
src/
  prisma/         # conexão com o banco (PrismaService)
  common/          # validadores e utilitários compartilhados
  produtores/      # CRUD de produtores rurais
  propriedades/    # CRUD de propriedades (fazendas)
  safras/          # CRUD de safras e culturas plantadas
  dashboard/       # endpoint de totais e dados para gráficos
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
| POST | /produtores | Cadastrar produtor |
| GET | /produtores | Listar produtores |
| GET | /produtores/:id | Buscar produtor |
| PATCH | /produtores/:id | Atualizar produtor |
| DELETE | /produtores/:id | Remover produtor |
| POST | /propriedades | Cadastrar propriedade |
| GET | /propriedades | Listar propriedades |
| PATCH | /propriedades/:id | Atualizar propriedade |
| DELETE | /propriedades/:id | Remover propriedade |
| POST | /safras | Cadastrar safra (com culturas opcionais) |
| POST | /safras/:id/culturas | Adicionar cultura a uma safra |
| DELETE | /safras/:id | Remover safra |
| GET | /dashboard/resumo | Totais e dados para os gráficos |

Detalhes completos de request/response na documentação Swagger (`/docs`).

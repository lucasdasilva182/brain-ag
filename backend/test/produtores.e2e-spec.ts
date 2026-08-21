import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp, limparBanco } from './utils/create-test-app';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Produtores (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterEach(async () => {
    await limparBanco(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /produtores', () => {
    it('cria um produtor com CPF válido', async () => {
      const resposta = await request(app.getHttpServer())
        .post('/produtores')
        .send({ documento: '111.444.777-35', nome: 'João da Silva' })
        .expect(201);

      expect(resposta.body).toMatchObject({
        documento: '11144477735',
        nome: 'João da Silva',
      });
      expect(resposta.body.id).toBeDefined();
    });

    it('cria um produtor com CNPJ válido', async () => {
      const resposta = await request(app.getHttpServer())
        .post('/produtores')
        .send({ documento: '11.222.333/0001-81', nome: 'Agropecuária LTDA' })
        .expect(201);

      expect(resposta.body.documento).toBe('11222333000181');
    });

    it('rejeita CPF com dígito verificador inválido (400)', async () => {
      const resposta = await request(app.getHttpServer())
        .post('/produtores')
        .send({ documento: '111.444.777-36', nome: 'Documento Inválido' })
        .expect(400);

      expect(resposta.body.message).toContain('CPF ou CNPJ inválido');
    });

    it('rejeita payload sem nome (400)', async () => {
      await request(app.getHttpServer())
        .post('/produtores')
        .send({ documento: '111.444.777-35' })
        .expect(400);
    });

    it('rejeita documento duplicado (409)', async () => {
      await request(app.getHttpServer())
        .post('/produtores')
        .send({ documento: '111.444.777-35', nome: 'João da Silva' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/produtores')
        .send({ documento: '111.444.777-35', nome: 'Outro Nome' })
        .expect(409);
    });

    it('rejeita campos que não existem no DTO (400, whitelist)', async () => {
      await request(app.getHttpServer())
        .post('/produtores')
        .send({
          documento: '111.444.777-35',
          nome: 'João da Silva',
          campoQueNaoExiste: 'valor',
        })
        .expect(400);
    });
  });

  describe('GET /produtores', () => {
    it('lista os produtores cadastrados', async () => {
      await request(app.getHttpServer())
        .post('/produtores')
        .send({ documento: '111.444.777-35', nome: 'João da Silva' });

      const resposta = await request(app.getHttpServer())
        .get('/produtores')
        .expect(200);

      expect(resposta.body).toHaveLength(1);
      expect(resposta.body[0].nome).toBe('João da Silva');
    });

    it('retorna lista vazia quando não há produtores', async () => {
      const resposta = await request(app.getHttpServer())
        .get('/produtores')
        .expect(200);

      expect(resposta.body).toEqual([]);
    });
  });

  describe('GET /produtores/:id', () => {
    it('busca um produtor existente', async () => {
      const criado = await request(app.getHttpServer())
        .post('/produtores')
        .send({ documento: '111.444.777-35', nome: 'João da Silva' });

      const resposta = await request(app.getHttpServer())
        .get(`/produtores/${criado.body.id}`)
        .expect(200);

      expect(resposta.body.nome).toBe('João da Silva');
      expect(resposta.body.propriedades).toEqual([]);
    });

    it('retorna 404 para id inexistente', async () => {
      await request(app.getHttpServer())
        .get('/produtores/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PATCH /produtores/:id', () => {
    it('atualiza o nome de um produtor', async () => {
      const criado = await request(app.getHttpServer())
        .post('/produtores')
        .send({ documento: '111.444.777-35', nome: 'João da Silva' });

      const resposta = await request(app.getHttpServer())
        .patch(`/produtores/${criado.body.id}`)
        .send({ nome: 'João Pedro da Silva' })
        .expect(200);

      expect(resposta.body.nome).toBe('João Pedro da Silva');
    });

    it('retorna 404 ao tentar atualizar produtor inexistente', async () => {
      await request(app.getHttpServer())
        .patch('/produtores/00000000-0000-0000-0000-000000000000')
        .send({ nome: 'Novo Nome' })
        .expect(404);
    });
  });

  describe('DELETE /produtores/:id', () => {
    it('remove um produtor existente', async () => {
      const criado = await request(app.getHttpServer())
        .post('/produtores')
        .send({ documento: '111.444.777-35', nome: 'João da Silva' });

      await request(app.getHttpServer())
        .delete(`/produtores/${criado.body.id}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/produtores/${criado.body.id}`)
        .expect(404);
    });

    it('retorna 404 ao tentar remover produtor inexistente', async () => {
      await request(app.getHttpServer())
        .delete('/produtores/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });
});

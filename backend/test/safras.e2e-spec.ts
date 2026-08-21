import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp, limparBanco } from './utils/create-test-app';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Safras (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let propriedadeId: string;

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

  beforeEach(async () => {
    const produtor = await request(app.getHttpServer())
      .post('/produtores')
      .send({ documento: '111.444.777-35', nome: 'João da Silva' });

    const propriedade = await request(app.getHttpServer())
      .post('/propriedades')
      .send({
        produtorId: produtor.body.id,
        nome: 'Fazenda Boa Vista',
        cidade: 'Uberlândia',
        estado: 'MG',
        areaTotal: 150,
        areaAgricultavel: 90,
        areaVegetacao: 40,
      });

    propriedadeId = propriedade.body.id;
  });

  describe('POST /safras', () => {
    it('cria uma safra sem culturas', async () => {
      const resposta = await request(app.getHttpServer())
        .post('/safras')
        .send({ propriedadeId, ano: 2022 })
        .expect(201);

      expect(resposta.body.ano).toBe(2022);
      expect(resposta.body.culturas).toEqual([]);
    });

    it('cria uma safra já com culturas plantadas', async () => {
      const resposta = await request(app.getHttpServer())
        .post('/safras')
        .send({
          propriedadeId,
          ano: 2022,
          culturas: [{ nome: 'Soja' }, { nome: 'Milho' }],
        })
        .expect(201);

      expect(resposta.body.culturas).toHaveLength(2);
      expect(resposta.body.culturas.map((c: { nome: string }) => c.nome)).toEqual(
        expect.arrayContaining(['Soja', 'Milho']),
      );
    });

    it('rejeita duas safras do mesmo ano para a mesma propriedade (409)', async () => {
      await request(app.getHttpServer())
        .post('/safras')
        .send({ propriedadeId, ano: 2022 })
        .expect(201);

      await request(app.getHttpServer())
        .post('/safras')
        .send({ propriedadeId, ano: 2022 })
        .expect(409);
    });

    it('permite safras de anos diferentes para a mesma propriedade', async () => {
      await request(app.getHttpServer())
        .post('/safras')
        .send({ propriedadeId, ano: 2021 })
        .expect(201);

      await request(app.getHttpServer())
        .post('/safras')
        .send({ propriedadeId, ano: 2022 })
        .expect(201);
    });
  });

  describe('POST /safras/:id/culturas', () => {
    it('adiciona uma cultura a uma safra existente', async () => {
      const safra = await request(app.getHttpServer())
        .post('/safras')
        .send({ propriedadeId, ano: 2022 });

      const resposta = await request(app.getHttpServer())
        .post(`/safras/${safra.body.id}/culturas`)
        .send({ nome: 'Café' })
        .expect(201);

      expect(resposta.body.nome).toBe('Café');

      const safraAtualizada = await request(app.getHttpServer()).get(
        `/safras/${safra.body.id}`,
      );
      expect(safraAtualizada.body.culturas).toHaveLength(1);
    });

    it('retorna 404 ao adicionar cultura numa safra inexistente', async () => {
      await request(app.getHttpServer())
        .post('/safras/00000000-0000-0000-0000-000000000000/culturas')
        .send({ nome: 'Café' })
        .expect(404);
    });
  });

  describe('DELETE /safras/:id', () => {
    it('remove uma safra e suas culturas em cascata', async () => {
      const safra = await request(app.getHttpServer())
        .post('/safras')
        .send({ propriedadeId, ano: 2022, culturas: [{ nome: 'Soja' }] });

      await request(app.getHttpServer())
        .delete(`/safras/${safra.body.id}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/safras/${safra.body.id}`)
        .expect(404);
    });
  });
});

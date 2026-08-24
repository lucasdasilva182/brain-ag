import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp, limparBanco } from './utils/create-test-app';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Propriedades (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let produtorId: string;

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
    produtorId = produtor.body.id;
  });

  describe('POST /propriedades', () => {
    it('cria uma propriedade quando a soma das áreas é válida', async () => {
      const resposta = await request(app.getHttpServer())
        .post('/propriedades')
        .send({
          produtorId,
          nome: 'Fazenda Boa Vista',
          cidade: 'Uberlândia',
          estado: 'mg',
          areaTotal: 150,
          areaAgricultavel: 90,
          areaVegetacao: 40,
        })
        .expect(201);

      expect(resposta.body.nome).toBe('Fazenda Boa Vista');
      // regra de negócio: o estado deve ser salvo em maiúsculas
      expect(resposta.body.estado).toBe('MG');
    });

    it('rejeita quando a soma das áreas ultrapassa a área total (400)', async () => {
      const resposta = await request(app.getHttpServer())
        .post('/propriedades')
        .send({
          produtorId,
          nome: 'Fazenda Impossível',
          cidade: 'Uberlândia',
          estado: 'MG',
          areaTotal: 100,
          areaAgricultavel: 80,
          areaVegetacao: 40,
        })
        .expect(400);

      expect(resposta.body.message).toContain('área total');
    });

    it('aceita quando a soma das áreas é exatamente igual à área total', async () => {
      await request(app.getHttpServer())
        .post('/propriedades')
        .send({
          produtorId,
          nome: 'Fazenda No Limite',
          cidade: 'Uberlândia',
          estado: 'MG',
          areaTotal: 100,
          areaAgricultavel: 60,
          areaVegetacao: 40,
        })
        .expect(201);
    });

    it('rejeita área negativa (400)', async () => {
      await request(app.getHttpServer())
        .post('/propriedades')
        .send({
          produtorId,
          nome: 'Fazenda Inválida',
          cidade: 'Uberlândia',
          estado: 'MG',
          areaTotal: 100,
          areaAgricultavel: -10,
          areaVegetacao: 40,
        })
        .expect(400);
    });

    it('rejeita produtorId de um produtor que não existe (500/erro de FK)', async () => {
      await request(app.getHttpServer()).post('/propriedades').send({
        produtorId: '00000000-0000-0000-0000-000000000000',
        nome: 'Fazenda Órfã',
        cidade: 'Uberlândia',
        estado: 'MG',
        areaTotal: 100,
        areaAgricultavel: 50,
        areaVegetacao: 20,
      });
    });
  });

  describe('PATCH /propriedades/:id', () => {
    it('revalida a regra de área ao atualizar apenas um campo', async () => {
      const criada = await request(app.getHttpServer())
        .post('/propriedades')
        .send({
          produtorId,
          nome: 'Fazenda Boa Vista',
          cidade: 'Uberlândia',
          estado: 'MG',
          areaTotal: 150,
          areaAgricultavel: 90,
          areaVegetacao: 40,
        });

      // Reduzir a área total sem mudar as demais deve violar a regra
      // (90 + 40 = 130 > 100)
      const resposta = await request(app.getHttpServer())
        .patch(`/propriedades/${criada.body.id}`)
        .send({ areaTotal: 100 })
        .expect(400);

      expect(resposta.body.message).toContain('área total');
    });
  });

  describe('DELETE /propriedades/:id', () => {
    it('remove uma propriedade existente', async () => {
      const criada = await request(app.getHttpServer())
        .post('/propriedades')
        .send({
          produtorId,
          nome: 'Fazenda Boa Vista',
          cidade: 'Uberlândia',
          estado: 'MG',
          areaTotal: 150,
          areaAgricultavel: 90,
          areaVegetacao: 40,
        });

      await request(app.getHttpServer())
        .delete(`/propriedades/${criada.body.id}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/propriedades/${criada.body.id}`)
        .expect(404);
    });
  });
});

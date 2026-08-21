import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp, limparBanco } from './utils/create-test-app';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Dashboard (e2e)', () => {
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

  it('retorna totais zerados quando não há propriedades cadastradas', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/dashboard/resumo')
      .expect(200);

    expect(resposta.body.totalFazendas).toBe(0);
    expect(resposta.body.totalHectares).toBe(0);
    expect(resposta.body.graficoPorEstado).toEqual([]);
  });

  it('calcula totais e gráficos corretamente a partir de dados reais', async () => {
    const produtor = await request(app.getHttpServer())
      .post('/produtores')
      .send({ documento: '111.444.777-35', nome: 'João da Silva' });

    const propriedade1 = await request(app.getHttpServer())
      .post('/propriedades')
      .send({
        produtorId: produtor.body.id,
        nome: 'Fazenda A',
        cidade: 'Uberlândia',
        estado: 'MG',
        areaTotal: 100,
        areaAgricultavel: 60,
        areaVegetacao: 40,
      });

    await request(app.getHttpServer())
      .post('/propriedades')
      .send({
        produtorId: produtor.body.id,
        nome: 'Fazenda B',
        cidade: 'Ribeirão Preto',
        estado: 'SP',
        areaTotal: 200,
        areaAgricultavel: 150,
        areaVegetacao: 50,
      });

    await request(app.getHttpServer())
      .post('/safras')
      .send({
        propriedadeId: propriedade1.body.id,
        ano: 2022,
        culturas: [{ nome: 'Soja' }, { nome: 'Milho' }],
      });

    const resposta = await request(app.getHttpServer())
      .get('/dashboard/resumo')
      .expect(200);

    expect(resposta.body.totalFazendas).toBe(2);
    expect(resposta.body.totalHectares).toBe(300); // 100 + 200

    expect(resposta.body.graficoPorEstado).toEqual(
      expect.arrayContaining([
        { label: 'MG', value: 1 },
        { label: 'SP', value: 1 },
      ]),
    );

    expect(resposta.body.graficoPorCultura).toEqual(
      expect.arrayContaining([
        { label: 'Soja', value: 1 },
        { label: 'Milho', value: 1 },
      ]),
    );

    const usoSolo = resposta.body.graficoUsoSolo as {
      label: string;
      value: number;
    }[];
    const agricultavel = usoSolo.find((u) => u.label === 'Área agricultável');
    const vegetacao = usoSolo.find((u) => u.label === 'Área de vegetação');

    expect(agricultavel?.value).toBe(210); // 60 + 150
    expect(vegetacao?.value).toBe(90); // 40 + 50
  });
});

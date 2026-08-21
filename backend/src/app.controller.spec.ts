import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getInfo', () => {
    it('deve retornar informações básicas da API', () => {
      const resultado = appController.getInfo();
      expect(resultado.nome).toBe('Brain Agriculture API');
      expect(resultado.documentacao).toBe('/docs');
      expect(resultado.healthCheck).toBe('/health');
    });
  });
});

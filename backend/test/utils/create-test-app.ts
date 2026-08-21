import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

/**
 * Monta uma instância real da aplicação para os testes e2e, aplicando
 * o mesmo ValidationPipe que usamos em produção (main.ts). Isso garante
 * que os testes e2e validem o comportamento real da API, não uma
 * versão simplificada dela.
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  return app;
}

/**
 * Limpa todas as tabelas do banco de teste. A ordem importa: começamos
 * pelo Produtor porque o onDelete: Cascade do schema já arrasta
 * Propriedade -> Safra -> CulturaPlantada junto.
 */
export async function limparBanco(prisma: PrismaService): Promise<void> {
  await prisma.produtor.deleteMany();
}

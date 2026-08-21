import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Validação global: todo DTO com decorators do class-validator é
  // validado automaticamente antes de chegar no controller.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos que não estão no DTO
      forbidNonWhitelisted: true, // erro se mandar campo que não existe no DTO
      transform: true, // converte payload pro tipo declarado no DTO
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Brain Agriculture API')
    .setDescription(
      'API para gerenciamento de cadastro de produtores rurais, propriedades, safras e culturas plantadas.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Aplicação rodando em http://localhost:${port}`);
  logger.log(`Documentação Swagger em http://localhost:${port}/docs`);
}
bootstrap();

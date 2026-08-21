import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Esse service centraliza a conexão com o banco. Toda vez que um outro
// service precisar consultar o banco, ele injeta o PrismaService em vez
// de criar uma nova conexão manualmente.
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conectado ao banco de dados com sucesso');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

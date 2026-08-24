import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() evita reimportar o PrismaModule em cada módulo que precisa do banco.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

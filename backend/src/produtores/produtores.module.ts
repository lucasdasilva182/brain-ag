import { Module } from '@nestjs/common';
import { ProdutoresService } from './produtores.service';
import { ProdutoresController } from './produtores.controller';

@Module({
  controllers: [ProdutoresController],
  providers: [ProdutoresService],
  exports: [ProdutoresService],
})
export class ProdutoresModule {}

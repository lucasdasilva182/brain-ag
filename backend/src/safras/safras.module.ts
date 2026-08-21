import { Module } from '@nestjs/common';
import { SafrasService } from './safras.service';
import { SafrasController } from './safras.controller';

@Module({
  controllers: [SafrasController],
  providers: [SafrasService],
  exports: [SafrasService],
})
export class SafrasModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SafrasService } from './safras.service';
import { CreateSafraDto } from './dto/create-safra.dto';
import { AddCulturaDto } from './dto/add-cultura.dto';

@ApiTags('safras')
@Controller('safras')
export class SafrasController {
  constructor(private readonly safrasService: SafrasService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma safra (com culturas opcionais) para uma propriedade' })
  create(@Body() dto: CreateSafraDto) {
    return this.safrasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as safras' })
  findAll() {
    return this.safrasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma safra pelo id' })
  findOne(@Param('id') id: string) {
    return this.safrasService.findOne(id);
  }

  @Post(':id/culturas')
  @ApiOperation({ summary: 'Adicionar uma cultura plantada a uma safra existente' })
  addCultura(@Param('id') id: string, @Body() dto: AddCulturaDto) {
    return this.safrasService.addCultura(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma safra' })
  remove(@Param('id') id: string) {
    return this.safrasService.remove(id);
  }

  @Delete('culturas/:culturaId')
  @ApiOperation({ summary: 'Remover uma cultura plantada' })
  removeCultura(@Param('culturaId') culturaId: string) {
    return this.safrasService.removeCultura(culturaId);
  }
}

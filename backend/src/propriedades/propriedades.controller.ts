import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PropriedadesService } from './propriedades.service';
import { CreatePropriedadeDto } from './dto/create-propriedade.dto';
import { UpdatePropriedadeDto } from './dto/update-propriedade.dto';

@ApiTags('propriedades')
@Controller('propriedades')
export class PropriedadesController {
  constructor(private readonly propriedadesService: PropriedadesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma propriedade rural vinculada a um produtor' })
  create(@Body() dto: CreatePropriedadeDto) {
    return this.propriedadesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as propriedades' })
  findAll() {
    return this.propriedadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma propriedade pelo id' })
  findOne(@Param('id') id: string) {
    return this.propriedadesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma propriedade' })
  update(@Param('id') id: string, @Body() dto: UpdatePropriedadeDto) {
    return this.propriedadesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma propriedade' })
  remove(@Param('id') id: string) {
    return this.propriedadesService.remove(id);
  }
}

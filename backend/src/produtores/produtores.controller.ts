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
import { ProdutoresService } from './produtores.service';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';

@ApiTags('produtores')
@Controller('produtores')
export class ProdutoresController {
  constructor(private readonly produtoresService: ProdutoresService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo produtor rural' })
  create(@Body() dto: CreateProdutorDto) {
    return this.produtoresService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtores' })
  findAll() {
    return this.produtoresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um produtor pelo id' })
  findOne(@Param('id') id: string) {
    return this.produtoresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um produtor' })
  update(@Param('id') id: string, @Body() dto: UpdateProdutorDto) {
    return this.produtoresService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um produtor' })
  remove(@Param('id') id: string) {
    return this.produtoresService.remove(id);
  }
}

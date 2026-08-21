import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropriedadeDto } from './dto/create-propriedade.dto';
import { UpdatePropriedadeDto } from './dto/update-propriedade.dto';
import { validarAreas } from './validators/area.validator';

@Injectable()
export class PropriedadesService {
  private readonly logger = new Logger(PropriedadesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePropriedadeDto) {
    validarAreas(dto);

    const propriedade = await this.prisma.propriedade.create({
      data: {
        nome: dto.nome,
        cidade: dto.cidade,
        estado: dto.estado.toUpperCase(),
        areaTotal: dto.areaTotal,
        areaAgricultavel: dto.areaAgricultavel,
        areaVegetacao: dto.areaVegetacao,
        produtorId: dto.produtorId,
      },
    });

    this.logger.log(`Propriedade criada: ${propriedade.id}`);
    return propriedade;
  }

  async findAll() {
    return this.prisma.propriedade.findMany({
      include: { safras: { include: { culturas: true } } },
    });
  }

  async findOne(id: string) {
    const propriedade = await this.prisma.propriedade.findUnique({
      where: { id },
      include: { safras: { include: { culturas: true } } },
    });

    if (!propriedade) {
      throw new NotFoundException('Propriedade não encontrada');
    }

    return propriedade;
  }

  async update(id: string, dto: UpdatePropriedadeDto) {
    const atual = await this.findOne(id);

    // Se o usuário está alterando alguma área, revalidamos a regra usando
    // os valores atuais como fallback para os campos não enviados.
    const areasParaValidar = {
      areaTotal: dto.areaTotal ?? Number(atual.areaTotal),
      areaAgricultavel: dto.areaAgricultavel ?? Number(atual.areaAgricultavel),
      areaVegetacao: dto.areaVegetacao ?? Number(atual.areaVegetacao),
    };
    validarAreas(areasParaValidar);

    const propriedade = await this.prisma.propriedade.update({
      where: { id },
      data: {
        ...dto,
        estado: dto.estado ? dto.estado.toUpperCase() : undefined,
      },
    });

    this.logger.log(`Propriedade atualizada: ${id}`);
    return propriedade;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.propriedade.delete({ where: { id } });
    this.logger.log(`Propriedade removida: ${id}`);
    return { message: 'Propriedade removida com sucesso' };
  }
}

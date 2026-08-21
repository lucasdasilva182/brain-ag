import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSafraDto } from './dto/create-safra.dto';
import { AddCulturaDto } from './dto/add-cultura.dto';

@Injectable()
export class SafrasService {
  private readonly logger = new Logger(SafrasService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSafraDto) {
    const jaExiste = await this.prisma.safra.findUnique({
      where: {
        propriedadeId_ano: {
          propriedadeId: dto.propriedadeId,
          ano: dto.ano,
        },
      },
    });
    if (jaExiste) {
      throw new ConflictException(
        `Já existe uma safra ${dto.ano} cadastrada para essa propriedade`,
      );
    }

    const safra = await this.prisma.safra.create({
      data: {
        ano: dto.ano,
        propriedadeId: dto.propriedadeId,
        culturas: dto.culturas
          ? { create: dto.culturas.map((c) => ({ nome: c.nome })) }
          : undefined,
      },
      include: { culturas: true },
    });

    this.logger.log(`Safra criada: ${safra.id} (ano ${safra.ano})`);
    return safra;
  }

  async findAll() {
    return this.prisma.safra.findMany({ include: { culturas: true } });
  }

  async findOne(id: string) {
    const safra = await this.prisma.safra.findUnique({
      where: { id },
      include: { culturas: true },
    });
    if (!safra) {
      throw new NotFoundException('Safra não encontrada');
    }
    return safra;
  }

  async addCultura(safraId: string, dto: AddCulturaDto) {
    await this.findOne(safraId); // garante que a safra existe

    const cultura = await this.prisma.culturaPlantada.create({
      data: { nome: dto.nome, safraId },
    });

    this.logger.log(`Cultura "${cultura.nome}" adicionada à safra ${safraId}`);
    return cultura;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.safra.delete({ where: { id } });
    this.logger.log(`Safra removida: ${id}`);
    return { message: 'Safra removida com sucesso' };
  }

  async removeCultura(culturaId: string) {
    const cultura = await this.prisma.culturaPlantada.findUnique({
      where: { id: culturaId },
    });
    if (!cultura) {
      throw new NotFoundException('Cultura não encontrada');
    }
    await this.prisma.culturaPlantada.delete({ where: { id: culturaId } });
    this.logger.log(`Cultura removida: ${culturaId}`);
    return { message: 'Cultura removida com sucesso' };
  }
}

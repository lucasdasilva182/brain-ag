import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';

@Injectable()
export class ProdutoresService {
  private readonly logger = new Logger(ProdutoresService.name);

  constructor(private readonly prisma: PrismaService) {}

  private normalizarDocumento(documento: string): string {
    return documento.replace(/\D/g, '');
  }

  async create(dto: CreateProdutorDto) {
    const documento = this.normalizarDocumento(dto.documento);

    const existente = await this.prisma.produtor.findUnique({
      where: { documento },
    });
    if (existente) {
      throw new ConflictException('Já existe um produtor com esse CPF/CNPJ');
    }

    const produtor = await this.prisma.produtor.create({
      data: { documento, nome: dto.nome },
    });

    this.logger.log(`Produtor criado: ${produtor.id}`);
    return produtor;
  }

  async findAll() {
    return this.prisma.produtor.findMany({
      include: { propriedades: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const produtor = await this.prisma.produtor.findUnique({
      where: { id },
      include: {
        propriedades: {
          include: { safras: { include: { culturas: true } } },
        },
      },
    });

    if (!produtor) {
      throw new NotFoundException('Produtor não encontrado');
    }

    return produtor;
  }

  async update(id: string, dto: UpdateProdutorDto) {
    await this.findOne(id); // garante que existe (lança 404 se não)

    const data: { nome?: string; documento?: string } = {};
    if (dto.nome) data.nome = dto.nome;
    if (dto.documento) data.documento = this.normalizarDocumento(dto.documento);

    const produtor = await this.prisma.produtor.update({ where: { id }, data });
    this.logger.log(`Produtor atualizado: ${id}`);
    return produtor;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.produtor.delete({ where: { id } });
    this.logger.log(`Produtor removido: ${id}`);
    return { message: 'Produtor removido com sucesso' };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getResumo() {
    const propriedades = await this.prisma.propriedade.findMany({
      include: { safras: { include: { culturas: true } } },
    });

    const totalFazendas = propriedades.length;

    const totalHectares = propriedades.reduce(
      (soma, p) => soma + Number(p.areaTotal),
      0,
    );

    const porEstado = this.contarPor(propriedades, (p) => p.estado);

    const contagemCulturas = new Map<string, number>();
    for (const propriedade of propriedades) {
      for (const safra of propriedade.safras) {
        for (const cultura of safra.culturas) {
          contagemCulturas.set(
            cultura.nome,
            (contagemCulturas.get(cultura.nome) ?? 0) + 1,
          );
        }
      }
    }
    const porCultura = Array.from(contagemCulturas.entries()).map(
      ([label, value]) => ({ label, value }),
    );

    const totalAgricultavel = propriedades.reduce(
      (soma, p) => soma + Number(p.areaAgricultavel),
      0,
    );
    const totalVegetacao = propriedades.reduce(
      (soma, p) => soma + Number(p.areaVegetacao),
      0,
    );

    return {
      totalFazendas,
      totalHectares,
      graficoPorEstado: porEstado,
      graficoPorCultura: porCultura,
      graficoUsoSolo: [
        { label: 'Área agricultável', value: totalAgricultavel },
        { label: 'Área de vegetação', value: totalVegetacao },
      ],
    };
  }

  private contarPor<T>(
    itens: T[],
    seletor: (item: T) => string,
  ): { label: string; value: number }[] {
    const contagem = new Map<string, number>();
    for (const item of itens) {
      const chave = seletor(item);
      contagem.set(chave, (contagem.get(chave) ?? 0) + 1);
    }
    return Array.from(contagem.entries()).map(([label, value]) => ({
      label,
      value,
    }));
  }
}

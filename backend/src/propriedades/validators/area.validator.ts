import { BadRequestException } from '@nestjs/common';

interface AreasPropriedade {
  areaTotal: number;
  areaAgricultavel: number;
  areaVegetacao: number;
}

/**
 * Regra de negócio: a soma da área agricultável com a área de vegetação
 * não pode ultrapassar a área total da fazenda. Lança uma exceção 400
 * (BadRequest) se a regra for violada.
 */
export function validarAreas({
  areaTotal,
  areaAgricultavel,
  areaVegetacao,
}: AreasPropriedade): void {
  const somaAreas = areaAgricultavel + areaVegetacao;

  if (somaAreas > areaTotal) {
    throw new BadRequestException(
      `A soma da área agricultável (${areaAgricultavel}) com a área de vegetação (${areaVegetacao}) ` +
        `não pode ultrapassar a área total da fazenda (${areaTotal}).`,
    );
  }
}

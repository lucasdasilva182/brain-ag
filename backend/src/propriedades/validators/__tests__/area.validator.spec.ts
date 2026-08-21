import { BadRequestException } from '@nestjs/common';
import { validarAreas } from '../area.validator';

describe('validarAreas', () => {
  it('não deve lançar erro quando a soma das áreas é igual à área total', () => {
    expect(() =>
      validarAreas({ areaTotal: 100, areaAgricultavel: 60, areaVegetacao: 40 }),
    ).not.toThrow();
  });

  it('não deve lançar erro quando a soma das áreas é menor que a área total', () => {
    expect(() =>
      validarAreas({ areaTotal: 100, areaAgricultavel: 30, areaVegetacao: 20 }),
    ).not.toThrow();
  });

  it('deve lançar BadRequestException quando a soma ultrapassa a área total', () => {
    expect(() =>
      validarAreas({ areaTotal: 100, areaAgricultavel: 70, areaVegetacao: 40 }),
    ).toThrow(BadRequestException);
  });
});

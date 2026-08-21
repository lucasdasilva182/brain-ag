import { formatarDocumento, formatarHectares } from '../format';

describe('formatarDocumento', () => {
  it('formata um CPF de 11 dígitos', () => {
    expect(formatarDocumento('11144477735')).toBe('111.444.777-35');
  });

  it('formata um CNPJ de 14 dígitos', () => {
    expect(formatarDocumento('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('retorna o valor original se não tiver 11 nem 14 dígitos', () => {
    expect(formatarDocumento('123')).toBe('123');
  });
});

describe('formatarHectares', () => {
  it('formata um número com sufixo "ha"', () => {
    expect(formatarHectares(1500)).toBe('1.500 ha');
  });
});

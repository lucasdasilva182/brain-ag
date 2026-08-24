import { aplicarMascaraDocumento, formatarDocumento, formatarHectares } from '../format';

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

  it('formata corretamente mesmo se vier como string (ex: Decimal do Prisma)', () => {
    expect(formatarHectares('250100' as unknown as number)).toBe('250.100 ha');
  });
});

describe('aplicarMascaraDocumento', () => {
  it('aplica a máscara de CPF progressivamente', () => {
    expect(aplicarMascaraDocumento('111')).toBe('111');
    expect(aplicarMascaraDocumento('1114')).toBe('111.4');
    expect(aplicarMascaraDocumento('111444777')).toBe('111.444.777');
    expect(aplicarMascaraDocumento('11144477735')).toBe('111.444.777-35');
  });

  it('troca para a máscara de CNPJ ao ultrapassar 11 dígitos', () => {
    expect(aplicarMascaraDocumento('112223330001')).toBe('11.222.333/0001');
    expect(aplicarMascaraDocumento('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('ignora caracteres não numéricos e limita a 14 dígitos', () => {
    expect(aplicarMascaraDocumento('111.444.777-35')).toBe('111.444.777-35');
    expect(aplicarMascaraDocumento('11222333000181999')).toBe('11.222.333/0001-81');
  });
});

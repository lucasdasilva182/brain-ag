import { isValidCPF, isValidCNPJ, isValidDocument } from '../document.validator';

describe('document.validator', () => {
  describe('isValidCPF', () => {
    it('deve aceitar um CPF válido', () => {
      expect(isValidCPF('111.444.777-35')).toBe(true);
    });

    it('deve rejeitar um CPF com dígito verificador errado', () => {
      expect(isValidCPF('111.444.777-36')).toBe(false);
    });

    it('deve rejeitar CPF com todos os dígitos iguais', () => {
      expect(isValidCPF('111.111.111-11')).toBe(false);
    });

    it('deve rejeitar CPF com quantidade errada de dígitos', () => {
      expect(isValidCPF('123456')).toBe(false);
    });
  });

  describe('isValidCNPJ', () => {
    it('deve aceitar um CNPJ válido', () => {
      expect(isValidCNPJ('11.222.333/0001-81')).toBe(true);
    });

    it('deve rejeitar um CNPJ com dígito verificador errado', () => {
      expect(isValidCNPJ('11.222.333/0001-82')).toBe(false);
    });

    it('deve rejeitar CNPJ com todos os dígitos iguais', () => {
      expect(isValidCNPJ('11.111.111/1111-11')).toBe(false);
    });
  });

  describe('isValidDocument', () => {
    it('deve identificar e validar um CPF automaticamente', () => {
      expect(isValidDocument('111.444.777-35')).toBe(true);
    });

    it('deve identificar e validar um CNPJ automaticamente', () => {
      expect(isValidDocument('11.222.333/0001-81')).toBe(true);
    });

    it('deve rejeitar valores que não têm 11 nem 14 dígitos', () => {
      expect(isValidDocument('123')).toBe(false);
    });
  });
});

/**
 * Validação de CPF e CNPJ usando o algoritmo oficial de dígitos
 * verificadores (módulo 11). Não é só "tem 11 ou 14 números" — o
 * documento pode ter a quantidade certa de dígitos e ainda ser inválido
 * se os dígitos verificadores não baterem.
 */

function apenasNumeros(valor: string): string {
  return valor.replace(/\D/g, '');
}

function todosDigitosIguais(valor: string): boolean {
  return valor.split('').every((d) => d === valor[0]);
}

export function isValidCPF(valorOriginal: string): boolean {
  const cpf = apenasNumeros(valorOriginal);

  if (cpf.length !== 11 || todosDigitosIguais(cpf)) {
    return false;
  }

  const calcularDigito = (base: string): number => {
    let soma = 0;
    let multiplicador = base.length + 1;
    for (const char of base) {
      soma += parseInt(char, 10) * multiplicador;
      multiplicador--;
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const digito1 = calcularDigito(cpf.substring(0, 9));
  const digito2 = calcularDigito(cpf.substring(0, 9) + digito1);

  return cpf.endsWith(`${digito1}${digito2}`);
}

export function isValidCNPJ(valorOriginal: string): boolean {
  const cnpj = apenasNumeros(valorOriginal);

  if (cnpj.length !== 14 || todosDigitosIguais(cnpj)) {
    return false;
  }

  const calcularDigito = (base: string): number => {
    const pesos =
      base.length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base[i], 10) * pesos[i];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const digito1 = calcularDigito(cnpj.substring(0, 12));
  const digito2 = calcularDigito(cnpj.substring(0, 12) + digito1);

  return cnpj.endsWith(`${digito1}${digito2}`);
}

export function isValidDocument(valor: string): boolean {
  const numeros = apenasNumeros(valor);
  if (numeros.length === 11) return isValidCPF(numeros);
  if (numeros.length === 14) return isValidCNPJ(numeros);
  return false;
}

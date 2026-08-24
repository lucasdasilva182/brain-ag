// Formata um CPF (11 dígitos) ou CNPJ (14 dígitos) para exibição.
// Mantém como veio se não bater com nenhum dos dois tamanhos.
export function formatarDocumento(documento: string): string {
  const numeros = documento.replace(/\D/g, '');

  if (numeros.length === 11) {
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  if (numeros.length === 14) {
    return numeros.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    );
  }

  return documento;
}

export function formatarHectares(valor: number): string {
  // Number(valor) é defensivo: se a API algum dia devolver isso como
  // string (ex: campo Decimal do Prisma sem conversão), a formatação
  // continua funcionando em vez de concatenar em vez de somar.
  return `${Number(valor).toLocaleString('pt-BR')} ha`;
}

// Aplica a máscara de CPF/CNPJ progressivamente, enquanto o usuário
// digita — usa a quantidade de dígitos já digitados pra decidir qual
// dos dois formatos aplicar (não dá pra saber de antemão qual o usuário
// vai preencher).
export function aplicarMascaraDocumento(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 14);

  if (digitos.length <= 11) {
    return digitos
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
  }

  return digitos
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d{1,2})$/, '$1.$2.$3/$4-$5');
}

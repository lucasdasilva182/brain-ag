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
  return `${valor.toLocaleString('pt-BR')} ha`;
}

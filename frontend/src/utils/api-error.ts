import { AxiosError } from 'axios';

interface RespostaErroApi {
  message?: string | string[];
}

export function extrairMensagemDeErro(
  error: unknown,
  mensagemPadrao = 'Não foi possível completar a operação',
): string {
  if (error instanceof AxiosError) {
    const dados = error.response?.data as RespostaErroApi | undefined;
    if (Array.isArray(dados?.message)) {
      return dados.message.join(', ');
    }
    if (typeof dados?.message === 'string') {
      return dados.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return mensagemPadrao;
}
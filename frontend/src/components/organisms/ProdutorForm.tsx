import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import { Label, Input, ErrorText } from '../atoms/Input';
import { Button } from '../atoms/Button';

const Form = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing(4)};
  align-items: flex-start;
  flex-wrap: wrap;
`;

const Campo = styled.div`
  flex: 1;
  min-width: 200px;
`;

interface ProdutorFormProps {
  initialValues?: { documento: string; nome: string };
  onSubmit: (dados: { documento: string; nome: string }) => Promise<void> | void;
  submitLabel?: string;
}

export function ProdutorForm({
  initialValues,
  onSubmit,
  submitLabel = 'Cadastrar produtor',
}: ProdutorFormProps) {
  const [documento, setDocumento] = useState(initialValues?.documento ?? '');
  const [nome, setNome] = useState(initialValues?.nome ?? '');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!documento.trim() || !nome.trim()) {
      setErro('Preencha o documento e o nome do produtor');
      return;
    }

    setErro(null);
    setEnviando(true);

    try {
      await onSubmit({ documento, nome });
      if (!initialValues) {
        setDocumento('');
        setNome('');
      }
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof Error ? erroCapturado.message : String(erroCapturado));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Campo>
        <Label htmlFor="documento">CPF ou CNPJ</Label>
        <Input
          id="documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          placeholder="000.000.000-00"
        />
      </Campo>
      <Campo>
        <Label htmlFor="nome">Nome do produtor</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
        />
      </Campo>
      <Button type="submit" disabled={enviando}>
        {enviando ? 'Salvando...' : submitLabel}
      </Button>
      {erro && <ErrorText>{erro}</ErrorText>}
    </Form>
  );
}

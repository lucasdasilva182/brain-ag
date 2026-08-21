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
  onSubmit: (dados: { documento: string; nome: string }) => void;
  enviando?: boolean;
}

export function ProdutorForm({ onSubmit, enviando }: ProdutorFormProps) {
  const [documento, setDocumento] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!documento.trim() || !nome.trim()) {
      setErro('Preencha o documento e o nome do produtor');
      return;
    }

    setErro(null);
    onSubmit({ documento, nome });
    setDocumento('');
    setNome('');
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
        {enviando ? 'Salvando...' : 'Cadastrar produtor'}
      </Button>
      {erro && <ErrorText>{erro}</ErrorText>}
    </Form>
  );
}

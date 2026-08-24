import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import { Label, Input, Select, ErrorText } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import { ESTADOS_BRASILEIROS } from '../../../constants/estados-brasileiros';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const Linha = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(4)};
  flex-wrap: wrap;
`;

const Campo = styled.div`
  flex: 1;
  min-width: 140px;
`;

export interface ProdutorOption {
  id: string;
  nome: string;
}

export interface PropriedadeFormValues {
  produtorId: string;
  nome: string;
  cidade: string;
  estado: string;
  areaTotal: number;
  areaAgricultavel: number;
  areaVegetacao: number;
}

interface PropriedadeFormProps {
  produtorOptions: ProdutorOption[];
  produtorFixo?: { id: string; nome: string };
  initialValues?: Omit<PropriedadeFormValues, 'produtorId'>;
  onSubmit: (dados: PropriedadeFormValues) => Promise<void> | void;
  submitLabel?: string;
}

const valoresVazios: Omit<PropriedadeFormValues, 'produtorId'> = {
  nome: '',
  cidade: '',
  estado: '',
  areaTotal: 0,
  areaAgricultavel: 0,
  areaVegetacao: 0,
};

export function PropriedadeForm({
  produtorOptions,
  produtorFixo,
  initialValues,
  onSubmit,
  submitLabel = 'Cadastrar propriedade',
}: PropriedadeFormProps) {
  const valoresIniciais = initialValues ?? valoresVazios;

  const [produtorId, setProdutorId] = useState(produtorFixo?.id ?? '');
  const [nome, setNome] = useState(valoresIniciais.nome);
  const [cidade, setCidade] = useState(valoresIniciais.cidade);
  const [estado, setEstado] = useState(valoresIniciais.estado);
  const [areaTotal, setAreaTotal] = useState(String(valoresIniciais.areaTotal || ''));
  const [areaAgricultavel, setAreaAgricultavel] = useState(
    String(valoresIniciais.areaAgricultavel || ''),
  );
  const [areaVegetacao, setAreaVegetacao] = useState(String(valoresIniciais.areaVegetacao || ''));
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!produtorId || !nome.trim() || !cidade.trim() || !estado.trim()) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    setErro(null);
    setEnviando(true);

    try {
      // A validação de que agricultável + vegetação <= total é regra de
      // negócio e já é garantida pelo backend — aqui só convertemos os
      // campos de texto pra número e deixamos o backend ser a fonte da
      // verdade, exibindo a mensagem dele se rejeitar.
      await onSubmit({
        produtorId,
        nome,
        cidade,
        estado: estado.toUpperCase(),
        areaTotal: Number(areaTotal),
        areaAgricultavel: Number(areaAgricultavel),
        areaVegetacao: Number(areaVegetacao),
      });

      if (!initialValues) {
        setNome('');
        setCidade('');
        setEstado('');
        setAreaTotal('');
        setAreaAgricultavel('');
        setAreaVegetacao('');
        if (!produtorFixo) setProdutorId('');
      }
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof Error ? erroCapturado.message : String(erroCapturado));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {produtorFixo ? (
        <Campo>
          <Label>Produtor</Label>
          <Input value={produtorFixo.nome} disabled />
        </Campo>
      ) : (
        <Campo>
          <Label htmlFor="produtorId">Produtor</Label>
          <Select
            id="produtorId"
            value={produtorId}
            onChange={(e) => setProdutorId(e.target.value)}
          >
            <option value="">Selecione um produtor</option>
            {produtorOptions.map((produtor) => (
              <option key={produtor.id} value={produtor.id}>
                {produtor.nome}
              </option>
            ))}
          </Select>
        </Campo>
      )}

      <Campo>
        <Label htmlFor="nome">Nome da fazenda</Label>
        <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      </Campo>

      <Linha>
        <Campo>
          <Label htmlFor="cidade">Cidade</Label>
          <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
        </Campo>
        <Campo>
          <Label htmlFor="estado">Estado (UF)</Label>
          <Select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Selecione</option>
            {ESTADOS_BRASILEIROS.map((estadoBr) => (
              <option key={estadoBr.uf} value={estadoBr.uf}>
                {estadoBr.nome} ({estadoBr.uf})
              </option>
            ))}
          </Select>
        </Campo>
      </Linha>

      <Linha>
        <Campo>
          <Label htmlFor="areaTotal">Área total (ha)</Label>
          <Input
            id="areaTotal"
            type="number"
            min="0"
            value={areaTotal}
            onChange={(e) => setAreaTotal(e.target.value)}
          />
        </Campo>
        <Campo>
          <Label htmlFor="areaAgricultavel">Agricultável (ha)</Label>
          <Input
            id="areaAgricultavel"
            type="number"
            min="0"
            value={areaAgricultavel}
            onChange={(e) => setAreaAgricultavel(e.target.value)}
          />
        </Campo>
        <Campo>
          <Label htmlFor="areaVegetacao">Vegetação (ha)</Label>
          <Input
            id="areaVegetacao"
            type="number"
            min="0"
            value={areaVegetacao}
            onChange={(e) => setAreaVegetacao(e.target.value)}
          />
        </Campo>
      </Linha>

      <div>
        <Button type="submit" disabled={enviando}>
          {enviando ? 'Salvando...' : submitLabel}
        </Button>
        {erro && <ErrorText>{erro}</ErrorText>}
      </div>
    </Form>
  );
}

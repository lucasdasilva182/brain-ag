import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import { Label, Input, Select, ErrorText } from '../../atoms/Input';
import { Button } from '../../atoms/Button';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const Campo = styled.div`
  width: 100%;
`;

const LinhaCultura = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const ListaTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
`;

const RemoverTag = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

export interface PropriedadeOption {
  id: string;
  nome: string;
}

export interface SafraFormValues {
  propriedadeId: string;
  ano: number;
  culturas: string[];
}

interface SafraFormProps {
  propriedadeOptions: PropriedadeOption[];
  propriedadeFixa?: PropriedadeOption;
  onSubmit: (dados: SafraFormValues) => Promise<void> | void;
}

export function SafraForm({ propriedadeOptions, propriedadeFixa, onSubmit }: SafraFormProps) {
  const [propriedadeId, setPropriedadeId] = useState(propriedadeFixa?.id ?? '');
  const [ano, setAno] = useState(String(new Date().getFullYear()));
  const [culturas, setCulturas] = useState<string[]>([]);
  const [novaCultura, setNovaCultura] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function adicionarCulturaLocal() {
    const nome = novaCultura.trim();
    if (!nome) return;
    setCulturas((atual) => [...atual, nome]);
    setNovaCultura('');
  }

  function removerCulturaLocal(index: number) {
    setCulturas((atual) => atual.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!propriedadeId || !ano.trim()) {
      setErro('Selecione a propriedade e informe o ano da safra');
      return;
    }

    setErro(null);
    setEnviando(true);

    try {
      await onSubmit({ propriedadeId, ano: Number(ano), culturas });
      if (!propriedadeFixa) setPropriedadeId('');
      setAno(String(new Date().getFullYear()));
      setCulturas([]);
    } catch (erroCapturado) {
      setErro(
        erroCapturado instanceof Error ? erroCapturado.message : String(erroCapturado),
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Campo>
        <Label htmlFor="propriedadeId">Propriedade</Label>
        {propriedadeFixa ? (
          <Input value={propriedadeFixa.nome} disabled />
        ) : (
          <Select
            id="propriedadeId"
            value={propriedadeId}
            onChange={(e) => setPropriedadeId(e.target.value)}
          >
            <option value="">Selecione uma propriedade</option>
            {propriedadeOptions.map((propriedade) => (
              <option key={propriedade.id} value={propriedade.id}>
                {propriedade.nome}
              </option>
            ))}
          </Select>
        )}
      </Campo>

      <Campo>
        <Label htmlFor="ano">Ano da safra</Label>
        <Input id="ano" type="number" value={ano} onChange={(e) => setAno(e.target.value)} />
      </Campo>

      <Campo>
        <Label htmlFor="novaCultura">Culturas plantadas (opcional)</Label>
        <LinhaCultura>
          <Input
            id="novaCultura"
            value={novaCultura}
            onChange={(e) => setNovaCultura(e.target.value)}
            placeholder="Ex: Soja"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                adicionarCulturaLocal();
              }
            }}
          />
          <Button type="button" $variant="secondary" onClick={adicionarCulturaLocal}>
            Adicionar
          </Button>
        </LinhaCultura>
        {culturas.length > 0 && (
          <ListaTags>
            {culturas.map((nome, index) => (
              <Tag key={`${nome}-${index}`}>
                {nome}
                <RemoverTag
                  type="button"
                  onClick={() => removerCulturaLocal(index)}
                  aria-label={`Remover ${nome}`}
                >
                  ×
                </RemoverTag>
              </Tag>
            ))}
          </ListaTags>
        )}
      </Campo>

      <div>
        <Button type="submit" disabled={enviando}>
          {enviando ? 'Salvando...' : 'Cadastrar safra'}
        </Button>
        {erro && <ErrorText>{erro}</ErrorText>}
      </div>
    </Form>
  );
}

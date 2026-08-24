import { useState } from 'react';
import styled from 'styled-components';
import { Trash2 } from 'lucide-react';
import type { Safra } from '../../../types/domain';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { DataTable } from '../../molecules/DataTable';
import type { DataTableColumn } from '../../molecules/DataTable';

const Acoes = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const CulturasWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  min-width: 220px;
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
  white-space: nowrap;
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

const MiniInput = styled(Input)`
  width: 90px;
  padding: 4px 8px;
  font-size: 12px;
`;

interface CulturasCellProps {
  safra: Safra;
  propriedadeNome: string;
  onAdicionar: (safraId: string, nome: string) => void;
  onRemover: (safraId: string, culturaId: string) => void;
}

// Componente local: cada linha precisa do próprio estado de "nova cultura".
function CulturasCell({ safra, propriedadeNome, onAdicionar, onRemover }: CulturasCellProps) {
  const [nome, setNome] = useState('');

  function handleAdicionar() {
    const valor = nome.trim();
    if (!valor) return;
    onAdicionar(safra.id, valor);
    setNome('');
  }

  return (
    <CulturasWrapper>
      {safra.culturas.map((cultura) => (
        <Tag key={cultura.id}>
          {cultura.nome}
          <RemoverTag
            type="button"
            onClick={() => onRemover(safra.id, cultura.id)}
            aria-label={`Remover ${cultura.nome}`}
          >
            ×
          </RemoverTag>
        </Tag>
      ))}
      <MiniInput
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="+ cultura"
        aria-label={`Adicionar cultura à safra ${safra.ano} de ${propriedadeNome}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAdicionar();
          }
        }}
        onBlur={handleAdicionar}
      />
    </CulturasWrapper>
  );
}

interface SafraListProps {
  safras: Safra[];
  nomeDaPropriedade: (propriedadeId: string) => string;
  onAdicionarCultura: (safraId: string, nome: string) => void;
  onRemoverCultura: (safraId: string, culturaId: string) => void;
  onRemoverSafra: (safra: Safra) => void;
}

export function SafraList({
  safras,
  nomeDaPropriedade,
  onAdicionarCultura,
  onRemoverCultura,
  onRemoverSafra,
}: SafraListProps) {
  const colunas: DataTableColumn<Safra>[] = [
    { key: 'propriedade', label: 'Propriedade', render: (s) => nomeDaPropriedade(s.propriedadeId) },
    { key: 'ano', label: 'Ano', render: (s) => s.ano },
    {
      key: 'culturas',
      label: 'Culturas',
      render: (s) => (
        <CulturasCell
          safra={s}
          propriedadeNome={nomeDaPropriedade(s.propriedadeId)}
          onAdicionar={onAdicionarCultura}
          onRemover={onRemoverCultura}
        />
      ),
    },
    {
      key: 'acoes',
      label: '',
      render: (s) => (
        <Acoes>
          <Button $variant="danger" onClick={() => onRemoverSafra(s)}>
            <Trash2 size={14} />
            Remover
          </Button>
        </Acoes>
      ),
    },
  ];

  return (
    <DataTable
      columns={colunas}
      data={safras}
      getRowKey={(s) => s.id}
      emptyMessage="Nenhuma safra cadastrada ainda."
    />
  );
}

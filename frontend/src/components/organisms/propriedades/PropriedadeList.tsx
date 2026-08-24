import styled from 'styled-components';
import { Pencil, Trash2 } from 'lucide-react';
import type { Propriedade } from '../../../types/domain';
import { formatarHectares } from '../../../utils/format';
import { Button } from '../../atoms/Button';
import { DataTable } from '../../molecules/DataTable';
import type { DataTableColumn } from '../../molecules/DataTable';

const Acoes = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

interface PropriedadeListProps {
  propriedades: Propriedade[];
  nomeDoProdutor: (produtorId: string) => string;
  onEditar: (propriedade: Propriedade) => void;
  onRemover: (propriedade: Propriedade) => void;
}

export function PropriedadeList({
  propriedades,
  nomeDoProdutor,
  onEditar,
  onRemover,
}: PropriedadeListProps) {
  const colunas: DataTableColumn<Propriedade>[] = [
    { key: 'nome', label: 'Fazenda', render: (p) => p.nome },
    { key: 'produtor', label: 'Produtor', render: (p) => nomeDoProdutor(p.produtorId) },
    { key: 'cidade', label: 'Cidade/UF', render: (p) => `${p.cidade}/${p.estado}` },
    { key: 'area', label: 'Área total', render: (p) => formatarHectares(p.areaTotal) },
    {
      key: 'acoes',
      label: '',
      render: (p) => (
        <Acoes>
          <Button $variant="secondary" onClick={() => onEditar(p)}>
            <Pencil size={14} />
            Editar
          </Button>
          <Button $variant="danger" onClick={() => onRemover(p)}>
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
      data={propriedades}
      getRowKey={(p) => p.id}
      emptyMessage="Nenhuma propriedade cadastrada ainda."
    />
  );
}

import styled from 'styled-components';
import type { Produtor } from '../../../types/domain';
import { formatarDocumento, formatarHectares } from '../../../utils/format';
import { Button } from '../../atoms/Button';
import { DataTable } from '../../molecules/DataTable';
import type { DataTableColumn } from '../../molecules/DataTable';

const Acoes = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

interface ProdutorListProps {
  produtores: Produtor[];
  onEditar: (produtor: Produtor) => void;
  onRemover: (produtor: Produtor) => void;
}

function areaTotalDoProdutor(produtor: Produtor): number {
  return produtor.propriedades.reduce((soma, p) => soma + p.areaTotal, 0);
}

export function ProdutorList({ produtores, onEditar, onRemover }: ProdutorListProps) {
  const colunas: DataTableColumn<Produtor>[] = [
    { key: 'nome', label: 'Nome', render: (produtor) => produtor.nome },
    {
      key: 'documento',
      label: 'CPF/CNPJ',
      render: (produtor) => formatarDocumento(produtor.documento),
    },
    {
      key: 'propriedades',
      label: 'Propriedades',
      render: (produtor) => produtor.propriedades.length,
    },
    {
      key: 'area',
      label: 'Área total',
      render: (produtor) => formatarHectares(areaTotalDoProdutor(produtor)),
    },
    {
      key: 'acoes',
      label: '',
      render: (produtor) => (
        <Acoes>
          <Button $variant="secondary" onClick={() => onEditar(produtor)}>
            Editar
          </Button>
          <Button $variant="danger" onClick={() => onRemover(produtor)}>
            Remover
          </Button>
        </Acoes>
      ),
    },
  ];

  return (
    <DataTable
      columns={colunas}
      data={produtores}
      getRowKey={(produtor) => produtor.id}
      emptyMessage="Nenhum produtor cadastrado ainda."
    />
  );
}

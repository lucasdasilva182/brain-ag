import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, MapPin } from 'lucide-react';
import type { Produtor } from '../../../types/domain';
import { formatarDocumento, formatarHectares } from '../../../utils/format';
import { Button } from '../../atoms/Button';
import { DataTable } from '../../molecules/DataTable';
import type { DataTableColumn } from '../../molecules/DataTable';

const Acoes = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const LinkPropriedades = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.primaryLight};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function areaTotalDoProdutor(produtor: Produtor): number {
  return produtor.propriedades.reduce((soma, p) => soma + Number(p.areaTotal), 0);
}

interface ProdutorListProps {
  produtores: Produtor[];
  onEditar: (produtor: Produtor) => void;
  onRemover: (produtor: Produtor) => void;
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
      render: (produtor) => (
        <LinkPropriedades to={`/propriedades?produtorId=${produtor.id}`}>
          <MapPin size={14} />
          {produtor.propriedades.length}{' '}
          {produtor.propriedades.length === 1 ? 'propriedade' : 'propriedades'}
        </LinkPropriedades>
      ),
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
            <Pencil size={14} />
            Editar
          </Button>
          <Button $variant="danger" onClick={() => onRemover(produtor)}>
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
      data={produtores}
      getRowKey={(produtor) => produtor.id}
      emptyMessage="Nenhum produtor cadastrado ainda."
    />
  );
}

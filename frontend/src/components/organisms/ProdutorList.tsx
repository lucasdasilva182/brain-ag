import styled from 'styled-components';
import type { Produtor } from '../../types/domain';
import { formatarDocumento, formatarHectares } from '../../utils/format';
import { Button } from '../atoms/Button';

const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;

  th {
    text-align: left;
    padding: 10px 12px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  td {
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const EstadoVazio = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  padding: ${({ theme }) => theme.spacing(6)} 0;
  text-align: center;
`;

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
  if (produtores.length === 0) {
    return <EstadoVazio>Nenhum produtor cadastrado ainda.</EstadoVazio>;
  }

  return (
    <Tabela>
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF/CNPJ</th>
          <th>Propriedades</th>
          <th>Área total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {produtores.map((produtor) => (
          <tr key={produtor.id}>
            <td>{produtor.nome}</td>
            <td>{formatarDocumento(produtor.documento)}</td>
            <td>{produtor.propriedades.length}</td>
            <td>{formatarHectares(areaTotalDoProdutor(produtor))}</td>
            <td>
              <Acoes>
                <Button $variant="secondary" onClick={() => onEditar(produtor)}>
                  Editar
                </Button>
                <Button $variant="danger" onClick={() => onRemover(produtor)}>
                  Remover
                </Button>
              </Acoes>
            </td>
          </tr>
        ))}
      </tbody>
    </Tabela>
  );
}

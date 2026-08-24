import type { ReactNode } from 'react';
import styled from 'styled-components';

const TabelaWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Tabela = styled.table`
  width: 100%;
  min-width: 560px;
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
    white-space: nowrap;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
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

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (item: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'Nenhum item encontrado.',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <EstadoVazio>{emptyMessage}</EstadoVazio>;
  }

  return (
    <TabelaWrapper>
      <Tabela>
        <thead>
          <tr>
            {columns.map((coluna) => (
              <th key={coluna.key}>{coluna.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={getRowKey(item)}>
              {columns.map((coluna) => (
                <td key={coluna.key}>{coluna.render(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Tabela>
    </TabelaWrapper>
  );
}

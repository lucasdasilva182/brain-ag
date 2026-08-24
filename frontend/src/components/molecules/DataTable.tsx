import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const Paginacao = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  padding-top: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(2)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  flex-wrap: wrap;
`;

const PaginacaoControles = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const PaginaBotao = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
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
  itemsPerPage?: number;
}

// Genérica: quem usa define colunas e dados, sem saber de domínio nenhum.
// Pagina no cliente (a lista inteira já vem carregada do backend) — para
// volumes muito maiores, o próximo passo seria paginação no servidor,
// mas isso já cobre bem o escopo deste projeto.
export function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'Nenhum item encontrado.',
  itemsPerPage = 5,
}: DataTableProps<T>) {
  const [pagina, setPagina] = useState(1);
  const totalPaginas = Math.max(1, Math.ceil(data.length / itemsPerPage));

  // Se os dados mudarem (filtro aplicado, item removido) e a página
  // atual deixar de existir, volta pra última página válida.
  useEffect(() => {
    if (pagina > totalPaginas) setPagina(totalPaginas);
  }, [pagina, totalPaginas]);

  if (data.length === 0) {
    return <EstadoVazio>{emptyMessage}</EstadoVazio>;
  }

  const inicio = (pagina - 1) * itemsPerPage;
  const dadosDaPagina = data.slice(inicio, inicio + itemsPerPage);

  return (
    <div>
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
            {dadosDaPagina.map((item) => (
              <tr key={getRowKey(item)}>
                {columns.map((coluna) => (
                  <td key={coluna.key}>{coluna.render(item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Tabela>
      </TabelaWrapper>

      {data.length > itemsPerPage && (
        <Paginacao>
          <span>
            {inicio + 1}-{Math.min(inicio + itemsPerPage, data.length)} de {data.length}
          </span>
          <PaginacaoControles>
            <PaginaBotao
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} />
            </PaginaBotao>
            <span>
              Página {pagina} de {totalPaginas}
            </span>
            <PaginaBotao
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              aria-label="Próxima página"
            >
              <ChevronRight size={16} />
            </PaginaBotao>
          </PaginacaoControles>
        </Paginacao>
      )}
    </div>
  );
}

import styled from 'styled-components';
import { Skeleton } from '../atoms/Skeleton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const Linha = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(5)};
  padding: 14px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

// Imita o formato do DataTable (cabeçalho + N linhas) enquanto os
// dados reais ainda não chegaram — evita o "pulo" de layout quando a
// tabela de verdade aparece.
export function TableSkeleton({ columns = 4, rows = 5 }: TableSkeletonProps) {
  return (
    <Wrapper>
      <Linha>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height="11px" width="70px" />
        ))}
      </Linha>
      {Array.from({ length: rows }).map((_, linha) => (
        <Linha key={linha}>
          {Array.from({ length: columns }).map((_, coluna) => (
            <Skeleton
              key={coluna}
              height="16px"
              width={coluna === 0 ? '150px' : '90px'}
            />
          ))}
        </Linha>
      ))}
    </Wrapper>
  );
}

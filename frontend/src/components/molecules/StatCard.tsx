import styled from 'styled-components';
import { Card } from '../atoms/Card';

const Valor = styled.p`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryLight};
  margin: 0;
`;

const Rotulo = styled.p`
  font-family: ${({ theme }) => theme.font.body};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 4px 0 0 0;
`;

interface StatCardProps {
  valor: string;
  rotulo: string;
}

export function StatCard({ valor, rotulo }: StatCardProps) {
  return (
    <Card>
      <Valor>{valor}</Valor>
      <Rotulo>{rotulo}</Rotulo>
    </Card>
  );
}

import styled from 'styled-components';
import { Skeleton } from '../atoms/Skeleton';
import { Card } from '../atoms/Card';

const HeroSkeleton = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const ChartSkeleton = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const GraficosSecundariosSkeleton = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
`;

const AcessoSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

export function DashboardSkeleton() {
  return (
    <div>
      <Skeleton height="22px" width="140px" radius="6px" />
      <div style={{ marginTop: 6, marginBottom: 24 }}>
        <Skeleton height="14px" width="220px" radius="6px" />
      </div>

      <HeroSkeleton>
        <div>
          <Skeleton height="40px" width="180px" radius="8px" />
          <div style={{ marginTop: 10 }}>
            <Skeleton height="12px" width="120px" />
          </div>
        </div>
        <div>
          <Skeleton height="22px" width="40px" radius="6px" />
          <div style={{ marginTop: 10 }}>
            <Skeleton height="12px" width="100px" />
          </div>
        </div>
      </HeroSkeleton>

      <ChartSkeleton>
        <Skeleton height="14px" width="140px" radius="6px" />
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
          <Skeleton height="200px" width="200px" radius="100px" />
        </div>
      </ChartSkeleton>

      <GraficosSecundariosSkeleton>
        <Card>
          <Skeleton height="14px" width="120px" radius="6px" />
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <Skeleton height="160px" width="160px" radius="80px" />
          </div>
        </Card>
        <Card>
          <Skeleton height="14px" width="90px" radius="6px" />
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <Skeleton height="160px" width="160px" radius="80px" />
          </div>
        </Card>
      </GraficosSecundariosSkeleton>

      <div style={{ marginTop: 24 }}>
        <Card>
          <Skeleton height="14px" width="110px" radius="6px" />
          <AcessoSkeleton>
            <Skeleton height="40px" radius="8px" />
            <Skeleton height="40px" radius="8px" />
            <Skeleton height="40px" radius="8px" />
          </AcessoSkeleton>
        </Card>
      </div>
    </div>
  );
}

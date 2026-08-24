import styled from 'styled-components';
import { Skeleton } from '../atoms/Skeleton';

const BREAKPOINT_TABLET = '768px';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: ${({ theme }) => theme.spacing(6)};

  @media (max-width: ${BREAKPOINT_TABLET}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(5)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
`;

const PropriedadeCardSkeleton = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.spacing(5)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

export function ProdutorDetalheSkeleton() {
  return (
    <div>
      <Skeleton height="13px" width="160px" radius="6px" />
      <div style={{ marginTop: 24 }}>
        <Layout>
          <Sidebar>
            <div>
              <Skeleton height="20px" width="140px" radius="6px" />
              <div style={{ marginTop: 8 }}>
                <Skeleton height="12px" width="110px" />
              </div>
            </div>
            <Skeleton height="1px" width="100%" />
            <Skeleton height="16px" width="80px" />
            <Skeleton height="16px" width="100px" />
            <Skeleton height="1px" width="100%" />
            <Skeleton height="36px" radius="8px" />
            <Skeleton height="36px" radius="8px" />
          </Sidebar>

          <div>
            <Skeleton height="16px" width="120px" radius="6px" />
            <div style={{ marginTop: 16 }}>
              {[0, 1].map((i) => (
                <PropriedadeCardSkeleton key={i}>
                  <Skeleton height="16px" width="180px" radius="6px" />
                  <div style={{ marginTop: 16 }}>
                    <Skeleton height="10px" radius="999px" />
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Skeleton height="12px" width="100px" radius="6px" />
                    <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                      <Skeleton height="24px" width="90px" radius="8px" />
                      <Skeleton height="24px" width="90px" radius="8px" />
                    </div>
                  </div>
                </PropriedadeCardSkeleton>
              ))}
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
}

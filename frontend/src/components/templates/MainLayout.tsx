import type { ReactNode } from 'react';
import styled from 'styled-components';
import { NavBar } from '../organisms/NavBar';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Conteudo = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.spacing(6)};
`;

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Container>
      <NavBar />
      <Conteudo>{children}</Conteudo>
    </Container>
  );
}

import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Logo } from '../atoms/Logo';

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Marca = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const NomeMarca = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Links = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(5)};
`;

const StyledNavLink = styled(NavLink)`
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textMuted};
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;

  &.active {
    color: ${({ theme }) => theme.colors.text};
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export function NavBar() {
  return (
    <Nav>
      <Marca>
        <Logo size={30} />
        <NomeMarca>Brain Agriculture</NomeMarca>
      </Marca>
      <Links>
        <StyledNavLink to="/" end>
          Dashboard
        </StyledNavLink>
        <StyledNavLink to="/produtores">Produtores</StyledNavLink>
      </Links>
    </Nav>
  );
}

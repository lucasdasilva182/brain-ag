import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Logo } from '../atoms/Logo';

const Nav = styled.nav`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const NavContent = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(6)};
`;

const Marca = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
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
      <NavContent>
        <Marca>
          <Logo size={30} />
        </Marca>
        <Links>
          <StyledNavLink to="/" end>
            Dashboard
          </StyledNavLink>
          <StyledNavLink to="/produtores">Produtores</StyledNavLink>
        </Links>
      </NavContent>
    </Nav>
  );
}

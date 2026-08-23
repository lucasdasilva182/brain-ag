import { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Logo } from '../atoms/Logo';

const BREAKPOINT_MOBILE = '640px';

const Nav = styled.nav`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
`;

const NavContent = styled.div`
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

const BurgerButton = styled.button`
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  span {
    display: block;
    height: 2px;
    width: 100%;
    background: ${({ theme }) => theme.colors.text};
    border-radius: 2px;
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: flex;
  }
`;

const Links = styled.div<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(5)};

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: ${({ theme }) => theme.colors.surface};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    max-height: ${({ $open }) => ($open ? '300px' : '0')};
    overflow: hidden;
    transition: max-height 0.2s ease;

    a {
      padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    }

    a:last-child {
      border-bottom: none;
    }
  }
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
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <Nav>
      <NavContent>
        <Marca>
          <Logo size={30} />
        </Marca>

        <BurgerButton
          onClick={() => setMenuAberto((aberto) => !aberto)}
          aria-label="Abrir menu de navegação"
          aria-expanded={menuAberto}
        >
          <span />
          <span />
          <span />
        </BurgerButton>

        <Links $open={menuAberto}>
          <StyledNavLink to="/" end onClick={() => setMenuAberto(false)}>
            Dashboard
          </StyledNavLink>
          <StyledNavLink to="/produtores" onClick={() => setMenuAberto(false)}>
            Produtores
          </StyledNavLink>
        </Links>
      </NavContent>
    </Nav>
  );
}

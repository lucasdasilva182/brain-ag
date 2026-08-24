import styled, { css } from 'styled-components';

type Variant = 'primary' | 'secondary' | 'danger';

export const Button = styled.button<{ $variant?: Variant }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid transparent;
  min-width: min-content;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  ${({ theme, $variant = 'primary' }) => {
    if ($variant === 'secondary') {
      return css`
        background: transparent;
        border-color: ${theme.colors.border};
        color: ${theme.colors.text};

        &:hover {
          background: ${theme.colors.background};
        }
      `;
    }
    if ($variant === 'danger') {
      return css`
        background: ${theme.colors.dangerBg};
        color: ${theme.colors.danger};

        &:hover {
          background: ${theme.colors.danger};
          color: white;
        }
      `;
    }
    return css`
      background: ${theme.colors.primary};
      color: white;

      &:hover {
        background: ${theme.colors.primaryDark};
      }
    `;
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

import styled, { keyframes } from 'styled-components';

const pulso = keyframes`
  0% { opacity: 0.45; }
  50% { opacity: 0.9; }
  100% { opacity: 0.45; }
`;

interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
}

// Bloco cinza pulsante usado como placeholder de conteúdo carregando.
// Combine vários pra montar o "esqueleto" de qualquer layout.
export const Skeleton = styled.div<SkeletonProps>`
  width: ${({ width }) => width ?? '100%'};
  height: ${({ height }) => height ?? '16px'};
  border-radius: ${({ radius, theme }) => radius ?? theme.radius};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  animation: ${pulso} 1.4s ease-in-out infinite;
`;

import styled from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.spacing(5)};
`;

export const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing(4)} 0;
`;

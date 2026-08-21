import styled from 'styled-components';

export const Label = styled.label`
  display: block;
  font-family: ${({ theme }) => theme.font.body};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 6px;
`;

export const Input = styled.input`
  width: 100%;
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(63, 190, 115, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const Select = styled.select`
  width: 100%;
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ErrorText = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.font.body};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 4px;
`;

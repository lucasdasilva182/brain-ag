import styled from 'styled-components';

const BREAKPOINT_TABLET = '900px';

const Wrapper = styled.div`
  @media (max-width: ${BREAKPOINT_TABLET}) {
    width: 100%;
  }
`;

const Titulo = styled.h1`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 22px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px 0;
`;

const Subtitulo = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

interface PageHeaderProps {
  titulo: string;
  subtitulo?: string;
}

export function PageHeader({ titulo, subtitulo }: PageHeaderProps) {
  return (
    <Wrapper>
      <Titulo>{titulo}</Titulo>
      {subtitulo && <Subtitulo>{subtitulo}</Subtitulo>}
    </Wrapper>
  );
}

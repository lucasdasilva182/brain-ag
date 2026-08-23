import { useEffect } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(4)};
  z-index: 100;
`;

const Panel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.spacing(6)};
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Panel role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <Header>
          {title && <Title>{title}</Title>}
          <CloseButton onClick={onClose} aria-label="Fechar">
            ×
          </CloseButton>
        </Header>
        {children}
      </Panel>
    </Overlay>
  );
}

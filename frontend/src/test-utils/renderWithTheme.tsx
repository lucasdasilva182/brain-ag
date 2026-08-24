import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { theme } from '../theme';

// Evita repetir ThemeProvider + MemoryRouter em cada arquivo de teste —
// o Router é necessário porque componentes como ProdutorList usam <Link>.
export function renderWithTheme(ui: ReactElement) {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>,
  );
}

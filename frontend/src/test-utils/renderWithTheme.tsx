import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

// Como nossos componentes usam styled-components com tema, todo teste
// que renderiza um componente precisa do ThemeProvider por perto —
// esse helper evita repetir esse boilerplate em cada arquivo de teste.
export function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

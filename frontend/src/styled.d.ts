import 'styled-components';
import { Theme } from './theme';

// Isso ensina o TypeScript a conhecer o formato do nosso tema sempre
// que usarmos `theme` dentro de um styled.xxx``, em vez de tratá-lo
// como um objeto genérico e vazio.
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

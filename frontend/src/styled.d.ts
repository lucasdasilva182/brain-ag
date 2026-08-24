import 'styled-components';
import { Theme } from './theme';

// Dá tipo ao `theme` dentro de styled.xxx``, em vez de objeto genérico.
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

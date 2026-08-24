import { TextEncoder, TextDecoder } from 'node:util';

// jsdom não expõe TextEncoder/TextDecoder globalmente, mas o
// react-router-dom depende deles — sem isso, qualquer teste que
// importe um componente com <Link> ou <NavLink> quebra no import.
global.TextEncoder = TextEncoder;
// @ts-expect-error -- TextDecoder do Node tem tipagem levemente
// diferente da global do DOM, mas é compatível em tempo de execução.
global.TextDecoder = TextDecoder;

import '@testing-library/jest-dom';

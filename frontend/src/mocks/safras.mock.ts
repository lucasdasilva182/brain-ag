import { produtoresMock } from './produtores.mock';
import type { Safra } from '../types/domain';

export const safrasMock: Safra[] = produtoresMock.flatMap((produtor) =>
  produtor.propriedades.flatMap((propriedade) => propriedade.safras),
);

import { produtoresMock } from './produtores.mock';
import type { Propriedade } from '../types/domain';

export const propriedadesMock: Propriedade[] = produtoresMock.flatMap(
  (produtor) => produtor.propriedades,
);

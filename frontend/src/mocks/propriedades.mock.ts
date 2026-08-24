import { produtoresMock } from './produtores.mock';
import type { Propriedade } from '../types/domain';

// Achatado a partir dos produtores mockados, sem duplicar dado.
export const propriedadesMock: Propriedade[] = produtoresMock.flatMap(
  (produtor) => produtor.propriedades,
);

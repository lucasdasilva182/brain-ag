import { produtoresMock } from './produtores.mock';
import type { Propriedade } from '../types/domain';

// Reaproveita os produtores mockados em vez de duplicar dados: cada
// propriedade já mora dentro de um produtor mockado, então só
// "achatamos" a lista.
export const propriedadesMock: Propriedade[] = produtoresMock.flatMap(
  (produtor) => produtor.propriedades,
);

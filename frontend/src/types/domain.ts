export interface CulturaPlantada {
  id: string;
  nome: string;
  safraId: string;
}

export interface Safra {
  id: string;
  ano: number;
  propriedadeId: string;
  culturas: CulturaPlantada[];
}

export interface Propriedade {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  areaTotal: number;
  areaAgricultavel: number;
  areaVegetacao: number;
  produtorId: string;
  safras: Safra[];
}

export interface Produtor {
  id: string;
  documento: string;
  nome: string;
  propriedades: Propriedade[];
}

// Payloads usados ao criar/editar (sem os campos gerados pelo backend)
export type CreateProdutorPayload = Pick<Produtor, 'documento' | 'nome'>;

export type CreatePropriedadePayload = Pick<
  Propriedade,
  | 'nome'
  | 'cidade'
  | 'estado'
  | 'areaTotal'
  | 'areaAgricultavel'
  | 'areaVegetacao'
  | 'produtorId'
>;

export interface DashboardResumo {
  totalFazendas: number;
  totalHectares: number;
  graficoPorEstado: { label: string; value: number }[];
  graficoPorCultura: { label: string; value: number }[];
  graficoUsoSolo: { label: string; value: number }[];
}

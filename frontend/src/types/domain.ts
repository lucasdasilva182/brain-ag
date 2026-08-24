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

// produtorId é imutável no update (espelha UpdatePropriedadeDto do backend)
export type UpdatePropriedadePayload = Partial<
  Omit<CreatePropriedadePayload, 'produtorId'>
>;

export type CreateSafraPayload = {
  propriedadeId: string;
  ano: number;
  culturas?: { nome: string }[];
};

export interface DashboardResumo {
  totalFazendas: number;
  totalHectares: number;
  graficoPorEstado: { label: string; value: number }[];
  graficoPorCultura: { label: string; value: number }[];
  graficoUsoSolo: { label: string; value: number }[];
}

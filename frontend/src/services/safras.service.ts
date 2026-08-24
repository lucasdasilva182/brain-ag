import { api } from './api';
import type { CreateSafraPayload, CulturaPlantada, Safra } from '../types/domain';

export const safrasService = {
  async listar(): Promise<Safra[]> {
    const { data } = await api.get<Safra[]>('/safras');
    return data;
  },

  async criar(payload: CreateSafraPayload): Promise<Safra> {
    const { data } = await api.post<Safra>('/safras', payload);
    return data;
  },

  async adicionarCultura(safraId: string, nome: string): Promise<CulturaPlantada> {
    const { data } = await api.post<CulturaPlantada>(`/safras/${safraId}/culturas`, { nome });
    return data;
  },

  async remover(id: string): Promise<void> {
    await api.delete(`/safras/${id}`);
  },

  async removerCultura(culturaId: string): Promise<void> {
    await api.delete(`/safras/culturas/${culturaId}`);
  },
};

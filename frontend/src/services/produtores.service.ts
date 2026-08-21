import { api } from './api';
import type { CreateProdutorPayload, Produtor } from '../types/domain';

export const produtoresService = {
  async listar(): Promise<Produtor[]> {
    const { data } = await api.get<Produtor[]>('/produtores');
    return data;
  },

  async buscarPorId(id: string): Promise<Produtor> {
    const { data } = await api.get<Produtor>(`/produtores/${id}`);
    return data;
  },

  async criar(payload: CreateProdutorPayload): Promise<Produtor> {
    const { data } = await api.post<Produtor>('/produtores', payload);
    return data;
  },

  async atualizar(
    id: string,
    payload: Partial<CreateProdutorPayload>,
  ): Promise<Produtor> {
    const { data } = await api.patch<Produtor>(`/produtores/${id}`, payload);
    return data;
  },

  async remover(id: string): Promise<void> {
    await api.delete(`/produtores/${id}`);
  },
};

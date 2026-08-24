import { api } from './api';
import type {
  CreatePropriedadePayload,
  Propriedade,
  UpdatePropriedadePayload,
} from '../types/domain';

export const propriedadesService = {
  async listar(): Promise<Propriedade[]> {
    const { data } = await api.get<Propriedade[]>('/propriedades');
    return data;
  },

  async criar(payload: CreatePropriedadePayload): Promise<Propriedade> {
    const { data } = await api.post<Propriedade>('/propriedades', payload);
    return data;
  },

  async atualizar(id: string, payload: UpdatePropriedadePayload): Promise<Propriedade> {
    const { data } = await api.patch<Propriedade>(`/propriedades/${id}`, payload);
    return data;
  },

  async remover(id: string): Promise<void> {
    await api.delete(`/propriedades/${id}`);
  },
};

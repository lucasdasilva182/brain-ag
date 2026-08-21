import { api } from './api';
import type { DashboardResumo } from '../types/domain';

export const dashboardService = {
  async getResumo(): Promise<DashboardResumo> {
    const { data } = await api.get<DashboardResumo>('/dashboard/resumo');
    return data;
  },
};

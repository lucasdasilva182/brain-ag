import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dashboardService } from '../../services/dashboard.service';
import type { DashboardResumo } from '../../types/domain';
import { produtoresMock } from '../../mocks/produtores.mock';

interface DashboardState {
  resumo: DashboardResumo | null;
  carregando: boolean;
  erro: string | null;
}

const initialState: DashboardState = {
  resumo: null,
  carregando: false,
  erro: null,
};

function calcularResumoMockado(): DashboardResumo {
  const propriedades = produtoresMock.flatMap((p) => p.propriedades);

  const contarPor = (
    itens: typeof propriedades,
    seletor: (p: (typeof propriedades)[number]) => string,
  ) => {
    const contagem = new Map<string, number>();
    for (const item of itens) {
      const chave = seletor(item);
      contagem.set(chave, (contagem.get(chave) ?? 0) + 1);
    }
    return Array.from(contagem.entries()).map(([label, value]) => ({ label, value }));
  };

  const contagemCulturas = new Map<string, number>();
  for (const prop of propriedades) {
    for (const safra of prop.safras) {
      for (const cultura of safra.culturas) {
        contagemCulturas.set(cultura.nome, (contagemCulturas.get(cultura.nome) ?? 0) + 1);
      }
    }
  }

  return {
    totalFazendas: propriedades.length,
    totalHectares: propriedades.reduce((soma, p) => soma + p.areaTotal, 0),
    graficoPorEstado: contarPor(propriedades, (p) => p.estado),
    graficoPorCultura: Array.from(contagemCulturas.entries()).map(([label, value]) => ({
      label,
      value,
    })),
    graficoUsoSolo: [
      {
        label: 'Área agricultável',
        value: propriedades.reduce((soma, p) => soma + p.areaAgricultavel, 0),
      },
      {
        label: 'Área de vegetação',
        value: propriedades.reduce((soma, p) => soma + p.areaVegetacao, 0),
      },
    ],
  };
}

export const buscarResumoDashboard = createAsyncThunk(
  'dashboard/buscarResumo',
  async () => {
    try {
      return await dashboardService.getResumo();
    } catch {
      return calcularResumoMockado();
    }
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarResumoDashboard.pending, (state) => {
        state.carregando = true;
        state.erro = null;
      })
      .addCase(buscarResumoDashboard.fulfilled, (state, action) => {
        state.carregando = false;
        state.resumo = action.payload;
      })
      .addCase(buscarResumoDashboard.rejected, (state, action) => {
        state.carregando = false;
        state.erro = action.error.message ?? 'Erro ao buscar dashboard';
      });
  },
});

export default dashboardSlice.reducer;

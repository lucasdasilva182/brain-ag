import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { safrasService } from '../../services/safras.service';
import { safrasMock } from '../../mocks/safras.mock';
import type { CreateSafraPayload, Safra } from '../../types/domain';
import { extrairMensagemDeErro } from '../../utils/api-error';

interface SafrasState {
  itens: Safra[];
  carregando: boolean;
  erro: string | null;
  usandoMock: boolean;
}

const initialState: SafrasState = {
  itens: [],
  carregando: false,
  erro: null,
  usandoMock: false,
};

export const buscarSafras = createAsyncThunk('safras/buscarSafras', async () => {
  try {
    return { itens: await safrasService.listar(), usandoMock: false };
  } catch {
    return { itens: safrasMock, usandoMock: true };
  }
});

export const criarSafra = createAsyncThunk(
  'safras/criarSafra',
  async (payload: CreateSafraPayload, { rejectWithValue }) => {
    try {
      return await safrasService.criar(payload);
    } catch (error) {
      return rejectWithValue(extrairMensagemDeErro(error, 'Não foi possível cadastrar a safra'));
    }
  },
);

export const removerSafra = createAsyncThunk(
  'safras/removerSafra',
  async (id: string, { rejectWithValue }) => {
    try {
      await safrasService.remover(id);
      return id;
    } catch (error) {
      return rejectWithValue(extrairMensagemDeErro(error, 'Não foi possível remover a safra'));
    }
  },
);

export const adicionarCultura = createAsyncThunk(
  'safras/adicionarCultura',
  async ({ safraId, nome }: { safraId: string; nome: string }, { rejectWithValue }) => {
    try {
      return await safrasService.adicionarCultura(safraId, nome);
    } catch (error) {
      return rejectWithValue(extrairMensagemDeErro(error, 'Não foi possível adicionar a cultura'));
    }
  },
);

export const removerCultura = createAsyncThunk(
  'safras/removerCultura',
  async ({ culturaId }: { safraId: string; culturaId: string }, { rejectWithValue }) => {
    try {
      await safrasService.removerCultura(culturaId);
      return culturaId;
    } catch (error) {
      return rejectWithValue(extrairMensagemDeErro(error, 'Não foi possível remover a cultura'));
    }
  },
);

const safrasSlice = createSlice({
  name: 'safras',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarSafras.pending, (state) => {
        state.carregando = true;
        state.erro = null;
      })
      .addCase(buscarSafras.fulfilled, (state, action) => {
        state.carregando = false;
        state.itens = action.payload.itens;
        state.usandoMock = action.payload.usandoMock;
      })
      .addCase(buscarSafras.rejected, (state, action) => {
        state.carregando = false;
        state.erro = action.error.message ?? 'Erro ao buscar safras';
      })
      .addCase(criarSafra.fulfilled, (state, action: PayloadAction<Safra>) => {
        state.itens.unshift({ ...action.payload, culturas: action.payload.culturas ?? [] });
      })
      .addCase(removerSafra.fulfilled, (state, action: PayloadAction<string>) => {
        state.itens = state.itens.filter((s) => s.id !== action.payload);
      })
      .addCase(adicionarCultura.fulfilled, (state, action) => {
        // action.meta.arg dá o safraId (a API só devolve a cultura criada).
        const safra = state.itens.find((s) => s.id === action.meta.arg.safraId);
        if (safra) {
          safra.culturas.push(action.payload);
        }
      })
      .addCase(removerCultura.fulfilled, (state, action) => {
        const safra = state.itens.find((s) => s.id === action.meta.arg.safraId);
        if (safra) {
          safra.culturas = safra.culturas.filter((c) => c.id !== action.payload);
        }
      });
  },
});

export default safrasSlice.reducer;

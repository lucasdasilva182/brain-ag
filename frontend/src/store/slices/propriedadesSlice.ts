import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { propriedadesService } from '../../services/propriedades.service';
import { propriedadesMock } from '../../mocks/propriedades.mock';
import type {
  CreatePropriedadePayload,
  Propriedade,
  UpdatePropriedadePayload,
} from '../../types/domain';
import { extrairMensagemDeErro } from '../../utils/api-error';

export interface PropriedadesState {
  itens: Propriedade[];
  carregando: boolean;
  erro: string | null;
  usandoMock: boolean;
}

const initialState: PropriedadesState = {
  itens: [],
  carregando: false,
  erro: null,
  usandoMock: false,
};

export const buscarPropriedades = createAsyncThunk(
  'propriedades/buscarPropriedades',
  async () => {
    try {
      return { itens: await propriedadesService.listar(), usandoMock: false };
    } catch {
      return { itens: propriedadesMock, usandoMock: true };
    }
  },
);

export const criarPropriedade = createAsyncThunk(
  'propriedades/criarPropriedade',
  async (payload: CreatePropriedadePayload, { rejectWithValue }) => {
    try {
      return await propriedadesService.criar(payload);
    } catch (error) {
      return rejectWithValue(
        extrairMensagemDeErro(error, 'Não foi possível cadastrar a propriedade'),
      );
    }
  },
);

export const editarPropriedade = createAsyncThunk(
  'propriedades/editarPropriedade',
  async (
    { id, dados }: { id: string; dados: UpdatePropriedadePayload },
    { rejectWithValue },
  ) => {
    try {
      return await propriedadesService.atualizar(id, dados);
    } catch (error) {
      return rejectWithValue(
        extrairMensagemDeErro(error, 'Não foi possível atualizar a propriedade'),
      );
    }
  },
);

export const removerPropriedade = createAsyncThunk(
  'propriedades/removerPropriedade',
  async (id: string, { rejectWithValue }) => {
    try {
      await propriedadesService.remover(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        extrairMensagemDeErro(error, 'Não foi possível remover a propriedade'),
      );
    }
  },
);

const propriedadesSlice = createSlice({
  name: 'propriedades',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarPropriedades.pending, (state) => {
        state.carregando = true;
        state.erro = null;
      })
      .addCase(buscarPropriedades.fulfilled, (state, action) => {
        state.carregando = false;
        state.itens = action.payload.itens;
        state.usandoMock = action.payload.usandoMock;
      })
      .addCase(buscarPropriedades.rejected, (state, action) => {
        state.carregando = false;
        state.erro = action.error.message ?? 'Erro ao buscar propriedades';
      })
      .addCase(criarPropriedade.fulfilled, (state, action: PayloadAction<Propriedade>) => {
        state.itens.unshift({ ...action.payload, safras: action.payload.safras ?? [] });
      })
      .addCase(editarPropriedade.fulfilled, (state, action: PayloadAction<Propriedade>) => {
        const index = state.itens.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.itens[index] = { ...state.itens[index], ...action.payload };
        }
      })
      .addCase(removerPropriedade.fulfilled, (state, action: PayloadAction<string>) => {
        state.itens = state.itens.filter((p) => p.id !== action.payload);
      });
  },
});

export default propriedadesSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { produtoresService } from '../../services/produtores.service';
import { produtoresMock } from '../../mocks/produtores.mock';
import type { CreateProdutorPayload, Produtor } from '../../types/domain';
import { extrairMensagemDeErro } from '../../utils/api-error';

interface ProdutoresState {
  itens: Produtor[];
  carregando: boolean;
  erro: string | null;
  usandoMock: boolean;
}

const initialState: ProdutoresState = {
  itens: [],
  carregando: false,
  erro: null,
  usandoMock: false,
};

// Fallback pros dados mockados se o backend estiver fora do ar.
export const buscarProdutores = createAsyncThunk(
  'produtores/buscarProdutores',
  async () => {
    try {
      return { itens: await produtoresService.listar(), usandoMock: false };
    } catch {
      return { itens: produtoresMock, usandoMock: true };
    }
  },
);

// rejectWithValue propaga a mensagem real do backend até quem usar .unwrap().
export const criarProdutor = createAsyncThunk(
  'produtores/criarProdutor',
  async (payload: CreateProdutorPayload, { rejectWithValue }) => {
    try {
      return await produtoresService.criar(payload);
    } catch (error) {
      return rejectWithValue(
        extrairMensagemDeErro(error, 'Não foi possível cadastrar o produtor'),
      );
    }
  },
);

export const editarProdutor = createAsyncThunk(
  'produtores/editarProdutor',
  async (
    { id, dados }: { id: string; dados: Partial<CreateProdutorPayload> },
    { rejectWithValue },
  ) => {
    try {
      return await produtoresService.atualizar(id, dados);
    } catch (error) {
      return rejectWithValue(
        extrairMensagemDeErro(error, 'Não foi possível atualizar o produtor'),
      );
    }
  },
);

export const removerProdutor = createAsyncThunk(
  'produtores/removerProdutor',
  async (id: string, { rejectWithValue }) => {
    try {
      await produtoresService.remover(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        extrairMensagemDeErro(error, 'Não foi possível remover o produtor'),
      );
    }
  },
);

const produtoresSlice = createSlice({
  name: 'produtores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarProdutores.pending, (state) => {
        state.carregando = true;
        state.erro = null;
      })
      .addCase(buscarProdutores.fulfilled, (state, action) => {
        state.carregando = false;
        state.itens = action.payload.itens;
        state.usandoMock = action.payload.usandoMock;
      })
      .addCase(buscarProdutores.rejected, (state, action) => {
        state.carregando = false;
        state.erro = action.error.message ?? 'Erro ao buscar produtores';
      })
      .addCase(criarProdutor.fulfilled, (state, action: PayloadAction<Produtor>) => {
        // Fallback defensivo caso a API omita "propriedades" na resposta.
        state.itens.unshift({ ...action.payload, propriedades: action.payload.propriedades ?? [] });
      })
      .addCase(editarProdutor.fulfilled, (state, action: PayloadAction<Produtor>) => {
        const index = state.itens.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          // Merge (não substituição): o PATCH não devolve "propriedades".
          state.itens[index] = { ...state.itens[index], ...action.payload };
        }
      })
      .addCase(removerProdutor.fulfilled, (state, action: PayloadAction<string>) => {
        state.itens = state.itens.filter((p) => p.id !== action.payload);
      });
  },
});

export default produtoresSlice.reducer;

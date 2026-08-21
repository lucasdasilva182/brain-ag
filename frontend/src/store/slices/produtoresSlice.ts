import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { produtoresService } from '../../services/produtores.service';
import { produtoresMock } from '../../mocks/produtores.mock';
import type { CreateProdutorPayload, Produtor } from '../../types/domain';

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

// Se a API não responder (backend fora do ar), caímos nos dados
// mockados em vez de deixar a tela vazia — bom pra demonstrar a UI
// sem depender do backend estar rodando.
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

export const criarProdutor = createAsyncThunk(
  'produtores/criarProdutor',
  async (payload: CreateProdutorPayload) => {
    return produtoresService.criar(payload);
  },
);

export const removerProdutor = createAsyncThunk(
  'produtores/removerProdutor',
  async (id: string) => {
    await produtoresService.remover(id);
    return id;
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
        state.itens.unshift(action.payload);
      })
      .addCase(removerProdutor.fulfilled, (state, action: PayloadAction<string>) => {
        state.itens = state.itens.filter((p) => p.id !== action.payload);
      });
  },
});

export default produtoresSlice.reducer;

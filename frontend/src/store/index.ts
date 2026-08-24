import { configureStore } from '@reduxjs/toolkit';
import produtoresReducer from './slices/produtoresSlice';
import propriedadesReducer from './slices/propriedadesSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    produtores: produtoresReducer,
    propriedades: propriedadesReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

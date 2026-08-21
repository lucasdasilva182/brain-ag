import { configureStore } from '@reduxjs/toolkit';
import produtoresReducer from './slices/produtoresSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    produtores: produtoresReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

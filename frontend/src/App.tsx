import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { store } from './store';
import { theme } from './theme';
import { GlobalStyle } from './GlobalStyle';
import { MainLayout } from './components/templates/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProdutoresPage } from './pages/ProdutoresPage';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/produtores" element={<ProdutoresPage />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

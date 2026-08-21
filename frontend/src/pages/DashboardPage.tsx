import { useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { buscarResumoDashboard } from '../store/slices/dashboardSlice';
import { StatCard } from '../components/molecules/StatCard';
import { PieChartCard } from '../components/organisms/PieChartCard';
import { formatarHectares } from '../utils/format';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

const GridGraficos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
`;

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const { resumo, carregando } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(buscarResumoDashboard());
  }, [dispatch]);

  if (carregando && !resumo) {
    return <p>Carregando dashboard...</p>;
  }

  if (!resumo) {
    return <p>Não foi possível carregar os dados do dashboard.</p>;
  }

  return (
    <div>
      <Grid>
        <StatCard valor={String(resumo.totalFazendas)} rotulo="Fazendas cadastradas" />
        <StatCard valor={formatarHectares(resumo.totalHectares)} rotulo="Área total registrada" />
      </Grid>

      <GridGraficos>
        <PieChartCard titulo="Fazendas por estado" dados={resumo.graficoPorEstado} />
        <PieChartCard titulo="Culturas plantadas" dados={resumo.graficoPorCultura} />
        <PieChartCard titulo="Uso do solo" dados={resumo.graficoUsoSolo} />
      </GridGraficos>
    </div>
  );
}

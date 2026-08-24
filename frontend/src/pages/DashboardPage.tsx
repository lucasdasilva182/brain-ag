import { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { UserPlus, MapPinPlus, Sprout } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { buscarResumoDashboard } from '../store/slices/dashboardSlice';
import { StatCard } from '../components/molecules/StatCard';
import { PieChartCard } from '../components/organisms/PieChartCard';
import { Card, CardTitle } from '../components/atoms/Card';
import { formatarHectares } from '../utils/format';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const GridGraficos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
`;

const AcessoRapido = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
`;

const AtalhoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surfaceRaised};
  }

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }
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

      <Card style={{ marginBottom: 16 }}>
        <CardTitle>Acesso rápido</CardTitle>
        <AcessoRapido>
          <AtalhoLink to="/produtores?novo=1">
            <UserPlus size={20} />
            Novo produtor
          </AtalhoLink>
          <AtalhoLink to="/propriedades?novo=1">
            <MapPinPlus size={20} />
            Nova propriedade
          </AtalhoLink>
          <AtalhoLink to="/safras?novo=1">
            <Sprout size={20} />
            Nova safra
          </AtalhoLink>
        </AcessoRapido>
      </Card>

      <GridGraficos>
        <PieChartCard titulo="Fazendas por estado" dados={resumo.graficoPorEstado} />
        <PieChartCard titulo="Culturas plantadas" dados={resumo.graficoPorCultura} />
        <PieChartCard titulo="Uso do solo" dados={resumo.graficoUsoSolo} />
      </GridGraficos>
    </div>
  );
}

import { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { UserPlus, MapPinPlus, Sprout } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { buscarResumoDashboard } from '../store/slices/dashboardSlice';
import { PieChartCard } from '../components/organisms/PieChartCard';
import { DashboardSkeleton } from '../components/organisms/DashboardSkeleton';
import { Card, CardTitle } from '../components/atoms/Card';
import { formatarHectares } from '../utils/format';
import { PageHeader } from '../components/molecules/PageHeader';

const BREAKPOINT_TABLET = '900px';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-areas:
    'hero acesso'
    'cultura acesso'
    'secundarios acesso';
  gap: ${({ theme }) => theme.spacing(4)};
  align-items: start;

  @media (max-width: ${BREAKPOINT_TABLET}) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'hero'
      'acesso'
      'cultura'
      'secundarios';
    gap: ${({ theme }) => theme.spacing(4)};
  }
`;

const Wrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

const HeroCard = styled.div`
  grid-area: hero;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.spacing(4)};
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(5)};

  @media (max-width: ${BREAKPOINT_TABLET}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing(4)};
  }
`;

const HeroValor = styled.p`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryLight};
  margin: 0;
  line-height: 1;
`;

const HeroLabel = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 8px 0 0 0;
`;

const HeroSecundario = styled.div`
  text-align: right;

  @media (max-width: ${BREAKPOINT_TABLET}) {
    text-align: left;
  }
`;

const HeroSecundarioValor = styled.p`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1;
`;

const CulturaArea = styled.div`
  grid-area: cultura;
`;

const GraficosSecundarios = styled.div`
  grid-area: secundarios;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
`;

const AcessoArea = styled.div`
  grid-area: acesso;
`;

const AcessoRapidoLista = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const AtalhoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 13px;
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
    return <DashboardSkeleton />;
  }

  if (!resumo) {
    return <p>Não foi possível carregar os dados do dashboard.</p>;
  }

  return (
    <div>
      <Wrapper>
        <PageHeader titulo="Dashboard" subtitulo="Visão geral da operação agrícola" />
      </Wrapper>

      <Layout>
        <HeroCard>
          <div>
            <HeroValor>{formatarHectares(resumo.totalHectares)}</HeroValor>
            <HeroLabel>Área total registrada</HeroLabel>
          </div>
          <HeroSecundario>
            <HeroSecundarioValor>{resumo.totalFazendas}</HeroSecundarioValor>
            <HeroLabel>Fazendas cadastradas</HeroLabel>
          </HeroSecundario>
        </HeroCard>

        <AcessoArea>
          <Card>
            <CardTitle>Acesso rápido</CardTitle>
            <AcessoRapidoLista>
              <AtalhoLink to="/produtores?novo=1">
                <UserPlus size={18} />
                Novo produtor
              </AtalhoLink>
              <AtalhoLink to="/propriedades?novo=1">
                <MapPinPlus size={18} />
                Nova propriedade
              </AtalhoLink>
              <AtalhoLink to="/safras?novo=1">
                <Sprout size={18} />
                Nova safra
              </AtalhoLink>
            </AcessoRapidoLista>
          </Card>
        </AcessoArea>

        <CulturaArea>
          <PieChartCard titulo="Culturas plantadas" dados={resumo.graficoPorCultura} />
        </CulturaArea>

        <GraficosSecundarios>
          <PieChartCard titulo="Fazendas por estado" dados={resumo.graficoPorEstado} />
          <PieChartCard titulo="Uso do solo" dados={resumo.graficoUsoSolo} />
        </GraficosSecundarios>
      </Layout>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { produtoresService } from '../services/produtores.service';
import { formatarDocumento, formatarHectares } from '../utils/format';
import { Card, CardTitle } from '../components/atoms/Card';
import { StatCard } from '../components/molecules/StatCard';
import { DataTable } from '../components/molecules/DataTable';
import type { DataTableColumn } from '../components/molecules/DataTable';
import type { Produtor, Propriedade } from '../types/domain';

const VoltarLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  margin-bottom: ${({ theme }) => theme.spacing(4)};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const Nome = styled.h2`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px 0;
`;

const Documento = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const LinkGerenciar = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primaryLight};
  text-decoration: none;
  margin-top: ${({ theme }) => theme.spacing(4)};

  &:hover {
    text-decoration: underline;
  }
`;

function areaTotalDoProdutor(produtor: Produtor): number {
  return produtor.propriedades.reduce((soma, p) => soma + Number(p.areaTotal), 0);
}

export function ProdutorDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const [produtor, setProdutor] = useState<Produtor | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setCarregando(true);
    setErro(null);
    produtoresService
      .buscarPorId(id)
      .then(setProdutor)
      .catch(() => setErro('Não foi possível carregar os dados deste produtor.'))
      .finally(() => setCarregando(false));
  }, [id]);

  const colunasPropriedades: DataTableColumn<Propriedade>[] = [
    { key: 'nome', label: 'Fazenda', render: (p) => p.nome },
    { key: 'cidade', label: 'Cidade/UF', render: (p) => `${p.cidade}/${p.estado}` },
    { key: 'area', label: 'Área total', render: (p) => formatarHectares(p.areaTotal) },
  ];

  return (
    <div>
      <VoltarLink to="/produtores">
        <ArrowLeft size={16} />
        Voltar para produtores
      </VoltarLink>

      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: '#E8604C' }}>{erro}</p>}

      {produtor && (
        <>
          <Header>
            <Nome>{produtor.nome}</Nome>
            <Documento>{formatarDocumento(produtor.documento)}</Documento>
          </Header>

          <Grid>
            <StatCard valor={String(produtor.propriedades.length)} rotulo="Propriedades" />
            <StatCard valor={formatarHectares(areaTotalDoProdutor(produtor))} rotulo="Área total" />
          </Grid>

          <Card>
            <CardTitle>Propriedades deste produtor</CardTitle>
            <DataTable
              columns={colunasPropriedades}
              data={produtor.propriedades}
              getRowKey={(p) => p.id}
              emptyMessage="Este produtor ainda não tem propriedades cadastradas."
            />
            <LinkGerenciar to={`/propriedades?produtorId=${produtor.id}`}>
              Gerenciar propriedades deste produtor
              <ArrowUpRight size={14} />
            </LinkGerenciar>
          </Card>
        </>
      )}
    </div>
  );
}

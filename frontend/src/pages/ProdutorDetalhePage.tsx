import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, ArrowUpRight, Pencil, Trash2, MapPin, Sprout } from 'lucide-react';
import { produtoresService } from '../services/produtores.service';
import { useAppDispatch } from '../hooks/redux';
import { editarProdutor, removerProdutor } from '../store/slices/produtoresSlice';
import { formatarDocumento, formatarHectares } from '../utils/format';
import { Button } from '../components/atoms/Button';
import { Modal } from '../components/molecules/Modal';
import { ProdutorForm } from '../components/organisms/produtores/ProdutorForm';
import type { Produtor, Propriedade } from '../types/domain';

const BREAKPOINT_TABLET = '768px';

const VoltarLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  margin-bottom: ${({ theme }) => theme.spacing(5)};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: ${({ theme }) => theme.spacing(4)};
  align-items: start;

  @media (max-width: ${BREAKPOINT_TABLET}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
  padding: ${({ theme }) => theme.spacing(5)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  position: sticky;
  top: ${({ theme }) => theme.spacing(6)};

  @media (max-width: ${BREAKPOINT_TABLET}) {
    position: static;
  }
`;

const Nome = styled.h2`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px 0;
`;

const Documento = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

const SidebarStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const SidebarStatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const SidebarStatLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SidebarStatValor = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryLight};
`;

const SidebarAcoes = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  button {
    width: 100%;
    justify-content: center;
  }
`;

const Content = styled.div``;

const ListaPropriedades = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const PropriedadeCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.spacing(5)};
`;

const PropHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const PropNome = styled.h4`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const PropLocal = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BarraArea = styled.div`
  display: flex;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const Segmento = styled.div<{ $largura: number; $cor: string }>`
  width: ${({ $largura }) => $largura}%;
  background: ${({ $cor }) => $cor};
`;

const LegendaArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const LegendaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LegendaCor = styled.span<{ $cor: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $cor }) => $cor};
  flex-shrink: 0;
`;

const LegendaValor = styled.strong`
  color: ${({ theme }) => theme.colors.text};
`;

const SafrasLabel = styled.p`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing(2)} 0;
`;

const SafrasFlow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const SafraGrupo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SafraAno = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryLight};
`;

const Tag = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};

  &::before {
    content: '·';
    margin-right: 6px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const SemSafras = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
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

const EstadoVazio = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  text-align: center;
  padding: ${({ theme }) => theme.spacing(6)} 0;
`;

const ConfirmText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing(5)} 0;
`;

const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const CORES = {
  agricultavel: '#cf8b08',
  vegetacao: '#6FDB9A',
  naoClassificada: '#34342F',
};

function areaTotalDoProdutor(produtor: Produtor): number {
  return produtor.propriedades.reduce((soma, p) => soma + Number(p.areaTotal), 0);
}

function proporcoesDeArea(propriedade: Propriedade) {
  const total = Number(propriedade.areaTotal) || 1; // evita divisão por zero
  const agricultavel = Number(propriedade.areaAgricultavel);
  const vegetacao = Number(propriedade.areaVegetacao);
  const naoClassificada = Math.max(0, total - agricultavel - vegetacao);

  return {
    agricultavelPct: (agricultavel / total) * 100,
    vegetacaoPct: (vegetacao / total) * 100,
    naoClassificadaPct: (naoClassificada / total) * 100,
    naoClassificada,
  };
}

export function ProdutorDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [produtor, setProdutor] = useState<Produtor | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [editarAberto, setEditarAberto] = useState(false);
  const [removerAberto, setRemoverAberto] = useState(false);
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    carregarProdutor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function carregarProdutor() {
    if (!id) return;
    setCarregando(true);
    setErro(null);
    produtoresService
      .buscarPorId(id)
      .then(setProdutor)
      .catch(() => setErro('Não foi possível carregar os dados deste produtor.'))
      .finally(() => setCarregando(false));
  }

  async function handleEditar(dados: { documento: string; nome: string }) {
    if (!produtor) return;
    await dispatch(editarProdutor({ id: produtor.id, dados })).unwrap();
    setEditarAberto(false);
    carregarProdutor();
  }

  async function handleConfirmarRemocao() {
    if (!produtor) return;
    setRemovendo(true);
    try {
      await dispatch(removerProdutor(produtor.id)).unwrap();
      navigate('/produtores');
    } finally {
      setRemovendo(false);
    }
  }

  return (
    <div>
      <VoltarLink to="/produtores">
        <ArrowLeft size={16} />
        Voltar para produtores
      </VoltarLink>

      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: '#E8604C' }}>{erro}</p>}

      {produtor && (
        <Layout>
          <Sidebar>
            <div>
              <Nome>{produtor.nome}</Nome>
              <Documento>{formatarDocumento(produtor.documento)}</Documento>
            </div>

            <SidebarStats>
              <SidebarStatItem>
                <SidebarStatLabel>Propriedades</SidebarStatLabel>
                <SidebarStatValor>{produtor.propriedades.length}</SidebarStatValor>
              </SidebarStatItem>
              <SidebarStatItem>
                <SidebarStatLabel>Área total</SidebarStatLabel>
                <SidebarStatValor>
                  {formatarHectares(areaTotalDoProdutor(produtor))}
                </SidebarStatValor>
              </SidebarStatItem>
            </SidebarStats>

            <SidebarAcoes>
              <Button $variant="secondary" onClick={() => setEditarAberto(true)}>
                <Pencil size={14} />
                Editar
              </Button>
              <Button $variant="danger" onClick={() => setRemoverAberto(true)}>
                <Trash2 size={14} />
                Remover
              </Button>
            </SidebarAcoes>
          </Sidebar>

          <Content>
            {produtor.propriedades.length === 0 ? (
              <EstadoVazio>Este produtor ainda não tem propriedades cadastradas.</EstadoVazio>
            ) : (
              <ListaPropriedades>
                {produtor.propriedades.map((propriedade) => {
                  const prop = proporcoesDeArea(propriedade);
                  return (
                    <PropriedadeCard key={propriedade.id}>
                      <PropHeader>
                        <PropNome>{propriedade.nome}</PropNome>
                        <PropLocal>
                          <MapPin size={13} />
                          {propriedade.cidade} — {propriedade.estado}
                        </PropLocal>
                      </PropHeader>

                      <BarraArea>
                        <Segmento $largura={prop.agricultavelPct} $cor={CORES.agricultavel} />
                        <Segmento $largura={prop.vegetacaoPct} $cor={CORES.vegetacao} />
                        {prop.naoClassificada > 0 && (
                          <Segmento
                            $largura={prop.naoClassificadaPct}
                            $cor={CORES.naoClassificada}
                          />
                        )}
                      </BarraArea>

                      <LegendaArea>
                        <LegendaItem>
                          <LegendaCor $cor={CORES.agricultavel} />
                          <LegendaValor>
                            {formatarHectares(propriedade.areaAgricultavel)}
                          </LegendaValor>{' '}
                          agricultável
                        </LegendaItem>
                        <LegendaItem>
                          <LegendaCor $cor={CORES.vegetacao} />
                          <LegendaValor>
                            {formatarHectares(propriedade.areaVegetacao)}
                          </LegendaValor>{' '}
                          vegetação
                        </LegendaItem>
                        <LegendaItem>
                          <LegendaValor>{formatarHectares(propriedade.areaTotal)}</LegendaValor>{' '}
                          total
                        </LegendaItem>
                      </LegendaArea>

                      <SafrasLabel>Safras</SafrasLabel>
                      {propriedade.safras.length === 0 ? (
                        <SemSafras>Nenhuma safra cadastrada nesta propriedade.</SemSafras>
                      ) : (
                        <SafrasFlow>
                          {propriedade.safras.map((safra) => (
                            <SafraGrupo key={safra.id}>
                              <SafraAno>
                                <Sprout size={12} />
                                {safra.ano}
                              </SafraAno>
                              {safra.culturas.length === 0 ? (
                                <Tag>sem culturas</Tag>
                              ) : (
                                safra.culturas.map((cultura) => (
                                  <Tag key={cultura.id}>{cultura.nome}</Tag>
                                ))
                              )}
                            </SafraGrupo>
                          ))}
                        </SafrasFlow>
                      )}
                    </PropriedadeCard>
                  );
                })}
              </ListaPropriedades>
            )}

            <LinkGerenciar to={`/propriedades?produtorId=${produtor.id}`}>
              Gerenciar propriedades deste produtor
              <ArrowUpRight size={14} />
            </LinkGerenciar>
          </Content>
        </Layout>
      )}

      <Modal open={editarAberto} onClose={() => setEditarAberto(false)} title="Editar produtor">
        {produtor && (
          <ProdutorForm
            initialValues={{ documento: produtor.documento, nome: produtor.nome }}
            onSubmit={handleEditar}
            submitLabel="Salvar alterações"
          />
        )}
      </Modal>

      <Modal open={removerAberto} onClose={() => setRemoverAberto(false)} title="Remover produtor">
        {produtor && (
          <>
            <ConfirmText>
              Tem certeza que deseja remover <strong>{produtor.nome}</strong>? Essa ação também
              remove todas as propriedades, safras e culturas vinculadas a ele, e não pode ser
              desfeita.
            </ConfirmText>
            <ConfirmActions>
              <Button $variant="secondary" onClick={() => setRemoverAberto(false)}>
                Cancelar
              </Button>
              <Button $variant="danger" onClick={handleConfirmarRemocao} disabled={removendo}>
                {removendo ? 'Removendo...' : 'Remover'}
              </Button>
            </ConfirmActions>
          </>
        )}
      </Modal>
    </div>
  );
}

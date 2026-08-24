import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { X, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { buscarProdutores } from '../store/slices/produtoresSlice';
import {
  buscarPropriedades,
  criarPropriedade,
  editarPropriedade,
  removerPropriedade,
} from '../store/slices/propriedadesSlice';
import { PropriedadeForm } from '../components/organisms/propriedades/PropriedadeForm';
import { PropriedadeList } from '../components/organisms/propriedades/PropriedadeList';
import { Card, CardTitle } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Modal } from '../components/molecules/Modal';
import { TableSkeleton } from '../components/molecules/TableSkeleton';
import type { Propriedade } from '../types/domain';
import type { PropriedadeFormValues } from '../components/organisms/propriedades/PropriedadeForm';
import { PageHeader } from '../components/molecules/PageHeader';

const BREAKPOINT_TABLET = '900px';

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${BREAKPOINT_TABLET}) {
    flex-direction: column;
    align-items: flex-end;
    gap: ${({ theme }) => theme.spacing(4)};
  }
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

const FiltroChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  align-self: flex-start;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
`;

const LimparFiltro = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

export function PropriedadesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    itens: propriedades,
    carregando,
    usandoMock,
  } = useAppSelector((state) => state.propriedades);
  const { itens: produtores } = useAppSelector((state) => state.produtores);
  const [searchParams, setSearchParams] = useSearchParams();
  const produtorIdFiltro = searchParams.get('produtorId');

  const [criarAberto, setCriarAberto] = useState(false);
  const [propriedadeEditando, setPropriedadeEditando] = useState<Propriedade | null>(null);
  const [propriedadeRemovendo, setPropriedadeRemovendo] = useState<Propriedade | null>(null);
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    dispatch(buscarPropriedades());
    dispatch(buscarProdutores());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams.get('novo') === '1') {
      setCriarAberto(true);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('novo');
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function nomeDoProdutor(produtorId: string): string {
    return produtores.find((p) => p.id === produtorId)?.nome ?? 'Produtor não encontrado';
  }

  function handleNovaSafra(propriedade: Propriedade) {
    navigate(`/safras?novo=1&propriedadeId=${propriedade.id}`);
  }

  const propriedadesFiltradas = produtorIdFiltro
    ? propriedades.filter((p) => p.produtorId === produtorIdFiltro)
    : propriedades;

  async function handleCriar(dados: PropriedadeFormValues) {
    await dispatch(criarPropriedade(dados)).unwrap();
    setCriarAberto(false);
  }

  async function handleEditar(dados: PropriedadeFormValues) {
    if (!propriedadeEditando) return;
    const { produtorId: _produtorId, ...dadosEditaveis } = dados;
    await dispatch(
      editarPropriedade({ id: propriedadeEditando.id, dados: dadosEditaveis }),
    ).unwrap();
    setPropriedadeEditando(null);
  }

  async function handleConfirmarRemocao() {
    if (!propriedadeRemovendo) return;
    setRemovendo(true);
    try {
      await dispatch(removerPropriedade(propriedadeRemovendo.id)).unwrap();
      setPropriedadeRemovendo(null);
    } finally {
      setRemovendo(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {usandoMock && (
        <p style={{ fontSize: 13, color: '#E8B34C' }}>
          Não foi possível conectar à API — exibindo dados de exemplo.
        </p>
      )}

      <Toolbar>
        <PageHeader
          titulo="Propriedades"
          subtitulo="Fazendas cadastradas e suas informações de área"
        />
        <Button onClick={() => setCriarAberto(true)} disabled={produtores.length === 0}>
          <Plus size={16} />
          Nova propriedade
        </Button>
      </Toolbar>

      {produtorIdFiltro && (
        <FiltroChip>
          Filtrando por: <strong>{nomeDoProdutor(produtorIdFiltro)}</strong>
          <LimparFiltro onClick={() => setSearchParams({})} aria-label="Limpar filtro de produtor">
            <X size={14} />
          </LimparFiltro>
        </FiltroChip>
      )}

      {produtores.length === 0 && !carregando && (
        <p style={{ fontSize: 13, color: '#9A9A93' }}>
          Cadastre um produtor antes de criar uma propriedade.
        </p>
      )}

      <Card>
        <CardTitle>Propriedades cadastradas</CardTitle>
        {carregando ? (
          <TableSkeleton columns={5} />
        ) : (
          <PropriedadeList
            propriedades={propriedadesFiltradas}
            nomeDoProdutor={nomeDoProdutor}
            onEditar={setPropriedadeEditando}
            onRemover={setPropriedadeRemovendo}
            onNovaSafra={handleNovaSafra}
          />
        )}
      </Card>

      <Modal open={criarAberto} onClose={() => setCriarAberto(false)} title="Cadastrar propriedade">
        <PropriedadeForm
          produtorOptions={produtores.map((p) => ({ id: p.id, nome: p.nome }))}
          onSubmit={handleCriar}
        />
      </Modal>

      <Modal
        open={!!propriedadeEditando}
        onClose={() => setPropriedadeEditando(null)}
        title="Editar propriedade"
      >
        {propriedadeEditando && (
          <PropriedadeForm
            produtorOptions={produtores.map((p) => ({ id: p.id, nome: p.nome }))}
            produtorFixo={{
              id: propriedadeEditando.produtorId,
              nome: nomeDoProdutor(propriedadeEditando.produtorId),
            }}
            initialValues={{
              nome: propriedadeEditando.nome,
              cidade: propriedadeEditando.cidade,
              estado: propriedadeEditando.estado,
              areaTotal: propriedadeEditando.areaTotal,
              areaAgricultavel: propriedadeEditando.areaAgricultavel,
              areaVegetacao: propriedadeEditando.areaVegetacao,
            }}
            onSubmit={handleEditar}
            submitLabel="Salvar alterações"
          />
        )}
      </Modal>

      <Modal
        open={!!propriedadeRemovendo}
        onClose={() => setPropriedadeRemovendo(null)}
        title="Remover propriedade"
      >
        {propriedadeRemovendo && (
          <>
            <ConfirmText>
              Tem certeza que deseja remover <strong>{propriedadeRemovendo.nome}</strong>? Essa ação
              também remove todas as safras vinculadas a ela, e não pode ser desfeita.
            </ConfirmText>
            <ConfirmActions>
              <Button $variant="secondary" onClick={() => setPropriedadeRemovendo(null)}>
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

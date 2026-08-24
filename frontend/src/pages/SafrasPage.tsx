import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { buscarPropriedades } from '../store/slices/propriedadesSlice';
import {
  adicionarCultura,
  buscarSafras,
  criarSafra,
  removerCultura,
  removerSafra,
} from '../store/slices/safrasSlice';
import { SafraForm } from '../components/organisms/safras/SafraForm';
import { SafraList } from '../components/organisms/safras/SafraList';
import { Card, CardTitle } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Modal } from '../components/molecules/Modal';
import type { Safra } from '../types/domain';
import type { SafraFormValues } from '../components/organisms/safras/SafraForm';

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
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

export function SafrasPage() {
  const dispatch = useAppDispatch();
  const { itens: safras, carregando, usandoMock } = useAppSelector((state) => state.safras);
  const { itens: propriedades } = useAppSelector((state) => state.propriedades);
  const [searchParams, setSearchParams] = useSearchParams();

  const [criarAberto, setCriarAberto] = useState(false);
  const [propriedadeFixaId, setPropriedadeFixaId] = useState<string | null>(null);
  const [safraRemovendo, setSafraRemovendo] = useState<Safra | null>(null);
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    if (searchParams.get('novo') === '1') {
      setCriarAberto(true);
      setPropriedadeFixaId(searchParams.get('propriedadeId'));
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('novo');
        next.delete('propriedadeId');
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fecharModalCriar() {
    setCriarAberto(false);
    setPropriedadeFixaId(null);
  }

  useEffect(() => {
    dispatch(buscarSafras());
    dispatch(buscarPropriedades());
  }, [dispatch]);

  function nomeDaPropriedade(propriedadeId: string): string {
    return (
      propriedades.find((p) => p.id === propriedadeId)?.nome ?? 'Propriedade não encontrada'
    );
  }

  async function handleCriar(dados: SafraFormValues) {
    await dispatch(
      criarSafra({
        propriedadeId: dados.propriedadeId,
        ano: dados.ano,
        culturas: dados.culturas.map((nome) => ({ nome })),
      }),
    ).unwrap();
    fecharModalCriar();
  }

  // Ações de cultura são rápidas e reversíveis: sem .unwrap(), diferente
  // do fluxo principal de criar/remover safra.
  function handleAdicionarCultura(safraId: string, nome: string) {
    dispatch(adicionarCultura({ safraId, nome }));
  }

  function handleRemoverCultura(safraId: string, culturaId: string) {
    dispatch(removerCultura({ safraId, culturaId }));
  }

  async function handleConfirmarRemocao() {
    if (!safraRemovendo) return;
    setRemovendo(true);
    try {
      await dispatch(removerSafra(safraRemovendo.id)).unwrap();
      setSafraRemovendo(null);
    } finally {
      setRemovendo(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {usandoMock && (
        <p style={{ fontSize: 13, color: '#E8B34C' }}>
          Não foi possível conectar à API — exibindo dados de exemplo.
        </p>
      )}

      <Toolbar>
        <Button onClick={() => setCriarAberto(true)} disabled={propriedades.length === 0}>
          <Plus size={16} />
          Nova safra
        </Button>
      </Toolbar>

      {propriedades.length === 0 && !carregando && (
        <p style={{ fontSize: 13, color: '#9A9A93' }}>
          Cadastre uma propriedade antes de criar uma safra.
        </p>
      )}

      <Card>
        <CardTitle>Safras cadastradas</CardTitle>
        {carregando ? (
          <p>Carregando...</p>
        ) : (
          <SafraList
            safras={safras}
            nomeDaPropriedade={nomeDaPropriedade}
            onAdicionarCultura={handleAdicionarCultura}
            onRemoverCultura={handleRemoverCultura}
            onRemoverSafra={setSafraRemovendo}
          />
        )}
      </Card>

      <Modal open={criarAberto} onClose={fecharModalCriar} title="Cadastrar safra">
        <SafraForm
          propriedadeOptions={propriedades.map((p) => ({ id: p.id, nome: p.nome }))}
          propriedadeFixa={
            propriedadeFixaId
              ? { id: propriedadeFixaId, nome: nomeDaPropriedade(propriedadeFixaId) }
              : undefined
          }
          onSubmit={handleCriar}
        />
      </Modal>

      <Modal
        open={!!safraRemovendo}
        onClose={() => setSafraRemovendo(null)}
        title="Remover safra"
      >
        {safraRemovendo && (
          <>
            <ConfirmText>
              Tem certeza que deseja remover a safra <strong>{safraRemovendo.ano}</strong>{' '}
              de <strong>{nomeDaPropriedade(safraRemovendo.propriedadeId)}</strong>? Essa
              ação também remove todas as culturas plantadas vinculadas a ela, e não pode
              ser desfeita.
            </ConfirmText>
            <ConfirmActions>
              <Button $variant="secondary" onClick={() => setSafraRemovendo(null)}>
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

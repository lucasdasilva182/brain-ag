import { useEffect, useState } from 'react';
import styled from 'styled-components';
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
import type { Propriedade } from '../types/domain';
import type { PropriedadeFormValues } from '../components/organisms/propriedades/PropriedadeForm';

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

export function PropriedadesPage() {
  const dispatch = useAppDispatch();
  const { itens: propriedades, carregando, usandoMock } = useAppSelector(
    (state) => state.propriedades,
  );
  const { itens: produtores } = useAppSelector((state) => state.produtores);

  const [criarAberto, setCriarAberto] = useState(false);
  const [propriedadeEditando, setPropriedadeEditando] = useState<Propriedade | null>(null);
  const [propriedadeRemovendo, setPropriedadeRemovendo] = useState<Propriedade | null>(null);
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    dispatch(buscarPropriedades());
    // Precisamos da lista de produtores tanto pro <select> do formulário
    // de criação quanto pra resolver "produtorId -> nome" na tabela.
    dispatch(buscarProdutores());
  }, [dispatch]);

  function nomeDoProdutor(produtorId: string): string {
    return produtores.find((p) => p.id === produtorId)?.nome ?? 'Produtor não encontrado';
  }

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {usandoMock && (
        <p style={{ fontSize: 13, color: '#E8B34C' }}>
          Não foi possível conectar à API — exibindo dados de exemplo.
        </p>
      )}

      <Toolbar>
        <Button onClick={() => setCriarAberto(true)} disabled={produtores.length === 0}>
          Nova propriedade
        </Button>
      </Toolbar>

      {produtores.length === 0 && !carregando && (
        <p style={{ fontSize: 13, color: '#9A9A93' }}>
          Cadastre um produtor antes de criar uma propriedade.
        </p>
      )}

      <Card>
        <CardTitle>Propriedades cadastradas</CardTitle>
        {carregando ? (
          <p>Carregando...</p>
        ) : (
          <PropriedadeList
            propriedades={propriedades}
            nomeDoProdutor={nomeDoProdutor}
            onEditar={setPropriedadeEditando}
            onRemover={setPropriedadeRemovendo}
          />
        )}
      </Card>

      <Modal
        open={criarAberto}
        onClose={() => setCriarAberto(false)}
        title="Cadastrar propriedade"
      >
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
              Tem certeza que deseja remover <strong>{propriedadeRemovendo.nome}</strong>?
              Essa ação também remove todas as safras vinculadas a ela, e não pode ser
              desfeita.
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

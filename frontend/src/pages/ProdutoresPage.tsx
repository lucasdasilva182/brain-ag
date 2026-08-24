import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  buscarProdutores,
  criarProdutor,
  editarProdutor,
  removerProdutor,
} from '../store/slices/produtoresSlice';
import { ProdutorForm } from '../components/organisms/produtores/ProdutorForm';
import { ProdutorList } from '../components/organisms/produtores/ProdutorList';
import { Card, CardTitle } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Modal } from '../components/molecules/Modal';
import type { Produtor } from '../types/domain';

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

export function ProdutoresPage() {
  const dispatch = useAppDispatch();
  const { itens, carregando, usandoMock } = useAppSelector((state) => state.produtores);

  const [criarAberto, setCriarAberto] = useState(false);
  const [produtorEditando, setProdutorEditando] = useState<Produtor | null>(null);
  const [produtorRemovendo, setProdutorRemovendo] = useState<Produtor | null>(null);
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    dispatch(buscarProdutores());
  }, [dispatch]);

  async function handleCriar(dados: { documento: string; nome: string }) {
    await dispatch(criarProdutor(dados)).unwrap();
    setCriarAberto(false);
  }

  async function handleEditar(dados: { documento: string; nome: string }) {
    if (!produtorEditando) return;
    await dispatch(editarProdutor({ id: produtorEditando.id, dados })).unwrap();
    setProdutorEditando(null);
  }

  async function handleConfirmarRemocao() {
    if (!produtorRemovendo) return;
    setRemovendo(true);
    try {
      await dispatch(removerProdutor(produtorRemovendo.id)).unwrap();
      setProdutorRemovendo(null);
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
        <Button onClick={() => setCriarAberto(true)}>Novo produtor</Button>
      </Toolbar>

      <Card>
        <CardTitle>Produtores cadastrados</CardTitle>
        {carregando ? (
          <p>Carregando...</p>
        ) : (
          <ProdutorList
            produtores={itens}
            onEditar={setProdutorEditando}
            onRemover={setProdutorRemovendo}
          />
        )}
      </Card>

      <Modal open={criarAberto} onClose={() => setCriarAberto(false)} title="Cadastrar produtor">
        <ProdutorForm onSubmit={handleCriar} />
      </Modal>

      <Modal
        open={!!produtorEditando}
        onClose={() => setProdutorEditando(null)}
        title="Editar produtor"
      >
        {produtorEditando && (
          <ProdutorForm
            initialValues={{
              documento: produtorEditando.documento,
              nome: produtorEditando.nome,
            }}
            onSubmit={handleEditar}
            submitLabel="Salvar alterações"
          />
        )}
      </Modal>

      <Modal
        open={!!produtorRemovendo}
        onClose={() => setProdutorRemovendo(null)}
        title="Remover produtor"
      >
        {produtorRemovendo && (
          <>
            <ConfirmText>
              Tem certeza que deseja remover <strong>{produtorRemovendo.nome}</strong>? Essa ação
              também remove todas as propriedades vinculadas a ele, e não pode ser desfeita.
            </ConfirmText>
            <ConfirmActions>
              <Button $variant="secondary" onClick={() => setProdutorRemovendo(null)}>
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

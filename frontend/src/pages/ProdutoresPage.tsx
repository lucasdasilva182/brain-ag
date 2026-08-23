import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { buscarProdutores, criarProdutor, removerProdutor } from '../store/slices/produtoresSlice';
import { ProdutorForm } from '../components/organisms/ProdutorForm';
import { ProdutorList } from '../components/organisms/ProdutorList';
import { Card, CardTitle } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Modal } from '../components/molecules/Modal';

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export function ProdutoresPage() {
  const dispatch = useAppDispatch();
  const { itens, carregando, usandoMock } = useAppSelector((state) => state.produtores);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    dispatch(buscarProdutores());
  }, [dispatch]);

  function handleCriar(dados: { documento: string; nome: string }) {
    dispatch(criarProdutor(dados));
    setModalAberto(false);
  }

  function handleRemover(id: string) {
    dispatch(removerProdutor(id));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {usandoMock && (
        <p style={{ fontSize: 13, color: '#E8B34C' }}>
          Não foi possível conectar à API — exibindo dados de exemplo.
        </p>
      )}

      <Toolbar>
        <Button onClick={() => setModalAberto(true)}>Novo produtor</Button>
      </Toolbar>

      <Card>
        <CardTitle>Produtores cadastrados</CardTitle>
        {carregando ? (
          <p>Carregando...</p>
        ) : (
          <ProdutorList produtores={itens} onRemover={handleRemover} />
        )}
      </Card>

      <Modal open={modalAberto} onClose={() => setModalAberto(false)} title="Cadastrar produtor">
        <ProdutorForm onSubmit={handleCriar} />
      </Modal>
    </div>
  );
}

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  buscarProdutores,
  criarProdutor,
  removerProdutor,
} from '../store/slices/produtoresSlice';
import { ProdutorForm } from '../components/organisms/ProdutorForm';
import { ProdutorList } from '../components/organisms/ProdutorList';
import { Card, CardTitle } from '../components/atoms/Card';

export function ProdutoresPage() {
  const dispatch = useAppDispatch();
  const { itens, carregando, usandoMock } = useAppSelector((state) => state.produtores);

  useEffect(() => {
    dispatch(buscarProdutores());
  }, [dispatch]);

  function handleCriar(dados: { documento: string; nome: string }) {
    dispatch(criarProdutor(dados));
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

      <Card>
        <CardTitle>Cadastrar produtor</CardTitle>
        <ProdutorForm onSubmit={handleCriar} />
      </Card>

      <Card>
        <CardTitle>Produtores cadastrados</CardTitle>
        {carregando ? <p>Carregando...</p> : (
          <ProdutorList produtores={itens} onRemover={handleRemover} />
        )}
      </Card>
    </div>
  );
}

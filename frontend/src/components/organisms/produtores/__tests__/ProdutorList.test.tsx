import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { ProdutorList } from '../ProdutorList';
import { produtoresMock } from '../../../../mocks/produtores.mock';

describe('ProdutorList', () => {
  it('exibe uma mensagem quando não há produtores', () => {
    renderWithTheme(<ProdutorList produtores={[]} onEditar={jest.fn()} onRemover={jest.fn()} />);
    expect(screen.getByText('Nenhum produtor cadastrado ainda.')).toBeInTheDocument();
  });

  it('lista os produtores com nome e documento formatado', () => {
    renderWithTheme(
      <ProdutorList produtores={produtoresMock} onEditar={jest.fn()} onRemover={jest.fn()} />,
    );

    expect(screen.getByText('João da Silva')).toBeInTheDocument();
    expect(screen.getByText('111.444.777-35')).toBeInTheDocument();
  });

  it('chama onEditar com o produtor correto ao clicar em Editar', () => {
    const onEditar = jest.fn();
    renderWithTheme(
      <ProdutorList produtores={produtoresMock} onEditar={onEditar} onRemover={jest.fn()} />,
    );

    const botoesEditar = screen.getAllByRole('button', { name: /editar/i });
    fireEvent.click(botoesEditar[0]);

    expect(onEditar).toHaveBeenCalledWith(produtoresMock[0]);
  });

  it('chama onRemover com o produtor correto ao clicar em Remover', () => {
    const onRemover = jest.fn();
    renderWithTheme(
      <ProdutorList produtores={produtoresMock} onEditar={jest.fn()} onRemover={onRemover} />,
    );

    const botoesRemover = screen.getAllByRole('button', { name: /remover/i });
    fireEvent.click(botoesRemover[0]);

    expect(onRemover).toHaveBeenCalledWith(produtoresMock[0]);
  });
});

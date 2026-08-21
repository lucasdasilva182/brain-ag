import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../test-utils/renderWithTheme';
import { ProdutorList } from '../ProdutorList';
import { produtoresMock } from '../../../mocks/produtores.mock';

describe('ProdutorList', () => {
  it('exibe uma mensagem quando não há produtores', () => {
    renderWithTheme(<ProdutorList produtores={[]} onRemover={jest.fn()} />);
    expect(screen.getByText('Nenhum produtor cadastrado ainda.')).toBeInTheDocument();
  });

  it('lista os produtores com nome e documento formatado', () => {
    renderWithTheme(<ProdutorList produtores={produtoresMock} onRemover={jest.fn()} />);

    expect(screen.getByText('João da Silva')).toBeInTheDocument();
    expect(screen.getByText('111.444.777-35')).toBeInTheDocument();
  });

  it('chama onRemover com o id correto ao clicar em Remover', () => {
    const onRemover = jest.fn();
    renderWithTheme(<ProdutorList produtores={produtoresMock} onRemover={onRemover} />);

    const botoesRemover = screen.getAllByRole('button', { name: /remover/i });
    fireEvent.click(botoesRemover[0]);

    expect(onRemover).toHaveBeenCalledWith(produtoresMock[0].id);
  });
});

import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { PropriedadeList } from '../PropriedadeList';
import { propriedadesMock } from '../../../../mocks/propriedades.mock';

const nomeDoProdutor = () => 'João da Silva';

describe('PropriedadeList', () => {
  it('exibe uma mensagem quando não há propriedades', () => {
    renderWithTheme(
      <PropriedadeList
        propriedades={[]}
        nomeDoProdutor={nomeDoProdutor}
        onEditar={jest.fn()}
        onRemover={jest.fn()}
        onNovaSafra={jest.fn()}
      />,
    );
    expect(screen.getByText('Nenhuma propriedade cadastrada ainda.')).toBeInTheDocument();
  });

  it('lista as propriedades com nome e cidade/UF', () => {
    renderWithTheme(
      <PropriedadeList
        propriedades={propriedadesMock}
        nomeDoProdutor={nomeDoProdutor}
        onEditar={jest.fn()}
        onRemover={jest.fn()}
        onNovaSafra={jest.fn()}
      />,
    );

    expect(screen.getByText('Fazenda Boa Vista')).toBeInTheDocument();
    expect(screen.getByText('Uberlândia/MG')).toBeInTheDocument();
  });

  it('chama onEditar com a propriedade correta ao clicar em Editar', () => {
    const onEditar = jest.fn();
    renderWithTheme(
      <PropriedadeList
        propriedades={propriedadesMock}
        nomeDoProdutor={nomeDoProdutor}
        onEditar={onEditar}
        onRemover={jest.fn()}
        onNovaSafra={jest.fn()}
      />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: /editar/i })[0]);

    expect(onEditar).toHaveBeenCalledWith(propriedadesMock[0]);
  });

  it('chama onRemover com a propriedade correta ao clicar em Remover', () => {
    const onRemover = jest.fn();
    renderWithTheme(
      <PropriedadeList
        propriedades={propriedadesMock}
        nomeDoProdutor={nomeDoProdutor}
        onEditar={jest.fn()}
        onRemover={onRemover}
        onNovaSafra={jest.fn()}
      />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: /remover/i })[0]);

    expect(onRemover).toHaveBeenCalledWith(propriedadesMock[0]);
  });

  it('chama onNovaSafra com a propriedade correta ao clicar em Nova safra', () => {
    const onNovaSafra = jest.fn();
    renderWithTheme(
      <PropriedadeList
        propriedades={propriedadesMock}
        nomeDoProdutor={nomeDoProdutor}
        onEditar={jest.fn()}
        onRemover={jest.fn()}
        onNovaSafra={onNovaSafra}
      />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: /nova safra/i })[0]);

    expect(onNovaSafra).toHaveBeenCalledWith(propriedadesMock[0]);
  });
});

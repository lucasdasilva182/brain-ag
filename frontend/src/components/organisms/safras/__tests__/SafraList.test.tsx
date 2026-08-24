import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { SafraList } from '../SafraList';
import { safrasMock } from '../../../../mocks/safras.mock';
import { propriedadesMock } from '../../../../mocks/propriedades.mock';

const nomeDaPropriedade = (propriedadeId: string) =>
  propriedadesMock.find((p) => p.id === propriedadeId)?.nome ?? 'Desconhecida';

describe('SafraList', () => {
  it('exibe uma mensagem quando não há safras', () => {
    renderWithTheme(
      <SafraList
        safras={[]}
        nomeDaPropriedade={nomeDaPropriedade}
        onAdicionarCultura={jest.fn()}
        onRemoverCultura={jest.fn()}
        onRemoverSafra={jest.fn()}
      />,
    );
    expect(screen.getByText('Nenhuma safra cadastrada ainda.')).toBeInTheDocument();
  });

  it('lista as safras com ano e culturas plantadas', () => {
    renderWithTheme(
      <SafraList
        safras={safrasMock}
        nomeDaPropriedade={nomeDaPropriedade}
        onAdicionarCultura={jest.fn()}
        onRemoverCultura={jest.fn()}
        onRemoverSafra={jest.fn()}
      />,
    );

    expect(screen.getAllByText('2022').length).toBeGreaterThan(0);
    expect(screen.getByText('Café')).toBeInTheDocument();
    expect(screen.getByText('Algodão')).toBeInTheDocument();
  });

  it('chama onAdicionarCultura ao digitar e apertar Enter no campo da linha', () => {
    const onAdicionarCultura = jest.fn();
    renderWithTheme(
      <SafraList
        safras={safrasMock}
        nomeDaPropriedade={nomeDaPropriedade}
        onAdicionarCultura={onAdicionarCultura}
        onRemoverCultura={jest.fn()}
        onRemoverSafra={jest.fn()}
      />,
    );

    const input = screen.getByLabelText(
      `Adicionar cultura à safra ${safrasMock[0].ano} de Fazenda Boa Vista`,
    );
    fireEvent.change(input, { target: { value: 'Café' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onAdicionarCultura).toHaveBeenCalledWith(safrasMock[0].id, 'Café');
  });

  it('chama onRemoverCultura ao clicar no × de uma tag', () => {
    const onRemoverCultura = jest.fn();
    renderWithTheme(
      <SafraList
        safras={safrasMock}
        nomeDaPropriedade={nomeDaPropriedade}
        onAdicionarCultura={jest.fn()}
        onRemoverCultura={onRemoverCultura}
        onRemoverSafra={jest.fn()}
      />,
    );

    const primeiraCultura = safrasMock[0].culturas[0];
    const botoesRemoverCultura = screen.getAllByLabelText(`Remover ${primeiraCultura.nome}`);
    fireEvent.click(botoesRemoverCultura[0]);

    expect(onRemoverCultura).toHaveBeenCalledWith(safrasMock[0].id, primeiraCultura.id);
  });

  it('chama onRemoverSafra com a safra correta ao clicar em Remover', () => {
    const onRemoverSafra = jest.fn();
    renderWithTheme(
      <SafraList
        safras={safrasMock}
        nomeDaPropriedade={nomeDaPropriedade}
        onAdicionarCultura={jest.fn()}
        onRemoverCultura={jest.fn()}
        onRemoverSafra={onRemoverSafra}
      />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: /remover$/i })[0]);

    expect(onRemoverSafra).toHaveBeenCalledWith(safrasMock[0]);
  });
});

import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { SafraForm } from '../SafraForm';

const propriedadeOptions = [{ id: 'prop1', nome: 'Fazenda Boa Vista' }];

describe('SafraForm', () => {
  it('chama onSubmit com propriedade, ano e culturas adicionadas', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    renderWithTheme(
      <SafraForm propriedadeOptions={propriedadeOptions} onSubmit={onSubmit} />,
    );

    await user.selectOptions(screen.getByLabelText('Propriedade'), 'prop1');

    const inputAno = screen.getByLabelText('Ano da safra');
    await user.clear(inputAno);
    await user.type(inputAno, '2022');

    await user.type(screen.getByLabelText('Culturas plantadas (opcional)'), 'Soja');
    await user.click(screen.getByRole('button', { name: /^adicionar$/i }));

    expect(screen.getByText('Soja')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cadastrar safra/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      propriedadeId: 'prop1',
      ano: 2022,
      culturas: ['Soja'],
    });
  });

  it('remove uma cultura da lista antes de enviar', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <SafraForm propriedadeOptions={propriedadeOptions} onSubmit={jest.fn()} />,
    );

    await user.type(screen.getByLabelText('Culturas plantadas (opcional)'), 'Milho');
    await user.click(screen.getByRole('button', { name: /^adicionar$/i }));
    expect(screen.getByText('Milho')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remover milho/i }));
    expect(screen.queryByText('Milho')).not.toBeInTheDocument();
  });

  it('mostra um erro e não chama onSubmit se a propriedade não for selecionada', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    renderWithTheme(
      <SafraForm propriedadeOptions={propriedadeOptions} onSubmit={onSubmit} />,
    );

    await user.click(screen.getByRole('button', { name: /cadastrar safra/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText('Selecione a propriedade e informe o ano da safra'),
    ).toBeInTheDocument();
  });
});

import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../../test-utils/renderWithTheme';
import { ProdutorForm } from '../ProdutorForm';

describe('ProdutorForm', () => {
  it('chama onSubmit com os dados preenchidos', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    renderWithTheme(<ProdutorForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('CPF ou CNPJ'), '111.444.777-35');
    await user.type(screen.getByLabelText('Nome do produtor'), 'João da Silva');
    await user.click(screen.getByRole('button', { name: /cadastrar produtor/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      documento: '111.444.777-35',
      nome: 'João da Silva',
    });
  });

  it('mostra um erro e não chama onSubmit se os campos estiverem vazios', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    renderWithTheme(<ProdutorForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /cadastrar produtor/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText('Preencha o documento e o nome do produtor'),
    ).toBeInTheDocument();
  });
});

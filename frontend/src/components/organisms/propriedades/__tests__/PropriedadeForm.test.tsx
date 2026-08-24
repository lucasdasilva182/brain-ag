import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { PropriedadeForm } from '../PropriedadeForm';

const produtorOptions = [{ id: 'p1', nome: 'João da Silva' }];

describe('PropriedadeForm', () => {
  it('chama onSubmit com os dados preenchidos, incluindo o produtor selecionado', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    renderWithTheme(<PropriedadeForm produtorOptions={produtorOptions} onSubmit={onSubmit} />);

    await user.selectOptions(screen.getByLabelText('Produtor'), 'p1');
    await user.type(screen.getByLabelText('Nome da fazenda'), 'Fazenda Teste');
    await user.type(screen.getByLabelText('Cidade'), 'Uberlândia');
    await user.type(screen.getByLabelText('Estado (UF)'), 'MG');
    await user.type(screen.getByLabelText('Área total (ha)'), '100');
    await user.type(screen.getByLabelText('Agricultável (ha)'), '60');
    await user.type(screen.getByLabelText('Vegetação (ha)'), '40');
    await user.click(screen.getByRole('button', { name: /cadastrar propriedade/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      produtorId: 'p1',
      nome: 'Fazenda Teste',
      cidade: 'Uberlândia',
      estado: 'MG',
      areaTotal: 100,
      areaAgricultavel: 60,
      areaVegetacao: 40,
    });
  });

  it('mostra um erro e não chama onSubmit se campos obrigatórios estiverem vazios', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    renderWithTheme(<PropriedadeForm produtorOptions={produtorOptions} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /cadastrar propriedade/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Preencha todos os campos obrigatórios')).toBeInTheDocument();
  });

  it('não exibe o seletor de produtor quando produtorFixo é passado (modo edição)', () => {
    renderWithTheme(
      <PropriedadeForm
        produtorOptions={produtorOptions}
        produtorFixo={{ id: 'p1', nome: 'João da Silva' }}
        initialValues={{
          nome: 'Fazenda Teste',
          cidade: 'Uberlândia',
          estado: 'MG',
          areaTotal: 100,
          areaAgricultavel: 60,
          areaVegetacao: 40,
        }}
        onSubmit={jest.fn()}
        submitLabel="Salvar alterações"
      />,
    );

    expect(screen.queryByLabelText('Produtor')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('João da Silva')).toBeDisabled();
  });
});

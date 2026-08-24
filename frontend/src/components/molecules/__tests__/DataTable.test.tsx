import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../test-utils/renderWithTheme';
import { DataTable } from '../DataTable';
import type { DataTableColumn } from '../DataTable';

interface Item {
  id: string;
  nome: string;
}

const colunas: DataTableColumn<Item>[] = [{ key: 'nome', label: 'Nome', render: (i) => i.nome }];

function gerarItens(quantidade: number): Item[] {
  return Array.from({ length: quantidade }, (_, i) => ({ id: String(i), nome: `Item ${i + 1}` }));
}

describe('DataTable', () => {
  it('mostra só os itens da primeira página quando há mais itens que o limite', () => {
    renderWithTheme(
      <DataTable
        columns={colunas}
        data={gerarItens(12)}
        getRowKey={(i) => i.id}
        itemsPerPage={5}
      />,
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 5')).toBeInTheDocument();
    expect(screen.queryByText('Item 6')).not.toBeInTheDocument();
    expect(screen.getByText('1-5 de 12')).toBeInTheDocument();
    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();
  });

  it('avança e volta de página corretamente', () => {
    renderWithTheme(
      <DataTable
        columns={colunas}
        data={gerarItens(12)}
        getRowKey={(i) => i.id}
        itemsPerPage={5}
      />,
    );

    fireEvent.click(screen.getByLabelText('Próxima página'));
    expect(screen.getByText('Item 6')).toBeInTheDocument();
    expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Próxima página'));
    expect(screen.getByText('Item 11')).toBeInTheDocument();
    expect(screen.getByText('Item 12')).toBeInTheDocument();
    expect(screen.getByLabelText('Próxima página')).toBeDisabled();

    fireEvent.click(screen.getByLabelText('Página anterior'));
    expect(screen.getByText('Item 6')).toBeInTheDocument();
  });

  it('desabilita "página anterior" na primeira página', () => {
    renderWithTheme(
      <DataTable
        columns={colunas}
        data={gerarItens(12)}
        getRowKey={(i) => i.id}
        itemsPerPage={5}
      />,
    );

    expect(screen.getByLabelText('Página anterior')).toBeDisabled();
  });
});

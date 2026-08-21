import type { Produtor } from '../types/domain';

// Dados mockados usados como fallback/exemplo enquanto a API real não
// está disponível, e também como fixture nos testes.
export const produtoresMock: Produtor[] = [
  {
    id: 'p1',
    documento: '11144477735',
    nome: 'João da Silva',
    propriedades: [
      {
        id: 'prop1',
        nome: 'Fazenda Boa Vista',
        cidade: 'Uberlândia',
        estado: 'MG',
        areaTotal: 150,
        areaAgricultavel: 90,
        areaVegetacao: 40,
        produtorId: 'p1',
        safras: [
          {
            id: 's1',
            ano: 2022,
            propriedadeId: 'prop1',
            culturas: [
              { id: 'c1', nome: 'Soja', safraId: 's1' },
              { id: 'c2', nome: 'Milho', safraId: 's1' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'p2',
    documento: '11222333000181',
    nome: 'Agropecuária Santa Fé Ltda',
    propriedades: [
      {
        id: 'prop2',
        nome: 'Fazenda Santa Fé',
        cidade: 'Ribeirão Preto',
        estado: 'SP',
        areaTotal: 300,
        areaAgricultavel: 220,
        areaVegetacao: 60,
        produtorId: 'p2',
        safras: [
          {
            id: 's2',
            ano: 2022,
            propriedadeId: 'prop2',
            culturas: [{ id: 'c3', nome: 'Café', safraId: 's2' }],
          },
        ],
      },
      {
        id: 'prop3',
        nome: 'Sítio Esperança',
        cidade: 'Franca',
        estado: 'SP',
        areaTotal: 80,
        areaAgricultavel: 50,
        areaVegetacao: 20,
        produtorId: 'p2',
        safras: [],
      },
    ],
  },
  {
    id: 'p3',
    documento: '52998224725',
    nome: 'Maria Oliveira',
    propriedades: [
      {
        id: 'prop4',
        nome: 'Fazenda Três Irmãos',
        cidade: 'Rio Verde',
        estado: 'GO',
        areaTotal: 500,
        areaAgricultavel: 400,
        areaVegetacao: 90,
        produtorId: 'p3',
        safras: [
          {
            id: 's3',
            ano: 2021,
            propriedadeId: 'prop4',
            culturas: [
              { id: 'c4', nome: 'Soja', safraId: 's3' },
              { id: 'c5', nome: 'Algodão', safraId: 's3' },
            ],
          },
          {
            id: 's4',
            ano: 2022,
            propriedadeId: 'prop4',
            culturas: [{ id: 'c6', nome: 'Milho', safraId: 's4' }],
          },
        ],
      },
    ],
  },
];

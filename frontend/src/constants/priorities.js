export const PRIORITIES = {
  alta: {
    value: 'alta',
    label: 'Alta',
    beerLabel: 'Garrafa Vermelha',
    emoji: '🧨',
    color: '#ff2e4d',
    order: 0,
  },
  media: {
    value: 'media',
    label: 'Média',
    beerLabel: 'Pint Laranja',
    emoji: '🍺',
    color: '#ff9f1c',
    order: 1,
  },
  baixa: {
    value: 'baixa',
    label: 'Baixa',
    beerLabel: 'Caneca Verde',
    emoji: '🍏',
    color: '#3dff88',
    order: 2,
  },
};

export const PRIORITY_LIST = Object.values(PRIORITIES).sort((a, b) => a.order - b.order);

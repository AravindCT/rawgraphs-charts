export const dimensions = [
  {
    id: 'geography',
    name: 'Geographical Areas',
    validTypes: ['string'],
    required: true,
    aggregation: false,
  },
  {
    id: 'value',
    name: 'Values',
    validTypes: ['number'],
    required: true,
    aggregation: true,
  },
];
export const visualOptions = {
  colorScale: {
    type: 'colorScale',
    label: 'Color Scale',
    dimension: 'value',
    default: {
      scaleType: 'quantize',
      interpolator: 'interpolateBlues',
    },
    group: 'color',
  },
  strokeWidth: {
    type: 'number',
    label: 'Border Width',
    default: 1,
    group: 'style',
  },
};
export const visualOptions = {
  marginTop: {
    type: 'number',
    label: 'Margin (top)',
    default: 20,
    group: 'margins',
  },

  marginRight: {
    type: 'number',
    label: 'Margin (right)',
    default: 10,
    group: 'margins',
  },

  marginBottom: {
    type: 'number',
    label: 'Margin (bottom)',
    default: 20,
    group: 'margins',
  },

  marginLeft: {
    type: 'number',
    label: 'Margin (left)',
    default: 10,
    group: 'margins',
  },

  showLegend: {
    type: 'boolean',
    label: 'Show legend',
    default: false,
    group: 'artboard',
  },

  legendWidth: {
    type: 'number',
    label: 'Legend width',
    default: 200,
    group: 'artboard',
    disabled: {
      showLegend: false,
    },
    container: 'width',
    containerCondition: {
      showLegend: true,
    },
  },

  streamsOrder: {
    type: 'text',
    label: 'Sort streams by',
    group: 'chart',
    options: [
      { label: 'Earliest', value: 'stackOrderAppearance' },
      { label: 'Ascending', value: 'stackOrderAscending' },
      { label: 'Descending', value: 'stackOrderDescending' },
      { label: 'Inside out', value: 'stackOrderInsideOut' },
      { label: 'None', value: 'stackOrderNone' },
      { label: 'Reverse', value: 'stackOrderReverse' },
    ],
    default: 'stackOrderNone',
  },

  interpolation: {
    type: 'text',
    label: 'Interpolation',
    default: 'curveMonotoneX',
    options: [
      { label: 'Basis', value: 'curveBasis' },
      { label: 'Cardinal', value: 'curveCardinal' },
      { label: 'Catmull–Rom', value: 'curveCatmullRom' },
      { label: 'Linear', value: 'curveLinear' },
      { label: 'Monotone X', value: 'curveMonotoneX' },
      { label: 'Natural', value: 'curveNatural' },
      { label: 'Step', value: 'curveStep' },
      { label: 'Step After', value: 'curveStepAfter' },
      { label: 'Step Before', value: 'curveStepBefore' },
    ],
    group: 'chart',
  },

  streamsOffset: {
    type: 'text',
    label: 'Sort streams by',
    group: 'chart',
    options: [
      { label: 'Expand', value: 'stackOffsetExpand' },
      // { label: 'Diverging', value: 'stackOffsetDiverging' },
      { label: 'Silhouette', value: 'stackOffsetSilhouette' },
      { label: 'Wiggle', value: 'stackOffsetWiggle' },
      { label: 'None', value: 'stackOffsetNone' },
    ],
    default: 'stackOffsetNone',
  },

  useSameScale: {
    type: 'boolean',
    label: 'Use same y scale',
    default: true,
    group: 'series',
  },

  showYAxis: {
    type: 'boolean',
    label: 'Show Y axis',
    default: false,
    group: 'series',
  },

  columnsNumber: {
    type: 'number',
    label: 'Number of columns',
    default: 0,
    group: 'series',
  },

  sortSeriesBy: {
    type: 'text',
    label: 'Sort series by',
    group: 'series',
    options: [
      'Total value (descending)',
      'Total value (ascending)',
      'Name',
      'Original',
    ],
    default: 'Total value (descending)',
  },

  showSeriesLabels: {
    type: 'boolean',
    label: 'Show series titles',
    default: true,
    group: 'series',
  },

  showGrid: {
    type: 'boolean',
    label: 'Show series grid',
    default: false,
    group: 'series',
  },

  colorScale: {
    type: 'colorScale',
    label: 'Color scale',
    dimension: 'streams',
    default: {
      scaleType: 'ordinal',
      interpolator: 'interpolateSpectral',
    },
    group: 'colors',
  },
}

import choroplethmap from 'rawcharts/choroplethmap';
import { bbox, feature, mesh, transform } from 'topojson-client'; // Ensure topojson-client is installed
import rawData from '../datasets/counties-albers-10m.json';

// Extract county geometries
const data = rawData.objects.counties
  ? feature(rawData, rawData.objects.counties).features
  : [];

  console.log("Processed GeoJSON Data:", data);  // ✅ Debugging log


export default {
  chart: choroplethmap,
  data,
  dataTypes: {
    id: 'string',
    value: 'number',
  },
  mapping: {
    geography: { value: ['id'] },
    value: { value: ['value'] },
  },
  visualOptions: {
    width: 1200,
    height: 800,
    colorScale: {
      scaleType: 'ordinal',
      colorSchemes: 'Blues',
    },
    strokeWidth: 1,
  },
};
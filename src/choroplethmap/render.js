import * as d3 from 'd3';
import * as d3Chromatic from 'd3-scale-chromatic';
import { legend } from '@rawgraphs/rawgraphs-core';
import '../d3-styles.js';

export function render(node, data, visualOptions, mapping, originalData, styles) {
  const { width, height, colorScale, strokeWidth } = visualOptions;

  const svg = d3.select(node)
    .attr('width', width)
    .attr('height', height);

  // Load and display the World
  d3.json('https://raw.githubusercontent.com/datasets/geo-countries/e3be34796915fe99462dcb645365ab186a50a9b7/data/countries.geojson').then(function(geoData) {
    const projection = d3.geoMercator()
      .fitSize([width, height], geoData);

    const path = d3.geoPath().projection(projection);

    

    const color = d3.scaleSequential()
      .domain(d3.extent(data, d => d.value))
      .interpolator(d3Chromatic[colorScale.interpolator]);

    svg.selectAll('path')
      .data(geoData.features)
      .enter().append('path')
      .attr('d', path)
      .attr('stroke', '#000')
      .attr('stroke-width', strokeWidth)
      .attr('fill', d => {
        const datum = data.find(item => item.geography === d.properties.name);
        return datum ? color(datum.value) : '#ccc';
      });

    // Add legend
    const legendLayer = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${10},${10})`);

    const chartLegend = legend().legendWidth(200);
    chartLegend.addColor(mapping.value.value, color);
    legendLayer.call(chartLegend);
  });
}
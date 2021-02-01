import * as d3 from 'd3'
import { legend, dateFormats } from '@raw-temp/rawgraphs-core'
import '../d3-styles.js' 

export function render(svgNode, data, visualOptions, mapping, originalData, styles) {

  const {
    axisLabel,
    labelPrimary,
    labelSecondary,
    labelItalic,
    labelOutline,
  } = styles

  const {
    width,
    height,
    background,
    xOrigin,
    yOrigin,
    maxRadius,
    showStroke,
    showPoints,
    pointsRadius,
    showLegend,
    legendWidth,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    colorScale,
    showLabelsOutline,
  } = visualOptions

  const margin = {
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: marginLeft,
  }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  // x scale
  const xDomain = xOrigin
    ? [0, d3.max(data, (d) => d.x)]
    : d3.extent(data, (d) => d.x)

  const x =
    mapping.x.dataType.type === 'date' ? d3.scaleTime() : d3.scaleLinear()

  x.domain(xDomain).rangeRound([0, chartWidth])

  // y scale
  const yDomain = yOrigin
    ? [0, d3.max(data, (d) => d.y)]
    : d3.extent(data, (d) => d.y)

  const y =
    mapping.y.dataType.type === 'date' ? d3.scaleTime() : d3.scaleLinear()

  y.domain(yDomain).rangeRound([chartHeight, 0])

  // size scale
  const size = d3
    .scaleSqrt()
    .domain([0, d3.max(data, (d) => d.size)])
    .rangeRound([0, maxRadius])

  const xAxis = (g) => {
    return g
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .call(
        (g) =>
          g
            .append('text')
            .attr('x', chartWidth)
            .attr('dy', -5)
            .attr('text-anchor', 'end')
            .text(mapping['x'].value)
            .styles(axisLabel)
        //.call(multiStyles(axisLabel))
      )
  }

  const yAxis = (g) => {
    return g
      .call(d3.axisLeft(y))
      .call((g) =>
        g
          .append('text')
          .attr('x', 4)
          .attr('text-anchor', 'start')
          .attr('dominant-baseline', 'hanging')
          .text(mapping['y'].value)
          .styles(axisLabel)
      )
  }

  const artboardBackground = d3
    .select(svgNode)
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', background)
    .attr('id', 'background')

  const svg = d3
    .select(svgNode)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('id', 'visualization')

  const axisLayer = svg.append('g').attr('id', 'axis')

  axisLayer.append('g').call(xAxis)
  axisLayer.append('g').call(yAxis)

  const vizLayer = svg.append('g').attr('id', 'viz')

  if (mapping.connectedBy.value) {
    const line = d3
      .line()
      .x(function (d) {
        return x(d.x)
      })
      .y(function (d) {
        return y(d.y)
      })

    vizLayer
      .append('path')
      .attr('d', () =>
        line(
          data.sort((a, b) => {
            return d3.ascending(a.connectedBy, b.connectedBy)
          })
        )
      )
      .attr('stroke', 'grey')
      .attr('stroke-width', 0.5)
      .attr('fill', 'none')
  }

  const bubbles = vizLayer
    .selectAll('g')
    .data(
      data.sort((a, b) => {
        const sortValueA = mapping.size.value ? size(a.size) : maxRadius
        const sortValueB = mapping.size.value ? size(b.size) : maxRadius
        return sortValueB - sortValueA
      })
    )
    .join('g')

  bubbles
    .append('circle')
    .attr('cx', (d) => x(d.x))
    .attr('cy', (d) => y(d.y))
    .attr('fill', (d) => {
      return mapping.color.value ? colorScale(d.color) : 'grey'
    })
    .attr('r', (d) => {
      return mapping.size.value ? size(d.size) : maxRadius
    })
    .attr('stroke', showStroke ? 'white' : 'none')

  if (showPoints) {
    bubbles
      .append('circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('fill', 'black')
      .attr('r', pointsRadius)
  }

  const labelsLayer = svg.append('g').attr('id', 'labels')

  labelsLayer
    .selectAll('g')
    .data(mapping.label.value ? data : [])
    .join('g')
    .attr('transform', (d) => `translate(${x(d.x)},${y(d.y)})`)
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .selectAll('tspan')
    .data((d) => (Array.isArray(d.label) ? d.label : [d.label]))
    .join('tspan')
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', (d, i) => i * 12)
    .text((d, i) => {
      if (d && mapping.label.dataType[i].type === 'date') {
        return d3.timeFormat(dateFormats[mapping.label.dataType[i].dateFormat])(
          d
        )
      } else {
        return d
      }
    })
    .styles(function (d, i) {
      if (i === 0) {
        return labelPrimary
      } else if (i === 1) {
        return labelSecondary
      } else if (i === 2) {
        return labelItalic
      } else {
        return labelPrimary
      }
    })

  if (showLabelsOutline) {
    // NOTE: Adobe Illustrator does not support paint-order attr
    labelsLayer.selectAll('text').styles(labelOutline)
  }

  if (showLegend) {
    const legendLayer = d3
      .select(svgNode)
      .append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${width},${marginTop})`)

    const legend = legend().legendWidth(legendWidth)

    if (mapping.color.value) {
      legend.addColor(mapping.color.value, colorScale)
    }

    if (mapping.size.value) {
      const legendSizeScale = size.copy()
      legendSizeScale
        .domain(d3.extent(data, (d) => d.size))
        .rangeRound([size(d3.min(data, (d) => d.size)), maxRadius])

      legend.addSize(mapping.size.value, legendSizeScale, 'circle')
    }

    legendLayer.call(legend)
  }
}

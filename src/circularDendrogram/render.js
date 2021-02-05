import * as d3 from 'd3'
import { legend } from '@raw-temp/rawgraphs-core'
import '../d3-styles.js'

export function render(
  svgNode,
  data,
  visualOptions,
  mapping,
  originalData,
  styles
) {
  console.log('- render')

  const {
    width,
    height,
    background,
    // margins
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    // legend
    showLegend,
    legendWidth,
    // colors
    colorScale,
    maxRadius,
    layout,
    sizeOnlyLeaves,
    label1Style,
    label2Style,
    label3Style,
    sortBy,
    // labels
    showHierarchyLabels,
    hierarchyStyle,
    labelStyles,
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

  const radius = d3.min([chartWidth, chartHeight]) / 2

  const circumference = radius * 2 * Math.PI

  // create the hierarchical structure
  const nest = d3.rollup(
    data,
    (v) => v[0],
    ...mapping.hierarchy.value.map((level) => (d) => d.hierarchy.get(level))
  )

  const hierarchy = d3
    .hierarchy(nest)
    // since maps have also a .size porperty, sum only values for leaves, and not for Maps
    .sum((d) => (d[1] instanceof Map ? 0 : d[1].size))
    // sort nodes according to options
    .sort((a, b) => {
      switch (sortBy) {
        case 'Size (descending)':
          return d3.descending(a.value, b.value)
        case 'Size (ascending)':
          return d3.ascending(a.value, b.value)
        case 'Name':
          return d3.ascending(a.data[0], b.data[0])
        default:
          return 0
      }
    })

  // filter nodes with empty values in the hierarchy
  // @TODO check if this works also with empty values in non-leaf nodes
  hierarchy
    .descendants()
    .filter((d) => d.data[0] === '') // select nodes with empty key
    .forEach((d) => {
      const index = d.parent.children.indexOf(d) // get its index in parent's children array
      d.parent.children.splice(index, 1) // remove it

      if (d.parent.children.length == 0) {
        // if it was the only children
        d.parent.data[1] = d.data[1] // move its values to parent
        delete d.parent.children // and remove the empty children array
      }
    })

  // size scale
  const sizeScale = d3
    .scaleSqrt()
    .domain([0, d3.max(hierarchy.leaves(), (d) => d.value)])
    .range([0, maxRadius])

  // get the total size
  const totalValue = d3.sum(hierarchy.leaves(), (d) => sizeScale(d.value) * 2)
  // compute padding
  const padding = (circumference - totalValue) / (hierarchy.leaves().length - 1)

  // dictionary to choose algorythm according to options
  const layouts = {
    'Cluster Dendogram': d3.cluster(),
    Tree: d3.tree(),
  }

  // compute the layout
  const tree = (nest) => {
    return layouts[layout] // compute according to the options
      .size([2 * Math.PI, radius - 100])
      .separation((a, b) => sizeScale(a.value) + sizeScale(b.value) + padding)(
      hierarchy
    )
  }

  const root = tree(data)

  // add background
  d3.select(svgNode)
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', background)
    .attr('id', 'backgorund')

  const svg = d3
    .select(svgNode)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .attr('id', 'viz')

  svg
    .append('g')
    .attr('id', 'links')
    .selectAll('path')
    .data(root.links())
    .join('path')
    .attr(
      'd',
      d3
        .linkRadial()
        .angle((d) => d.x)
        .radius((d) => d.y)
    )
    .attr('fill', 'none')
    .attr('stroke', '#ccc')

  svg
    .append('g')
    .selectAll('circle')
    .data(root.descendants())
    .join('circle')
    .attr(
      'transform',
      (d) => `
	        rotate(${(d.x * 180) / Math.PI - 90})
	        translate(${d.y},0)
	      `
    )
    .attr('fill', function (d) {
      if ('children' in d) {
        // if not leaf, check if leaves has the same value
        const childrenColors = [
          ...new Set(d.leaves().map((l) => l.data[1].color)),
        ]
        return childrenColors.length == 1
          ? colorScale(childrenColors[0])
          : 'gray'
      } else {
        // otherwise, if it's a leaf use its own color
        return colorScale(d.data[1].color)
      }
    })
    .attr('r', (d) => {
      if (sizeOnlyLeaves) {
        return d.children ? 5 : sizeScale(d.value)
      } else {
        return sizeScale(d.value)
      }
    })

  // add labels
  const textGroups = svg
    .append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 3)
    .selectAll('g')
    .data(root.descendants())
    .join('g')
    .filter((d) => (showHierarchyLabels ? true : !d.children)) // if showHierarchyLabels is false, hide non-leaf nodes
    .attr(
      'transform',
      (d) => `
	        rotate(${(d.x * 180) / Math.PI - 90})
	        translate(${d.y},0)
	        rotate(${d.x >= Math.PI ? 180 : 0})
	      `
    )

  textGroups
    .selectAll('text')
    .data((d) => {
      // if the node has children
      // pass just its name in hierarhcy
      if (d.children || d.data[1].label.length == 0) {
        return [
          {
            string: d.data[0],
            x: d.x < Math.PI === !d.children ? 6 : -6,
            align: d.x < Math.PI === !d.children ? 'start' : 'end',
            style: styles[hierarchyStyle],
            hierarchy: true,
          },
        ]
      }
      // else pass the mapped labels
      else {
        const xpos = sizeScale(d.value) + 5
        return d.data[1].label.map((e, i) => ({
          string: e,
          x: d.x < Math.PI === !d.children ? xpos : -xpos,
          align: d.x < Math.PI === !d.children ? 'start' : 'end',
          style: styles[labelStyles[i]],
        }))
      }
    })
    .join('text')
    .attr('x', (d) => d.x)
    .attr('dy', (d, i, n) => {
      if (!d.hierarchy) {
        const sizeArray = n.map((e) =>
          parseFloat(styles[labelStyles[i]].fontSize)
        )
        const offset = d3.sum(sizeArray) / 2 - 2
        const size = d3.sum(sizeArray.slice(0, i))
        return size - offset
      } else {
        return d.style.fontSize / 2
      }
    })
    .attr('text-anchor', (d) => d.align)
    // .styles((d, i) => styles[labelStyles[i]])
    .styles((d) => d.style)
    .text((d) => d.string)

  if (showLegend) {
    // svg width is adjusted automatically because of the "container:height" annotation in legendWidth visual option

    const legendLayer = d3
      .select(svgNode)
      .append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${width},${marginTop})`)

    const chartLegend = legend().legendWidth(legendWidth)

    if (mapping.color.value) {
      chartLegend.addColor(mapping.color.value, colorScale)
    }

    chartLegend.addSize(
      mapping.size.value ? mapping.size.value : 'Number of records',
      sizeScale,
      'circle'
    )

    legendLayer.call(chartLegend)
  }
}

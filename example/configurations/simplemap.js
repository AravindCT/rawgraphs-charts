import * as d3 from 'd3'
import { legend, dateFormats, labelsOcclusion } from '@rawgraphs/rawgraphs-core'
import { feature } from 'topojson-client'
import countries from 'world-atlas/countries-110m.json'
import { geoEqualEarth, geoPath, geoGraticule10 } from 'd3-geo'
import keyBy from 'lodash/keyBy'
import simplemap from "../../src/simplemap"
import data from "../datasets/countriesGDP.csv"

export default {
  chart: simplemap,
  data,
  dataTypes: {
    country: "string",
    Agricolture: "number",
    Industry: "number",
    Services: "number"
  },
  mapping: {
    country: { value: ["country"] }, // using CSV header "Country" to map to the 'country' id
    color: {
      value: ["Agricolture", "Industry", "Services"],
      config: { aggregation: ["sum"] }
    },
    label: { value: ["country"] },
  },

  visualOptions: {
    width: 500,
    height: 500,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    showLegend: true,
    legendWidth: 200,
    xOrigin: true,
    yOrigin: true,
    maxDiameter: 50,
    showStroke: true,
    showPoints: true,
    dotDiameter: 5,
  },


}

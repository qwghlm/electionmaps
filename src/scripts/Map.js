import d3 from "./lib/d3";

import { ukProjection } from "./lib/projections";
import { extractUnits, extractOuterBoundary, extractInnerBoundary } from "./lib/topojson";

export default class Map {

  constructor(el, config) {
    this.config = config;

    this.initSVG(el);
    this.initProjection();
    this.loadBoundaries()
      .then(() => this.loadData())
      .then(() => {
        this.drawBoundaries();
        this.colorize();
      })
    ;
  }

  initSVG(el) {

    const { aspectRatio = 1 } = this.config;

    this.width = (el.offsetWidth === 0) ? el.parentNode.offsetWidth : el.offsetWidth;
    this.height = aspectRatio*this.width;

    this.$svg = d3.select(el).append("svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("class", "map")
      .attr("style", `height: ${this.height} px !important;`);

    this.$map = this.$svg;
  }

  initProjection() {
    const { projection = ukProjection, zoom = 5 } = this.config;
    projection.scale(this.height * zoom)
      .translate([this.width / 2, this.height / 2]);
    this.path = d3.geoPath().projection(projection);
  }

  loadBoundaries() {
    const { boundaryFile } = this.config;
    if (!boundaryFile) {
      return new Promise((resolve, reject) => resolve());
    }
    return d3.json(boundaryFile).then(data => {
      this.boundaryData = data;
    });
  }

  loadData() {
    const { dataFile } = this.config;
    if (!dataFile) {
      return new Promise((resolve, reject) => resolve());
    }
    return d3.json(dataFile).then(data => {
      this.unitData = data;
    });
  }

  drawBoundaries() {

    var units = extractUnits(this.boundaryData);
    this.$map.selectAll(".unit")
      .data(units)
      .enter()
      .append("path")
      .attr("id", d => `unit-${d.properties.id.toLowerCase()}`)
      .attr("class", d => "unit")
      .attr("data-name", d => ("name" in d.properties) ? d.properties.name : null)
      .attr("d", this.path);

    this.$map.append("path")
      .datum(extractOuterBoundary(this.boundaryData))
      .attr("d", this.path)
      .attr("class", "boundary outer-boundary");

    this.$map.append("path")
      .datum(extractInnerBoundary(this.boundaryData))
      .attr("d", this.path)
      .attr("class", "boundary inner-boundary");

    // if (this.config.showTooltip) {
    //     this.setupTooltip();
    // }
    // // Setup zooming
    // if (this.config.zoomExtent) {
    //     this.setupZoom();
    // }
    // this.updateBoundaries();

  }

  colorize() {
    const {
      unitFill = "#FFFFFF",
      outerStroke = "#2A2A2A",
      innerStroke = "#CCCCCC",
    } = this.config;

    this.$map.selectAll(".unit")
      .attr("fill", unitFill);
    this.$map.selectAll(".outer-boundary")
      .attr("stroke", outerStroke);
    this.$map.selectAll(".inner-boundary")
      .attr("stroke", innerStroke);
  }

  clearMap() {
    this.$map.selectAll(".unit").remove();
    this.$map.selectAll(".outer-boundary").remove();
    this.$map.selectAll(".inner-boundary").remove();
  }

}

import d3 from "./lib/d3";

import { ukProjection } from "./lib/projections";
import { extractUnits, extractOuterBoundary, extractInnerBoundary } from "./lib/topojson";

export default class Map {

  constructor(el, config) {
    this.config = config;

    this.initSVG(el);
    this.initProjection();
    this.initTooltip();
    this.loadBoundaries()
      .then(() => this.loadData())
      .then(() => {
        this.drawBoundaries();
        this.colorize();
      });
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, newConfig };
  }

  initSVG(el) {

    const { aspectRatio = 1.6 } = this.config;

    this.width = (el.offsetWidth === 0) ? el.parentNode.offsetWidth : el.offsetWidth;
    this.height = aspectRatio*this.width;

    this.$wrapper = d3.select(el);
    this.$wrapper.classed("map-wrapper", true);

    this.$svg = this.$wrapper.append("svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("class", "map")
      .attr("style", `height: ${this.height}px !important;`);

    this.svg = this.$svg.node();

    this.$map = this.$svg.append("g");

  }

  initProjection() {
    const {
      projection = ukProjection,
      zoom = 5,
      zoomExtent = [1, 20],
    } = this.config;

    const projectionFunction = projection.scale(this.height * zoom)
      .translate([this.width / 2, this.height / 2]);
    this.path = d3.geoPath().projection(projectionFunction);

    const zoomFunction = d3.zoom()
      .scaleExtent(zoomExtent)
      .translateExtent([[0, 0], [this.width, this.height]])
      .on("zoom", this.onZoom);
    this.$map.call(zoomFunction);
  }

  initTooltip() {
    this.$tooltip = this.$wrapper.append("div")
      .attr("class", "hidden tooltip");

    this.$wrapper.on("mousemove", this.onMouseMove);
  }

  loadBoundaries() {
    const { boundaryFile } = this.config;
    if (!boundaryFile) {
      return new Promise((resolve, reject) => resolve());
    }
    return d3.json(boundaryFile).then(data => {
      this.boundaryData = data;
    });
    // TODO: Add error handling
  }

  loadData() {
    const { dataFile } = this.config;
    if (!dataFile) {
      return new Promise((resolve, reject) => resolve());
    }
    return d3.json(dataFile).then(data => {
      this.unitData = data;
    });
    // TODO: Add error handling
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
      .attr("d", this.path)
      .on("mouseover", this.onMouseOver)
      .on("mouseout", this.onMouseOut);

    this.$map.append("path")
      .datum(extractInnerBoundary(this.boundaryData))
      .attr("d", this.path)
      .attr("class", "boundary inner-boundary");

    this.$map.append("path")
      .datum(extractOuterBoundary(this.boundaryData))
      .attr("d", this.path)
      .attr("class", "boundary outer-boundary");

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

  onMouseMove = () => {
    if (this.$tooltip.classed("hidden")) {
      return;
    }
    const [x, y] = d3.mouse(this.svg);
    let style;
    if (x > 0.6 * this.width) {
      style = `right: ${this.width - x + 15}px; top: ${y - 35}px`;
    }
    else {
      style = `left: ${x + 15}px; top: ${y - 35}px`;
    }
    this.$tooltip.attr("style", style);
  }

  onMouseOver = (d) => {
    const {
      tooltipText = (d) => "",
    } = this.config;

    const label = tooltipText(d);
    if (typeof label != "undefined" && label !== "") {
      this.$tooltip.classed("hidden", false).html(label);
    }
  }

  onMouseOut = (d) => {
    this.$tooltip.classed("hidden", true);
  }

  onZoom = () => {
    this.$map.attr("transform", d3.event.transform);
  }

  reset() {
    this.$map.selectAll(".unit")
      .attr("fill", "#FFFFFF");
  }

  clear() {
    this.$map.selectAll(".unit").remove();
    this.$map.selectAll(".outer-boundary").remove();
    this.$map.selectAll(".inner-boundary").remove();
  }
}

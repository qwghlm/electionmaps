import * as d3 from "d3";

import { ukProjection } from "./lib/projections";
import { extractUnits, extractOuterBoundary, extractInnerBoundary } from "./lib/topojson";
import { Topology, Objects } from "topojson-specification";
import { Feature, Geometry } from "geojson";

interface TopoJSONItem {
  id: string;
  name: string;
}

interface MapConfig<DataItem> {
  aspectRatio: number;

  projection: d3.GeoProjection;
  zoom: number;
  zoomExtent: [number, number];

  boundaryFile?: string;
  dataFile?: string;

  unitFill: string;
  outerStroke: string;
  innerStroke: string;

  tooltipText: (d: Feature<Geometry, DataItem>) => string;
}

export default class Map<DataRow extends TopoJSONItem> {

  config: MapConfig<DataRow>;

  width: number;
  height: number;

  $wrapper: d3.Selection<HTMLElement, {}, HTMLElement, {}>;
  $svg: d3.Selection<SVGElement, {}, HTMLElement, {}>;
  $map: d3.Selection<SVGGElement, {}, HTMLElement, {}>;
  $tooltip: d3.Selection<HTMLElement, {}, HTMLElement, {}>;

  path: d3.GeoPath;

  boundaryData: Topology<Objects<DataRow>>;
  unitData: DataRow[];

  constructor(el: HTMLElement, config: MapConfig<DataRow>) {
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

  updateConfig(newConfig: MapConfig<DataRow>): void {
    this.config = { ...this.config, ...newConfig };
  }

  initSVG(el: HTMLElement): void {

    const { aspectRatio = 1.6 } = this.config;

    this.width = (el.offsetWidth === 0) ? (el.parentNode as HTMLElement).offsetWidth : el.offsetWidth;
    this.height = aspectRatio*this.width;

    this.$wrapper = d3.select(el);
    this.$wrapper.classed("map-wrapper", true);

    this.$svg = this.$wrapper.append("svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("class", "map")
      .attr("style", `height: ${this.height}px !important;`);

    this.$map = this.$svg.append("g");

  }

  initProjection(): void {
    const {
      projection = ukProjection,
      zoom = 5,
      zoomExtent,
    } = this.config;

    const projectionFunction = projection.scale(this.height * zoom)
      .translate([this.width / 2, this.height / 2]);
    this.path = d3.geoPath().projection(projectionFunction);

    const zoomFunction = d3.zoom()
      .scaleExtent(zoomExtent || [1, 20])
      .translateExtent([[0, 0], [this.width, this.height]])
      .on("zoom", this.onZoom);
    this.$map.call(zoomFunction);
  }

  initTooltip(): void {
    this.$tooltip = this.$wrapper.append("div")
      .attr("class", "hidden tooltip");

    this.$wrapper.on("mousemove", this.onMouseMove);
  }

  loadBoundaries(): Promise<void> {
    const { boundaryFile } = this.config;
    if (!boundaryFile) {
      return new Promise((resolve, reject) => resolve());
    }
    return d3.json(boundaryFile).then(data => {
      this.boundaryData = data;
    });
    // TODO: Add error handling
  }

  loadData(): Promise<void> {
    const { dataFile } = this.config;
    if (!dataFile) {
      return new Promise((resolve, reject) => resolve());
    }
    return d3.json(dataFile).then(data => {
      this.unitData = data;
    });
    // TODO: Add error handling
  }

  drawBoundaries(): void {

    const units = extractUnits(this.boundaryData);
    this.$map.selectAll(".unit")
      .data(units)
      .enter()
      .append("path")
      .attr("id", d => `unit-${d.properties.id.toLowerCase()}`)
      .attr("class", d => "unit")
      .attr("data-name", d => ("name" in d.properties) ? d.properties.name : null)
      .attr("d", this.path)
      .each(d => {})
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

  colorize(): void {
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

  onMouseMove = (): void => {
    if (this.$tooltip.classed("hidden")) {
      return;
    }
    const [x, y] = d3.mouse(this.$svg.node() as d3.ContainerElement);
    let style;
    if (x > 0.6 * this.width) {
      style = `right: ${this.width - x + 15}px; top: ${y - 35}px`;
    }
    else {
      style = `left: ${x + 15}px; top: ${y - 35}px`;
    }
    this.$tooltip.attr("style", style);
  }

  onMouseOver = (d: Feature<Geometry, DataRow>): void => {
    const {
      tooltipText = (d: Feature<Geometry, DataRow>): string => "",
    } = this.config;

    const label = tooltipText(d);
    if (typeof label != "undefined" && label !== "") {
      this.$tooltip.classed("hidden", false).html(label);
    }
  }

  onMouseOut = (): void => {
    this.$tooltip.classed("hidden", true);
  }

  onZoom = (): void => {
    this.$map.attr("transform", d3.event.transform);
  }

  reset(): void {
    this.$map.selectAll(".unit")
      .attr("fill", "#FFFFFF");
  }

  clear(): void {
    this.$map.selectAll(".unit").remove();
    this.$map.selectAll(".outer-boundary").remove();
    this.$map.selectAll(".inner-boundary").remove();
  }
}
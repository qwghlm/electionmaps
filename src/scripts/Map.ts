// TODOS:
//
// Recreate original boundaries
// Test mobile & other browsers
// - scroll/zoom on mobile
// - tap/focus on mobile
//
// Update README
// Move infobox when dragging

import * as d3 from "d3";

import { BasicProperties, BasicDataRow, MapFeature, MapTopology, MapConfig } from "./types";
import load from "./lib/loader";
import { ukProjection } from "./lib/projections";
import { extractUnits, extractOuterBoundary, extractInnerBoundary } from "./lib/topojson";

const DEFAULT_CONFIG: MapConfig<unknown> = {
  aspectRatio: 1.6,
  projection: ukProjection,
  zoom: 5,
  zoomExtent: [1, 20],

  unitColor: (d) => "#FFFFFF",

  innerBoundaryColor: "#CCCCCC",
  outerBoundaryColor: "#2A2A2A",

  innerBoundaryWidth: 1,
  outerBoundaryWidth: 1,

  tooltipText: (d: MapFeature<unknown>): string => "",
};

export default class Map<DataRow extends BasicDataRow> {

  config: MapConfig<DataRow>;

  width: number;
  height: number;

  $wrapper: d3.Selection<HTMLElement, {}, HTMLElement, {}>;
  $svg: d3.Selection<SVGElement, {}, HTMLElement, {}>;
  $base: d3.Selection<SVGGElement, {}, HTMLElement, {}>;
  $map: d3.Selection<SVGGElement, {}, HTMLElement, {}>;
  $tooltip: d3.Selection<HTMLElement, {}, HTMLElement, {}>;

  _panning = false;

  zoom: d3.ZoomBehavior<Element, unknown>;
  path: d3.GeoPath;

  boundaryData: MapTopology<BasicProperties>;
  unitData: { [id: string]: DataRow };

  constructor(el: HTMLElement, config: Partial<MapConfig<DataRow>>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.initSVG(el);
    this.initMap();
    this.initTooltip();
    this.loadBoundaries()
      .then(() => this.loadData())
      .then(() => {
        this.drawBoundaries();
      });
  }

  updateConfig(newConfig: Partial<MapConfig<DataRow>>): void {
    this.config = { ...this.config, ...newConfig };
  }

  initSVG(el: HTMLElement): void {
    const { aspectRatio } = this.config;

    this.width = (el.offsetWidth === 0) ? (el.parentNode as HTMLElement).offsetWidth : el.offsetWidth;
    this.height = aspectRatio*this.width;

    this.$wrapper = d3.select(el);
    this.$wrapper.classed("ukem-map-wrapper", true);

    this.$svg = this.$wrapper.append("svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("class", "ukem-map")
      .attr("style", `height: ${this.height}px !important;`);

    this.$base = this.$svg.append("g");
    this.$map = this.$base.append("g");

  }

  initMap(): void {
    const { projection, zoom,  zoomExtent } = this.config;

    this.$map.insert("g", ":first-child")
      .append("rect")
      .attr("class", "ukem-underlay")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("fill", "#FAFAFF");

    const projectionFunction = projection.scale(this.height * zoom)
      .translate([this.width / 2, this.height / 2]);
    this.path = d3.geoPath().projection(projectionFunction);

    this.zoom = d3.zoom()
      .scaleExtent(zoomExtent)
      .translateExtent([[0, 0], [this.width, this.height]])
      .on("start", this.onZoomStart)
      .on("zoom", this.onZoom)
      .on("end", this.onZoomEnd);
    this.$base.call(this.zoom);
  }

  initTooltip(): void {
    this.$tooltip = this.$wrapper.append("div")
      .attr("class", "ukem-tooltip ukem-tooltip-hidden");

    this.$wrapper.on("mousemove", this.onMouseMove);
  }

  loadBoundaries(): Promise<void> {
    const { boundaryFile } = this.config;
    if (!boundaryFile) {
      return new Promise((resolve, reject) => resolve());
    }
    return load(boundaryFile).then((data: MapTopology<BasicProperties>) => {
      this.boundaryData = data;
    });
    // TODO: Add error handling
  }

  loadData(): Promise<void> {
    const { dataFile } = this.config;
    if (!dataFile) {
      return new Promise((resolve, reject) => resolve());
    }
    return load(dataFile).then((data: DataRow[]) => {
      this.unitData = data.reduce((acc, row) => ({...acc, [row.id]: row}), {});
    });
    // TODO: Add error handling
  }

  extractData(): MapFeature<DataRow>[] {
    return extractUnits(this.boundaryData).map(({ properties, ...rest }) => ({
      ...rest,
      properties: {
        ...this.unitData[properties.id],
        ...properties
      }
    }));
  }

  drawBoundaries(): void {
    this.$map.selectAll(".ukem-unit")
      .data(this.extractData())
      .enter()
      .append("path")
      .attr("id", d => `ukem-unit-${d.properties.id.toLowerCase()}`)
      .attr("class", d => "ukem-unit")
      .attr("d", this.path)
      .on("mouseover", this.onMouseOver)
      .on("mouseout", this.onMouseOut);

    this.$map.append("path")
      .datum(extractInnerBoundary(this.boundaryData))
      .attr("d", this.path)
      .attr("class", "ukem-boundary ukem-inner-boundary");

    this.$map.append("path")
      .datum(extractOuterBoundary(this.boundaryData))
      .attr("d", this.path)
      .attr("class", "ukem-boundary ukem-outer-boundary");
    this.updateBoundaries();
    this.colorize();
  }

  updateBoundaries(): void {
    const { outerBoundaryWidth, innerBoundaryWidth } = this.config;
    const k = (this.zoom) ? (d3.zoomTransform(this.$map.node()).k) : 1;
    this.$map.select(".ukem-outer-boundary")
      .attr("stroke-width", outerBoundaryWidth/k);
    this.$map.select(".ukem-inner-boundary")
      .attr("stroke-width", innerBoundaryWidth/k);
  }

  updateData(): void {
    this.$map.selectAll(".ukem-unit")
      .data(this.extractData());
    this.colorize();
  }

  colorize(): void {
    const { unitColor, outerBoundaryColor, innerBoundaryColor } = this.config;

    this.$map.selectAll(".ukem-unit")
      .attr("fill", unitColor as any);
    this.$map.selectAll(".ukem-outer-boundary")
      .attr("stroke", outerBoundaryColor as any);
    this.$map.selectAll(".ukem-inner-boundary")
      .attr("stroke", innerBoundaryColor as any);
  }

  onMouseMove = (): void => {
    if (this.$tooltip.classed("ukem-tooltip-hidden")) {
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

  onMouseOver = (d: MapFeature<DataRow>): void => {
    const { tooltipText } = this.config;
    const label = tooltipText(d);

    if (typeof label != "undefined" && label !== "") {
      this.$tooltip.classed("ukem-tooltip-hidden", this._panning).html(label);
    }
  }

  onMouseOut = (): void => {
    this.$tooltip.classed("ukem-tooltip-hidden", true);
  }

  onZoomStart = (): void => {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type !== "wheel"){
      this._panning = true;
      this.$tooltip.classed("ukem-tooltip-hidden", true);
    }
  }

  onZoom = (): void => {
    this.$map.attr("transform", d3.event.transform);
  }

  onZoomEnd = (): void => {
    if (this._panning) {
      this.$tooltip.classed("ukem-tooltip-hidden", false);
    }
    this._panning = false;
    this.updateBoundaries();
  }

  zoomIn(): void {
    this.zoom.scaleBy(this.$base, 3/2);
  }

  zoomOut(): void {
    this.zoom.scaleBy(this.$base, 2/3);
  }

  reset(): void {
    this.$map.selectAll(".ukem-unit")
      .attr("fill", "#FFFFFF");
  }

  clear(): void {
    this.$map.selectAll(".ukem-unit").remove();
    this.$map.selectAll(".ukem-outer-boundary").remove();
    this.$map.selectAll(".ukem-inner-boundary").remove();
  }
}

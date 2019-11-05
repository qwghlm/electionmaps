import d3 from "./lib/d3";

export default class Map {

  constructor(el, config) {
    const { aspectRatio } = config;
    this.initSVG(el, aspectRatio);
  }

  initSVG(el, aspectRatio) {

    this.width = (el.offsetWidth === 0) ? el.parentNode.offsetWidth : el.offsetWidth;
    this.height = aspectRatio*this.width;

    this.$svg = d3.select(el).append("svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("style", `height: ${this.height} px !important;`);

    this.$map = this.$svg;

  }
}

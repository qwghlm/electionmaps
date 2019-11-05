import "../styles/index.scss";

import "../data/westminster.topojson";

import Map from "./Map";

document.addEventListener("DOMContentLoaded", function(e) {
  const el = document.querySelector("#map-wrapper");
  return new Map(el, {
    aspectRatio: 1.6,
    boundaryFile: "/data/westminster.topojson",
  });
});

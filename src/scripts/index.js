import "../styles/index.scss";
import "../data/westminster.topojson";

import Map from "./Map";

document.addEventListener("DOMContentLoaded", (e) => {
  const el = document.querySelector("#map-wrapper");
  return new Map(el, {

    aspectRatio: 1.6,
    zoom: 5,

    boundaryFile: "/data/westminster.topojson",

    tooltipText: ({ properties }) => {
      const { name } = properties;
      return name;
    }

  });
});

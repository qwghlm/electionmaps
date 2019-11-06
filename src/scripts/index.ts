import "../styles/index.scss";
import "../data/westminster.topojson";

import Map from "./Map";

// TODO
// Add change election facility

document.addEventListener("DOMContentLoaded", (e) => {

  const el = document.querySelector("#map-wrapper");
  const map = new Map(el as HTMLElement, {

    boundaryFile: "/data/westminster.topojson",


    tooltipText: ({ properties: { name } }): string => {
      return name;
    }
  });

  document.querySelector("#map-button-zoom-in").addEventListener("click", (e) => {
    e.preventDefault();
    map.zoomIn();
  });
  document.querySelector("#map-button-zoom-out").addEventListener("click", (e) => {
    e.preventDefault();
    map.zoomOut();
  });

});

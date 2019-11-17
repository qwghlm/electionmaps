import "../styles/index.scss";

import "../data/westminster.topojson";
import "../data/general-election-results-2015.csv";
import "../data/general-election-results-2017.csv";

import Map from "./Map";
import { BasicDataRow, MapConfig } from "./types";
import { getPartyColor, getPartyName } from "./lib/politics";

// TODO
// Add change election facility

interface ElectionResult extends BasicDataRow {
  winner: string;
}

document.addEventListener("DOMContentLoaded", (e) => {

  const el = document.querySelector("#map-wrapper");

  const config: Partial<MapConfig<ElectionResult>> = {

    boundaryFile: "/data/westminster.topojson",
    dataFile: "/data/general-election-results-2017.csv",

    unitColor: ({ properties: { winner }}): string => {
      return getPartyColor(winner);
    },

    tooltipText: ({ properties : { name, winner }}): string => {
      return `${name}<br>Winner: ${getPartyName(winner)}`;
    }
  };
  const map = new Map(el as HTMLElement, config);

  document.querySelector("#map-button-zoom-in").addEventListener("click", (e) => {
    e.preventDefault();
    map.zoomIn();
  });
  document.querySelector("#map-button-zoom-out").addEventListener("click", (e) => {
    e.preventDefault();
    map.zoomOut();
  });

});

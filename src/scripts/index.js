import "../styles/index.scss";

import "../data/westminster.topojson";
import "../data/general-election-results-2015.csv";
import "../data/general-election-results-2017.csv";

import Map from "./Map";
import { getPartyColor, getPartyName } from "./lib/politics";

document.addEventListener("DOMContentLoaded", (e) => {

  const config = {

    boundaryFile: "/data/westminster.topojson",
    dataFile: "/data/general-election-results-2017.csv",

    unitColor: ({ properties: { winner }}) => {
      return getPartyColor(winner);
    },

    tooltipText: ({ properties : { name, winner }}) => {
      return `${name}<br>Winner: ${getPartyName(winner)}`;
    }
  };

  const map = new Map(document.querySelector("#map-wrapper"), config);

  document.querySelector("#map-button-zoom-in").addEventListener("click", (e) => {
    e.preventDefault();
    map.zoomIn();
  });
  document.querySelector("#map-button-zoom-out").addEventListener("click", (e) => {
    e.preventDefault();
    map.zoomOut();
  });

  const radios = document.querySelectorAll("input[name=map-year]");
  for (let i=0; i<radios.length; i++) {
    radios[i].addEventListener("change", (e) => {
      const currentYear = e.currentTarget.value;
      map.updateConfig({
        dataFile: `/data/general-election-results-${currentYear}.csv`,
      });
      map.loadData().then(() => {
        map.updateData();
      });
    });
  }

});

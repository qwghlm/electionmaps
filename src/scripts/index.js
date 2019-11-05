import '../styles/index.scss';

import Map from "./Map";

document.addEventListener("DOMContentLoaded", function(e) {
  const el = document.querySelector("#map-wrapper");
  return new Map(el, {
    aspectRatio: 2,
  });
});

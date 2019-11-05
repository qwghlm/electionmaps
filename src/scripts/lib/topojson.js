import * as topojson from "topojson-client";

export function extractUnits(boundaryData) {
  return topojson.feature(boundaryData, boundaryData.objects.units).features;
}

export function extractOuterBoundary(boundaryData) {
  return topojson.mesh(boundaryData, boundaryData.objects.units, (a, b) => a === b);
}

export function extractInnerBoundary(boundaryData) {
  return topojson.mesh(boundaryData, boundaryData.objects.units, (a, b) => a !== b);
}

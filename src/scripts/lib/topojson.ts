import * as topojson from "topojson-client";
import { Topology } from "topojson-specification";
import { FeatureCollection } from "geojson";

export function extractUnits(boundaryData: Topology) {
  const collection =  topojson.feature(boundaryData, boundaryData.objects.units);
  return (collection as FeatureCollection).features;
}

export function extractOuterBoundary(boundaryData: Topology) {
  return topojson.mesh(boundaryData, boundaryData.objects.units, (a, b) => a === b);
}

export function extractInnerBoundary(boundaryData: Topology) {
  return topojson.mesh(boundaryData, boundaryData.objects.units, (a, b) => a !== b);
}

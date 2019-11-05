import * as topojson from "topojson-client";
import { Topology } from "topojson-specification";
import { FeatureCollection } from "geojson";

export function extractUnits<T>(boundaryData: Topology<T>) {
  const collection =  topojson.feature(boundaryData, boundaryData.objects.units);
  return (collection as FeatureCollection<any, U extends T>).features;
}

export function extractOuterBoundary(boundaryData: Topology) {
  return topojson.mesh(boundaryData, boundaryData.objects.units, (a, b) => a === b);
}

export function extractInnerBoundary(boundaryData: Topology) {
  return topojson.mesh(boundaryData, boundaryData.objects.units, (a, b) => a !== b);
}

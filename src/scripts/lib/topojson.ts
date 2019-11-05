import * as topojson from "topojson-client";
import { Topology, Objects } from "topojson-specification";
import { FeatureCollection, Geometry, Feature, MultiLineString } from "geojson";

export function extractUnits<T>(boundaryData: Topology<Objects<T>>): Feature<Geometry, T>[] {
  const collection =  topojson.feature(boundaryData, boundaryData.objects.units);
  return (collection as FeatureCollection<Geometry, T>).features;
}

export function extractOuterBoundary(boundaryData: Topology): MultiLineString {
  return topojson.mesh(boundaryData, boundaryData.objects.units, (a, b) => a === b);
}

export function extractInnerBoundary(boundaryData: Topology): MultiLineString {
  return topojson.mesh(boundaryData, boundaryData.objects.units, (a, b) => a !== b);
}

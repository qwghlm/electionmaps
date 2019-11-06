import { Feature, Geometry } from "geojson";

export interface TopoJSONItem {
  id: string;
  name: string;
}

export interface MapConfig<DataItem> {
  aspectRatio: number;

  projection: d3.GeoProjection;
  zoom: number;
  zoomExtent: [number, number];

  boundaryFile?: string;
  dataFile?: string;

  unitFill: string;
  outerStroke: string;
  innerStroke: string;

  tooltipText: (d: Feature<Geometry, DataItem>) => string;
}

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

  unitColor: string;
  innerBoundaryColor: string;
  outerBoundaryColor: string;

  innerBoundaryWidth: number;
  outerBoundaryWidth: number;

  tooltipText: (d: Feature<Geometry, DataItem>) => string;
}

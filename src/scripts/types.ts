import { ValueFn } from "d3";
import { Feature, Geometry } from "geojson";
import { Topology, Objects } from "topojson-specification";

// Basic properties of a single unit in the Topojson file that is parsed
export interface BasicProperties {
  id: string;
  name?: string;
}

// Minimum properties of a single row in the CSV/JSON data file that is parsed
export interface BasicDataRow {
  id: string;
}

// Represents the overall map topology - an entire topojson topology, married with the data
// loaded from the JSON/CSV data file
export type MapTopology<P> = Topology<Objects<BasicProperties & P>>

// Represents an individual map feature (a unit or constituency) derived from the above
// The object's properties contain props from both the topojson item and the data file
export type MapFeature<P> = Feature<Geometry, BasicProperties & P>;

type D3Attr<Props, Result> = ValueFn<d3.BaseType, MapFeature<Props>, Result> | Result;

// Configuration for a map
export interface MapConfig<P> {

  aspectRatio: number;
  projection: d3.GeoProjection;
  zoom: number;
  zoomExtent: [number, number];

  boundaryFile?: string;
  dataFile?: string;

  unitColor: D3Attr<P, string>;
  innerBoundaryColor: D3Attr<P, string>;
  outerBoundaryColor: D3Attr<P, string>;
  innerBoundaryWidth: number;
  outerBoundaryWidth: number;

  tooltipText: (d: MapFeature<P>) => string;
}

//

interface Party {
  color: string;
  name: string;
  abbreviation: string;
}
export type PartyLookup = { [id: string]: Party }

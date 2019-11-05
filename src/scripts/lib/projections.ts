import { geoConicEqualArea, GeoConicProjection } from "d3-geo";

interface LonLat {
  lon: number;
  lat: number;
}

interface ProjectionParams {
  center: LonLat;
  rotation: LonLat;
  parallels: [number, number];
}

const ukParams: ProjectionParams = {
  center : {
    lon : 0,
    lat : 55.4,
  },
  rotation : {
    lon : 3.7,
    lat : 0,
  },
  parallels : [49, 60],
};

function makeProjection(params: ProjectionParams): GeoConicProjection {
  const { center, rotation, parallels } = params;
  return geoConicEqualArea()
    .center([center.lon, center.lat])
    .rotate([rotation.lon, rotation.lat])
    .parallels(parallels);
}

export const ukProjection = makeProjection(ukParams);

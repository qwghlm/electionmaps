import * as d3 from "d3";

const ukParams = {
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


function makeProjection(params) {
  const { center, rotation, parallels } = params;
  return d3.geoConicEqualArea()
    .center([center.lon, center.lat])
    .rotate([rotation.lon, rotation.lat])
    .parallels(parallels);
}

export const ukProjection = makeProjection(ukParams);

"use strict";
const fs = require("fs");
const axios = require("axios");

const polyline = require("google-polyline");

const segments = require("./segments");

const trips = segments.map(segment => {
  return [segment.id, segment.url];
});

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const segment_array = [];
const error_array = [];

asyncForEach(trips, async trip => {
  await axios.get(trip[1]).then(res => {
    if (res.data.status === "OK") {
      res.data.id = trip[0];
      const paths = polyline.decode(
        res.data.routes[0].overview_polyline.points
      );
      paths.map(path => path.reverse());

      const feature = {
        properties: {
          id: trip[0]
        },
        geometry: {
          type: "LineString",
          coordinates: paths
        }
      };

      segment_array.push(feature);
    } else {
      error_array.push(trip[1]);
    }
  });
}).then(() => {
  const geojson = {
    type: "FeatureCollection",
    features: segment_array
  };

  let data = JSON.stringify(geojson);
  fs.writeFileSync("segment-routes.json", data);

  let errors = JSON.stringify(error_array);
  fs.writeFileSync("errors.json", errors);
});

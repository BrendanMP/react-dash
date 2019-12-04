"use strict";
const fs = require("fs");
const segments = require("./segment-routes");
const polyline = require("google-polyline");

const result = segments.map(segment => {
  const paths = polyline.decode(segment);

  paths.map(path => {
    console.log(path.reverse());
  });

  return {
    path: paths
  };
});

let data = JSON.stringify(result);
fs.writeFileSync("segment-paths.json", data);

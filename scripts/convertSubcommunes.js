"use strict";
const fs = require("fs");
const csv = require("csvtojson");
const uuidv4 = require("uuid/v4");

const geojsonArea = require("@mapbox/geojson-area");

const communes = require("./communes");
const sub_communes = require("./sub_communes");

let communes_result = [];

communes.features.forEach(feature => {
  if (feature.type !== "point") {
    feature.area = geojsonArea.geometry(feature.geometry);
    feature.geometry = null;
    communes_result.push(feature);
  }
});

let sub_communes_result = [];

sub_communes.features.forEach(feature => {
  if (feature.type !== "point") {
    feature.area = geojsonArea.geometry(feature.geometry);
    feature.geometry = null;
    sub_communes_result.push(feature);
  }
});

fs.writeFileSync("subcommunes_area.json", JSON.stringify(sub_communes_result));
fs.writeFileSync("communes_area.json", JSON.stringify(communes_result));

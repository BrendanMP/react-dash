"use strict";
const fs = require("fs");
const csv = require("csvtojson");
const uuidv4 = require("uuid/v4");

const accidents = "./csv/accidents.csv";
const OFFSET = 1577836800;

csv()
  .fromFile(accidents)
  .then(accidents => {
    const result = accidents.map(accident => {
      return {
        latitude: Number(accident.latitude),
        longitude: Number(accident.longitude)
      };
    });
    let data = JSON.stringify({ accidents: accidents });
    fs.writeFileSync("accidents.json", data);
  });

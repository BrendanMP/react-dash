"use strict";
const fs = require("fs");
const csv = require("csvtojson");
const uuidv4 = require("uuid/v4");

const accidents = "./csv/accident-2.csv";
const OFFSET = 1577836800;

csv()
  .fromFile(accidents)
  .then(accidents => {
    let fatalities = [];

    const result = accidents.map(accident => {
      console.log(accident);

      for (let i = 0; i < accident.fatalities; i++) {
        fatalities.push({
          latitude: Number(accident.latitude),
          longitude: Number(accident.longitude),
          fatalities: 1
        });
      }
      return {
        latitude: Number(accident.latitude),
        longitude: Number(accident.longitude)
      };
    });
    let data = JSON.stringify({
      accidents: accidents,
      fatalities: fatalities
    });
    fs.writeFileSync("accidents.json", data);
  });

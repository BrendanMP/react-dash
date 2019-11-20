"use strict";
const fs = require("fs");
const csv = require("csvtojson");
const uuidv4 = require("uuid/v4");

const accidents = "./csv/accident-2.csv";
const OFFSET = 1577836800;

csv()
  .fromFile(accidents)
  .then(accidents => {
    let fatalities_data = [];
    let accident_data = [];
    let no_response_data = [];

    accidents.forEach(accident => {
      for (let i = 0; i < accident.fatalities; i++) {
        fatalities_data.push({
          ...accident,
          lat: Number(accident.lat),
          lng: Number(accident.lng),
          fatalities: 1,
          accidents: i < 1 ? 1 : 0
        });
      }

      if (Number(accident.no_response)) {
        no_response_data.push(accident);
      }

      accident_data.push({
        ...accident,
        accident: 1,
        lat: Number(accident.lat),
        lng: Number(accident.lng)
      });
    });

    let data = JSON.stringify({
      accidents: accident_data,
      fatalities: fatalities_data,
      no_response: no_response_data
    });
    fs.writeFileSync("accidents.json", data);
  });

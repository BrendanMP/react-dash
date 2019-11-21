"use strict";
const fs = require("fs");
const csv = require("csvtojson");
const uuidv4 = require("uuid/v4");

const accidents = "./csv/accidents-stats.csv";
const OFFSET = 1577836800;

csv()
  .fromFile(accidents)
  .then(data => {
    let result = [];
    data.forEach((item, i) => {
      result.push(item);
    });

    const json = JSON.stringify({ data: result });
    fs.writeFileSync("accident_stats.json", json);
  });

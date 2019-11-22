"use strict";
const fs = require("fs");
const csv = require("csvtojson");
const uuidv4 = require("uuid/v4");

const projects = "./csv/finance.csv";
const OFFSET = 1577836800;

csv()
  .fromFile(projects)
  .then(projects => {
    let result = [];
    projects.forEach(project => result.push(project));
    let data = JSON.stringify({ data: result });
    fs.writeFileSync("finance.json", data);
  });

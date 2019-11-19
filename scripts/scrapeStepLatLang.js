"use strict";
const fs = require("fs");

const json = require("./trips.json");

const result = [];

json.forEach(trip => {
  trip.routes[0].legs[0].steps.forEach(step => {
    result.push([step.start_location.lat, step.start_location.lng]);
    result.push([step.end_location.lat, step.end_location.lng]);
  });
});

function ConvertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  return str;
}

// let data = JSON.stringify({
//   result
// });

let data = ConvertToCSV(result);

fs.writeFileSync("start_end.csv", data);

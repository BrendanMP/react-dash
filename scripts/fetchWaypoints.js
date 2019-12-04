"use strict";
const fs = require("fs");
const csv = require("csvtojson");

const segments = "./csv/road_segments.csv";

csv()
  .fromFile(segments)
  .then(segments => {
    let result = [];
    segments.forEach(segment => {
      segment.array = [
        segment.coords_1 ? segment.coords_1 : null,
        segment.coords_2 ? segment.coords_2 : null,
        segment.coords_3 ? segment.coords_3 : null,
        segment.coords_3 ? segment.coords_3 : null,
        segment.coords_4 ? segment.coords_4 : null,
        segment.coords_5 ? segment.coords_5 : null,
        segment.coords_6 ? segment.coords_6 : null
      ];

      var filtered = segment.array.filter(function(el) {
        return el != null;
      });

      var origin = filtered[0];
      var destination = filtered[filtered.length - 1];

      filtered.pop();
      filtered.shift();

      var waypoints = filtered.join("|");

      result.push({
        id: segment.segment_id,
        waypoints: filtered,
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints}&key=AIzaSyCMwXLgXPsk8NbF3obJtM0MVE9uFG_Po1g`
      });
    });

    let data = JSON.stringify(result);

    fs.writeFileSync("segments.json", data);
  });

// https://maps.googleapis.com/maps/api/directions/json?
// origin=5.363599%2C-4.083372
// &destination=5.364648%2c-4.029362
// &waypoints=5.360064%2C-4.074136|5.359485%2c-4.066757|5.359994%2c-4.041142
// &key=AIzaSyCMwXLgXPsk8NbF3obJtM0MVE9uFG_Po1g

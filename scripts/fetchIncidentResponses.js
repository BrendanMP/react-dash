'use strict'
const fs = require('fs');
const axios = require('axios');
const trips = [
  [1577868480, "https://maps.googleapis.com/maps/api/directions/json?origin=5.29007%2C-4.00885&destination=5.306575%2C-3.99661&arrival_time=1577869183&key=AIzaSyCMwXLgXPsk8NbF3obJtM0MVE9uFG_Po1g"],
]

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const trip_array = [];
const error_array = [];

asyncForEach(trips, async (trip) => {
  await axios.get(trip[1]).then(res => {
    if (res.data.status === "OK") {
      res.data.start_time = trip[0];
      trip_array.push(res.data)
    } else {
      error_array.push(trip[1])
    }
  });
}).then(()=> {

  let data = JSON.stringify(trip_array);

  fs.writeFileSync('incidents_responders.json', data);

  let errors = JSON.stringify(error_array);
  fs.writeFileSync('errors.json', errors);
})

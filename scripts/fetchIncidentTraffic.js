'use strict'
const fs = require('fs');
const axios = require('axios');
const trips = [
  [1577868300,	"https://maps.googleapis.com/maps/api/directions/json?origin=5.30657%2C-3.9966&destination=5.293871%2C-3.992884&departure_time=1577868300&key=AIzaSyCMwXLgXPsk8NbF3obJtM0MVE9uFG_Po1g"],
  [1577868300,	"https://maps.googleapis.com/maps/api/directions/json?origin=5.30657%2C-3.9966&destination=5.29605%2C-4.003404&departure_time=1577868300&key=AIzaSyCMwXLgXPsk8NbF3obJtM0MVE9uFG_Po1g"],
  [1577868300,	"https://maps.googleapis.com/maps/api/directions/json?origin=5.30657%2C-3.9966&destination=5.303486%2C-4.014267&departure_time=1577868300&key=AIzaSyCMwXLgXPsk8NbF3obJtM0MVE9uFG_Po1g"],
  [1577868300,	"https://maps.googleapis.com/maps/api/directions/json?origin=5.30657%2C-3.9966&destination=5.289512%2C-3.990776&departure_time=1577868300&key=AIzaSyCMwXLgXPsk8NbF3obJtM0MVE9uFG_Po1g"],
  [1577868300,	"https://maps.googleapis.com/maps/api/directions/json?origin=5.30657%2C-3.9966&destination=5.296146%2C-3.981608&departure_time=1577868300&key=AIzaSyCMwXLgXPsk8NbF3obJtM0MVE9uFG_Po1g"],
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
      res.data.start_time = trip[0] + 120;
      trip_array.push(res.data)
    } else {
      error_array.push(trip[1])
    }
  });
}).then(()=> {

  let data = JSON.stringify(trip_array);

  fs.writeFileSync('incidents_traffic.json', data);

  let errors = JSON.stringify(error_array);
  fs.writeFileSync('errors.json', errors);
})

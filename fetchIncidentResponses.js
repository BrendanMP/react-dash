'use strict'
const fs = require('fs');
const axios = require('axios');
const trips = [
  [1577782133, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2544696%2C-3.9296293&departure_time=1577782133&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577779939, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3199194%2C-4.0173006&departure_time=1577779939&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577769604, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3017273%2C-4.0032718&departure_time=1577769604&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577777058, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3099481%2C-4.0142483&departure_time=1577777058&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577774338, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2926815%2C-3.9990932&departure_time=1577774338&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577782782, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3282418%2C-4.0209478&departure_time=1577782782&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577785146, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.276273%2C-3.9664849&departure_time=1577785146&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577788065, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2991901%2C-3.9864331&departure_time=1577788065&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577780580, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3206735%2C-4.0157799&departure_time=1577780580&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577776992, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3216273%2C-4.0151606&departure_time=1577776992&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577784958, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2930821%2C-3.9988518&departure_time=1577784958&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577778060, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.317847%2C-4.0145789&departure_time=1577778060&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577779604, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2877425%2C-3.9727888&departure_time=1577779604&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577769730, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3018398%2C-3.9880639&departure_time=1577769730&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577789318, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.298175%2C-3.986015&departure_time=1577789318&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577782020, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2794607%2C-4.0090918&departure_time=1577782020&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577779234, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3265874%2C-4.006462&departure_time=1577779234&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577783442, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.311401%2C-4.0111199&departure_time=1577783442&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577779602, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3216837%2C-4.016149&departure_time=1577779602&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577793891, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2904434%2C-3.9803888&departure_time=1577793891&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577781962, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2885384%2C-3.9880421&departure_time=1577781962&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577783548, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2931652%2C-3.9897973&departure_time=1577783548&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577782111, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2952327%2C-3.9832202&departure_time=1577782111&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577764562, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3169423%2C-4.0185833&departure_time=1577764562&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577771696, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3588466%2C-3.9872326&departure_time=1577771696&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577782390, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3350399%2C-3.9760447&departure_time=1577782390&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577778706, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3229199%2C-4.0194126&departure_time=1577778706&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577778389, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3269934%2C-4.0209725&departure_time=1577778389&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577777260, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2914563%2C-3.991993&departure_time=1577777260&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577774839, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2924918%2C-3.9621377&departure_time=1577774839&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577767320, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3079501%2C-4.0109003&departure_time=1577767320&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577780055, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2968078%2C-4.0014803&departure_time=1577780055&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577779050, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2873212%2C-3.9688969&departure_time=1577779050&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577777336, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3159496%2C-4.0163489&departure_time=1577777336&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577787318, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3159496%2C-4.0163489&departure_time=1577787318&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577788433, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3221177%2C-4.0138483&departure_time=1577788433&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577783045, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.3263079%2C-4.0199194&departure_time=1577783045&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577783617, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2819831%2C-3.9704614&departure_time=1577783617&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
  [1577781303, 	"https://maps.googleapis.com/maps/api/directions/json?origin=5.298761%2C-3.990675&destination=5.2782838%2C-3.9675018&departure_time=1577781303&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"],
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
      res.data.start_time = trip[0]
      trip_array.push(res.data)
    } else {
      error_array.push(trip[1])
    }
  });
}).then(()=> {

  let duration_array = []
  trip_array.forEach(trip => {
    duration_array.push(trip.routes[0].legs[0].duration.value)
  })

  let durations = JSON.stringify(duration_array);

  fs.writeFileSync('durations.json', durations);

  let data = JSON.stringify(trip_array);

  fs.writeFileSync('reponders.json', data);

  let errors = JSON.stringify(error_array);
  fs.writeFileSync('errors.json', errors);
})

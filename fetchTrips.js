'use strict'
const fs = require('fs');
const axios = require('axios');
const trips = [
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3019971%2C-3.9925835&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.298175%2C-3.986015&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.295272%2C-3.983574&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3229199%2C-4.0194126&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2856546%2C-3.976981&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.283346%2C-3.9700573&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.276273%2C-3.9664849&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2853716%2C-3.9743311&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.273093%2C-3.975738&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2865787%2C-3.9734851&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2749722%2C-3.9686534&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.276072%2C-3.981365&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2761261%2C-3.9806067&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2958044%2C-3.9838554&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3238002%2C-4.0162378&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2952327%2C-3.9832202&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3271567%2C-4.01974&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3175119%2C-4.0147939&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2821292%2C-3.9754871&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3221177%2C-4.0138483&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3159496%2C-4.0163489&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2579444%2C-3.937456&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2991901%2C-3.9864331&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3263079%2C-4.0199194&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3159496%2C-4.0163489&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2544696%2C-3.9296293&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3194052%2C-4.0157577&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3021376%2C-3.9547153&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3079501%2C-4.0109003&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2917761%2C-4.0010405&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3063797%2C-3.9953327&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2924918%2C-3.9621377&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3236052%2C-4.0165513&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.319626%2C-4.0121659&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3235373%2C-4.0149076&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3112564%2C-4.0144944&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.289977%2C-3.9823988&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3230454%2C-4.0168061&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2784668%2C-3.9779393&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2885384%2C-3.9880421&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2848293%2C-3.9848755&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3329023%2C-4.0200734&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=1-4.01368%2C5.3087098&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.365849%2C-4.0237527&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3087098%2C-4.01368&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2837423%2C-4.0088779&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3064866%2C-4.021432&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2926815%2C-3.9990932&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.311401%2C-4.0111199&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2983166%2C-3.9965516&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2596276%2C-3.9942211&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2794607%2C-4.0090918&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2653034%2C-4.0130343&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2846825%2C-3.9827156&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3216273%2C-4.0151606&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2873212%2C-3.9688969&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3382939%2C-4.0193331&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.33651%2C-4.0132821&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2701451%2C-4.0041867&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3065186%2C-4.0139472&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2808792%2C-3.9772868&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.2968078%2C-4.0014803&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3253735%2C-4.0202022&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
  "https://maps.googleapis.com/maps/api/directions/json?origin=5.3239474%2C-4.0152723&destination=5.2544696%2C-3.9296293&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw",
]

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const trip_array = [];
const error_array = [];

asyncForEach(trips, async (url) => {
  await axios.get(url).then(res => {
    if (res.data.status === "OK") {
      trip_array.push(res.data)
    } else {
      error_array.push(url)
    }
  });
}).then(()=> {
  let data = JSON.stringify(trip_array);
  fs.writeFileSync('trips.json', data);

  let errors = JSON.stringify(error_array);
  fs.writeFileSync('errors.json', errors);
})

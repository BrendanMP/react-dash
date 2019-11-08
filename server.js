const express = require('express');
const cors = require('cors')
const socket = require('socket.io');
const consola = require('consola');
const bodyParser = require("body-parser");
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw'
});

//origin=5.2544696%2C-3.929629&destination=5.3036192%2C-4.00463

const app = express();
const port = 3030;

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function start() {
  const server = app.listen(port);
  consola.ready({
    message: `Server listening on http://localhost:${port}`,
    badge: true
  })

  const io = socket(server);

  io.on('connection', (socket) => {
    socket.on('update', (data) => {
      consola.info('socket received update')
      io.sockets.emit('update', data);
    })
  });

  app.get('/', (req, res) => res.send('Hello World!'))
  app.get('/api', (req, res) => res.send(directions))
}

start();


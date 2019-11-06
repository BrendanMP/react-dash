const express = require('express');
const socket = require('socket.io');
const consola = require('consola');

const app = express();
const port = 3030;
const host = '0.0.0.0';

function start() {
  const server = app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

  const io = socket(server);

  io.on('connection', (socket) => {
    consola.info('socket connected')
    socket.on('update', (data) => {
      consola.info('socket received update')
      io.sockets.emit('update', data);
    })
  });

  app.get('/', (req, res) => res.send('Hello World!'))
}

start();

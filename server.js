const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const consola = require("consola");
const bodyParser = require("body-parser");

const app = express();
const port = 3030;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function start() {
  const server = app.listen(port);
  consola.ready({
    message: `Server listening on http://localhost:${port}`,
    badge: true
  });

  const io = socket(server);

  io.on("connection", socket => {
    socket.on("update", data => {
      consola.info("socket received update", data);
      io.sockets.emit("update", data);
    });
  });
}

start();

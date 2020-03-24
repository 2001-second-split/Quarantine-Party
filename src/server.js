const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

let players = {};


app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname + '/src'));


io.on('connection', function (socket) {
  console.log('server: a user connected');

  // create a new player and add it to our players object
  players[socket.id] = {
    playerId: socket.id,
  };

  // send the players object to the new player
  socket.emit('currentPlayers', players);

  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // when a player moves, update the player data
  socket.on('playerMovement', function (movementData) {
    // console.log('movement')

    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;

    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  // testing key press
  socket.on('testKey', function() {
    console.log('test key pressed');
  })

  // disconnecting
  socket.on('disconnect', function () {
    console.log('server - user disconnected');

    // remove this player from our players object
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });
});

server.listen(3000, function () {
  console.log(`SERVER Listening on ${server.address().port}`);
});

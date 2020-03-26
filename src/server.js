const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const path = require('path');

let players = {};

app.use(express.static(path.join(__dirname + '/public')));

// sends index.html
app.get('/', (req, res) => {
  console.log('INSIDE GET', path.join(__dirname, '../public/index.html'))
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

io.on('connection', (socket)  => {
  console.log(`${socket.id} connected`);

  // << CURRENTLY USED SOCKET LISTENERS >>
  // create a new player and add it to our players object
  players[socket.id] = {
    rotation: 0,
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id
  };

  //get current players when you first enter the room
  socket.on('currentPlayers', function() {
    console.log('requesting room information');
    const room = players[socket.id].roomId;
    socket.emit('currentPlayers', players, room);
  })

  socket.on('subscribe', (room) => {
    console.log(`A client joined room ${room}`)
    socket.join(room)
    // update all other players of the new player
    players[socket.id].roomId = room

    // send the players object in subscribed room to the new player
    socket.emit('currentPlayers', players, room);

    //io.emit('currentPlayers', players, room);

    // update all other players of the new player
    io.to(room).emit('newPlayer', players[socket.id])
  })

  // disconnecting
  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);

    // remove this player from our players object
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });


  // << FUTURE SOCKET LISTENER/EVENTS >>

  // // testing key press
  // socket.on('testKey', function() {
  //   console.log('test key pressed');
  // })


  // when a player moves, update the player data
  socket.on('playerMovement', function (movementData) {
    // console.log('movement')

    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;

    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  // update all other players of the new player
  // socket.broadcast.emit('newPlayer', players[socket.id]);


});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`SERVER Listening on ${server.address().port}`);
});

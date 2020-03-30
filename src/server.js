const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const path = require('path');
const PORT = process.env.PORT || 3000;

let players = {};
let rooms = {};

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
    playerId: socket.id,
    RANDOM: 'RANDOM'

  };

  //get current players when you first enter the room
  socket.on('currentPlayers', () => {
    const room = players[socket.id].roomId;
    socket.emit('currentPlayers', players, room);
  })

  socket.on('subscribe', (room, spriteSkin) => {

    if (rooms[room] === undefined) {
      rooms[room] = 0;

      console.log(`new room created. there are ${rooms[room]} people in room ${room}`)

    } else if (rooms[room] === 4) {
      socket.emit('roomFull');
      return;

    }
      rooms[room] += 1;
      socket.emit('createdOrJoinedRoom')
      console.log(`there are ${rooms[room]} people in room ${room}`)

      console.log(`A client joined room ${room}`)
      socket.join(room)
      // add the newly subscribed player to the players object,
      // and pass its roomId and name(spriteSkin)
      players[socket.id].roomId = room
      players[socket.id].name = spriteSkin

      // update all other players of the new player
      io.to(room).emit('newPlayer', players[socket.id], socket.id,spriteSkin)

  })

  // disconnecting
  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
    // emit a message to all players to remove this player
    io.to(players[socket.id].roomId).emit('disconnect', socket.id);
    // remove this player from our players object
    delete players[socket.id];

  });

  // when a player moves, update the player data
  socket.on('playerMovement', (movementData) => {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;

    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  //when a player rolls a dice, update their position
  socket.on('diceRoll', (rolledNum) => {
    socket.emit('moveSelfOnBoard', rolledNum);
    //io.to(socket.roomId).broadcast('moveOtherOnBoard', rolledNum)
  })

  socket.on('startMinigame', () => {
    io.in(players[socket.id].roomId).emit('minigameStarted')
  })

  // socket.on('otherPlayerMove', (cursors) => {
  //   const roomId = players[socket.id].roomId
  //   io.to(roomId).emit('otherPlayerMoved', cursors)
  // })

});

server.listen(PORT, () => {
  console.log(`SERVER Listening on ${server.address().port}`);
});

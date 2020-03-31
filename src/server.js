const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const path = require('path');
const PORT = process.env.PORT || 3000;

let players = {};
let rooms = {};
let charactersInRoom = {};
let queue = {};

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

  // STARTING SCENE SOCKETS
  // get current players when you first enter the room
  socket.on('currentPlayers', () => {
    const room = players[socket.id].roomId;
    socket.emit('currentPlayers', players, room, queue[room]);
  })

  socket.on('subscribe', (room, spriteSkin, roomCreator) => {

    if (rooms[room] === undefined && roomCreator) {
      rooms[room] = 0;
      queue[room] = [];
      console.log(`new room created. there are ${rooms[room]} people in room ${room}`)

    } else if (rooms[room] === undefined && !roomCreator) {
      console.log('heyy');
      socket.emit('joiningNonExistingRoom');
      return;

    } else if (rooms[room] && roomCreator) { //if room exists, and this person is trying to create
      socket.emit('roomAlreadyCreated') //deny them
      return;

    } else if (rooms[room] === 4) {
      socket.emit('roomFull');
      return;

    }
    rooms[room] += 1;
    socket.emit('createdOrJoinedRoom')

    console.log(`A client joined room ${room}`)
    socket.join(room)
    console.log(`there are ${rooms[room]} people in room ${room}`)
    // add the newly subscribed player to the players object,
    // and pass its roomId and name(spriteSkin)
    players[socket.id].roomId = room
    players[socket.id].name = spriteSkin

    // update all other players of the new player
    io.to(room).emit('newPlayer', players[socket.id], socket.id,spriteSkin)

    //add players to queue in the order they join room
    queue[room].push(players[socket.id].name)
    console.log(queue)

    //if there are four players subscribed to room, emit playersReady
    io.in(room).clients((error, clients) => {
      if (error) throw error
      if(clients.length === 4){
        io.in(room).emit('playersReady')
      }
    });
  })

  //listen for request to transition to board
  socket.on('transitionToBoard', () => {
    const room = players[socket.id].roomId;
    io.in(room).emit('transitionedToBoard')
  })

  // disconnecting
  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);

    //make sure to reset room count
    const room = players[socket.id].roomId;
    rooms[room] -= 1;
    if (rooms[room] === 0) {
      delete rooms[room]
      delete charactersInRoom[room]
      delete queue[room]
    }

    // emit a message to all players to remove this player
    io.to(room).emit('disconnect', socket.id);
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



  //when a player rolls a dice, update their position on self/others' board, shift the queue & update dice for other players
  socket.on('diceRoll', (rolledNum, charName) => {
    const room = players[socket.id].roomId
    //socket.emit('moveSelfOnBoard', rolledNum);
    io.in(room).emit('moveCharOnBoard', rolledNum, charName)
    io.in(room).emit('unshiftQueue')
    io.to(room).emit('updateDice', rolledNum)
  })

  //when BoardBg first initiates, place the first player in line to tile 0 on all players' boards
  socket.on('placeOnBoard', (rolledNum, charName) => {
    const room = players[socket.id].roomId
    io.in(room).emit('placedOnBoard', rolledNum, charName)
  })

  //update the queue in boardbg scene
  socket.on('changeQueuePrompt', currentPlayer => {
    const room = players[socket.id].roomId
    socket.in(room).emit('changeQueuePrompt', currentPlayer)
  })

  socket.on('startMinigame', () => {
    io.in(players[socket.id].roomId).emit('minigameStarted')
  })

  //update characters in room when a new character is selected
  socket.on('characterSelected', (char, room) => {
    if (charactersInRoom.hasOwnProperty(room)){
      charactersInRoom[room].push(char)
    } else {
      charactersInRoom[room] = [char]
    }
  })

  //if there are already chosen characters in room, disable them from new players' options
  socket.on('disableSelectedChars', room => {
    if (charactersInRoom.hasOwnProperty(room)){
      const selectedChars = charactersInRoom[room]
      socket.emit('disableSelectedChars', selectedChars, room)
    }
  })

  // MINI GAME SOCKETS
  socket.on('currentPlayersMG', () => {
    // console.log("in server/currentPlayerMG")
    // console.log("players", players)
    const room = players[socket.id].roomId;
    socket.emit('currentPlayersMG', players, room);
  })

  socket.on('playerHit', () => {
    console.log('playerHit', playerHitByBombsCount)
    ++playerHitByBombsCount;
    console.log('bodyCount incremented', playerHitByBombsCount)
    const room = players[socket.id].roomId
    io.in(room).emit('updatedPlayersHit', playerHitByBombsCount);
  })

  socket.on('gameOver', () => {
    //tell everyone's client to return to main game
    socket.emit('gameOver');
  })

});

server.listen(PORT, () => {
  console.log(`SERVER Listening on ${server.address().port}`);
});

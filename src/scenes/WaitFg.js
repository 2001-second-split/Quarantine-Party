import Player from "../entity/Player";
import Enemy from "../entity/Enemy";
import { socket } from "../index";

export default class WaitFg extends Phaser.Scene {
  constructor() {
    super("WaitFg");
    //keep track of players and the order of join
    this.queue = []
  }
  preload() {
    this.load.audio("jump", "assets/audio/jump.wav");
  }


  create() {
      // Create game entities
      this.cursors = this.input.keyboard.createCursorKeys();
      // Create sounds
      this.jumpSound = this.sound.add("jump");

      //  << SOCKET THINGS!!! >>
      this.otherPlayers = [];
      // ask the server who current players are
      socket.emit('currentPlayers');

      //get currentPlayers in room and add self and other players
      socket.on('currentPlayers', (players, room, queue) => {
        //Find all the players in the same room
        const playersInRoom = {};
        Object.keys(players).forEach(id => {
          if (players[id].roomId === room) {
            playersInRoom[id] = players[id];
          }
        });

        Object.keys(playersInRoom).forEach(id => {
          if (players[id].playerId === socket.id) {
            this.addPlayer(players[id],socket.id, players[id].name);
          } else {
            this.addOtherPlayers(players[id], id,players[id].name);
          }
        });

        this.queue = queue;
        console.log("waitFG queue", this.queue)
      });

      //add new players as other players
      socket.on('newPlayer', (playerInfo, socketId, spriteSkin) => {
        this.addOtherPlayers(playerInfo, socketId,spriteSkin);
      });

      socket.on('playerMoved', (playerInfo) => {
        this.otherPlayers.forEach(otherPlayer => {
          if (playerInfo.playerId === otherPlayer.playerId) {
            otherPlayer.setPosition(playerInfo.x, playerInfo.y);
          }
        });
      });

      socket.on('disconnect', clientId => {
        this.otherPlayers.forEach(otherPlayer => {
          if(otherPlayer.playerId === clientId){
            otherPlayer.destroy()
          }
        })
      })

      //wait for all four players to join
      // socket.on('playersReady', () => {
      //   //if the current player is the first in que show them start button
      //   if (this.player.name === this.queue[0]){
      //     const startButton = this.add.text(250, 250, 'Start Button', { fontSize: '32px', fill: '#FFF' });
      //     //make the button interactive
      //     startButton.setInteractive();
      //     //when mouse is released, emit transitionToBoard
      //     startButton.on('pointerup', () => {
      //       socket.emit('transitionToBoard')
      //     })
      //   }
      // })

      //on transition to board request switch to board scene and pass the player que to it
      socket.on('transitionedToBoard', () => {
        this.scene.stop('WaitFg')
        this.scene.stop('WaitBg')
        this.scene.stop('WaitScene')
        this.scene.start('BoardScene', {queue: this.queue, player: this.player, otherPlayers: this.otherPlayers})
      })


      // socket.on('otherPlayerMoved', (cursors) => {
      //   this.otherPlayers.forEach(player => {
      //     console.log('OHTERPLAYERMOVED')
      //     console.log('CURSORS', cursors)
      //     player.moved = true
      //     player.cursors = cursors
      //   })
      // })

  }

  createAnimations(name) {
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers(name, { start: 6, end: 8}),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "idle",
      frames: [{key: name, frame: 0}],
      frameRate: 20
    })
    this.anims.create({
      key: "jump",
      frames:[{key: name, frame: 3}],
      frameRate: 20
    })
  }


  // SOCKET RELATED FUNCTIONS
  addPlayer(playerInfo, socketId, spriteSkin) {
    this.player = new Player(this, playerInfo.x, playerInfo.y, spriteSkin).setScale(0.5);
    this.player.playerId = socketId
    this.player.name = spriteSkin
    //add the newly created player to que (to keep track of player turns)
    this.queue.push(this.player.name)
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    this.createAnimations(this.player.name);
    // this.physics.add(this.ground, this.player);
  }
  addOtherPlayers(playerInfo, socketId, spriteSkin) {
    const otherPlayer = new Player(this, playerInfo.x, playerInfo.y, spriteSkin ).setScale(0.5);
    otherPlayer.playerId = socketId;
    otherPlayer.name = spriteSkin
     //add the newly created player to que (to keep track of player turns)
    this.queue.push(otherPlayer.name)
    otherPlayer.setCollideWorldBounds(true);
    otherPlayer.setBounce(0.2)
    // this.physics.add(this.ground, otherPlayer);
    this.otherPlayers.push(otherPlayer);
  }

  update(time, delta) {
    //only when the player is created, update it with cursors
    if (typeof this.player !== 'undefined'){
      this.player.update(this.cursors)
    }
  }

}

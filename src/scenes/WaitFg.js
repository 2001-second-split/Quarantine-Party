import Player from "../entity/Player";
import Enemy from "../entity/Enemy";
import { socket } from "../index";

export default class WaitFg extends Phaser.Scene {
  constructor() {
    super("WaitFg");
  }
  preload() {
    this.load.image("platform", "assets/sprites/platform.png");
    // << LOAD SOUNDS HERE >>
    this.load.audio("jump", "assets/audio/jump.wav");
  }


  create() {
      // Create game entities
      this.cursors = this.input.keyboard.createCursorKeys();
      //create ground
      this.ground = this.physics.add.staticGroup();
      this.ground.create(400, 600, "platform").setScale(2).refreshBody();
      // Create sounds
      this.jumpSound = this.sound.add("jump");

      //  << SOCKET THINGS!!! >>

      this.otherPlayers = [];

      // ask the server who current players are
    socket.emit("currentPlayers");

      //get currentPlayers in room and add self and other players
      socket.on("currentPlayers", (players, room) => {
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
      });

      //add new players as other players
      socket.on("newPlayer", (playerInfo, socketId, spriteSkin) => {
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
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    this.createAnimations(this.player.name);
    // this.physics.add(this.ground, this.player);
  }
  addOtherPlayers(playerInfo, socketId, spriteSkin) {
    const otherPlayer = new Player(this, playerInfo.x, playerInfo.y, spriteSkin ).setScale(0.5);
    otherPlayer.playerId = socketId;
    otherPlayer.name = spriteSkin
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

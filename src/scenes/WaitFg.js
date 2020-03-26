import Player from "../entity/Player"
import Enemy from "../entity/Enemy";
import {socket} from "../index"

export default class WaitFg extends Phaser.Scene {
  constructor() {
    super("WaitFg");
  }
  preload() {
    // << LOAD SPRITES HERE >>
    this.load.spritesheet("tiffany", "assets/spriteSheets/tiffany-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
    });
    // LOAD AYSE SPRITE
    this.load.spritesheet("stephanie", "assets/spriteSheets/stephanie-sheet.png", {
      frameWidth: 300,
      frameHeight: 300});

    this.load.image("platform", "assets/sprites/platform.png");
    // << LOAD SOUNDS HERE >>
    this.load.audio("jump", "assets/audio/jump.wav");
  }

  create() {
    // Create the animations during the FgScene’s create phase
    this.createAnimations();
    this.cursors = this.input.keyboard.createCursorKeys();
    //create ground
    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 600, "platform").setScale(2).refreshBody();
    // Create sounds
    this.jumpSound = this.sound.add("jump");

    //  << SOCKET THINGS!!! >>

    this.otherPlayers = []

    // ask the server who current players are
    socket.emit("currentPlayers");


    //get currentPlayers in room and add self and other players
    socket.on("currentPlayers", (players, room) => {
      //Find all the players in the same room
      const playersInRoom = {}
      Object.keys(players).forEach(id => {
        if(players[id].roomId === room){
          playersInRoom[id] = players[id]
        }
      })

      Object.keys(playersInRoom).forEach(id => {
        if(players[id].playerId === socket.id){
          this.addPlayer(players[id], socket.id)
        }else {
          this.addOtherPlayers(players[id], id)
        }
      })
    })

    //add new players as other players
    socket.on("newPlayer", (playerInfo, socketId) => {
      console.log("NEW PLAYER HAS JOINED")
      this.addOtherPlayers(playerInfo, socketId)
    })

    socket.on('playerMoved', (playerInfo) => {
      this.otherPlayers.forEach(otherPlayer => {
        console.log('OP ID', otherPlayer.playerId)
        console.log('PLAYERINFO', playerInfo.playerId)
        if (playerInfo.playerId === otherPlayer.playerId) {
          console.log('OTHER PLAYER INSIDE IF')
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });
  }

  // SOCKET RELATED FUNCTIONS
  addPlayer(playerInfo, socketId){
    this.player = new Player(this, playerInfo.x, playerInfo.y, "stephanie").setScale(0.5);
    this.player.playerId = socketId
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    //this.physics.add(this.ground, this.player)

  }

  createAnimations() {
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("stephanie", { start: 6, end: 8}),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "idle",
      frames: [{key: "stephanie", frame: 0}],
      frameRate: 20
    })
    this.anims.create({
      key: "jump",
      frames:[{key: "stephanie", frame: 3}],
      frameRate: 20
    })
  }

  addOtherPlayers(playerInfo, socketId){
    const otherPlayer = new Player(this, playerInfo.x, playerInfo.y, "tiffany")
    otherPlayer.playerId = socketId
    otherPlayer.setCollideWorldBounds(true);
    otherPlayer.setBounce(0.2);
    //this.physics.add(this.ground, otherPlayer)
    this.otherPlayers.push(otherPlayer)
  }

  update(time, delta) {
    //only when the player is created, update it with cursors
    if (typeof this.player !== 'undefined'){
      this.player.update(this.cursors)
    }
  }
}

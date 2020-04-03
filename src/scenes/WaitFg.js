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
    this.load.audio("footstep", "assets/audio/single-footstep.mp3")
  }


  create() {
      // Create game entities
      this.cursors = this.input.keyboard.createCursorKeys();
      // Create sounds
      this.jumpSound = this.sound.add("jump");
      this.walkSound = this.sound.add("footstep")

      //  << SOCKET THINGS!!! >>
      this.otherPlayers = [];
      // ask the server who current players are
      socket.emit("currentPlayersInRoom");

      //get currentPlayers in room and add self and other players
      socket.on("currentPlayersInRoom", (playersInRoom, room, queue) => {

        console.log("WaitFG - currentPlayersInRoom", playersInRoom)
        //Find all the players in the same room
        // const playersInRoom = {};
        // Object.keys(players).forEach(id => {
        //   if (players[id].roomId === room) {
        //     playersInRoom[id] = players[id];
        //   }
        // });

        Object.keys(playersInRoom).forEach(id => {
          console.log("in playersInRoom Loop")
          // Note: playersInRoom[id] gives you the entire player object
          if (id === socket.id) {
            this.addPlayer(playersInRoom[id], socket.id, playersInRoom[id].name);
          } else {
            this.addOtherPlayers(playersInRoom[id], id, playersInRoom[id].name);
          }
        });

        this.queue = queue;
        console.log("waitFG queue", this.queue)
      });

      //add new players as other players
      socket.on("newPlayer", (playerInfo, socketId, spriteSkin) => {
        console.log("WaitFG - newPlayer socket")
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

      //on transition to board request switch to board scene and pass the player que to it
      socket.on('transitionedToBoard', () => {
        this.scene.stop('WaitFg')
        this.scene.stop('WaitBg')
        this.scene.stop('WaitScene')
        const data1 = {
          queue: this.queue,
          player: this.player,
          otherPlayers: this.otherPlayers
        }
        console.log("WaitFG Data created - ", data1)
        this.scene.start('BoardScene', data1)
      })


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
      this.player.update(this.cursors, this.jumpSound, this.walkSound)
    }
  }

}

import Player from "../entity/Player";
import Enemy from "../entity/Enemy";
import { socket } from "../index";
export default class WaitFg extends Phaser.Scene {
  constructor() {
    super("WaitFg");

  }


  preload() {
    // << LOAD SPRITES HERE >>

    this.load.spritesheet("ayse", "assets/spriteSheets/ayse-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });
    this.load.spritesheet(
      "stephanie",
      "assets/spriteSheets/stephanie-sheet.png",
      {
        frameWidth: 300,
        frameHeight: 300,
        endFrame: 8
      }
    );

    this.load.spritesheet("tiffany", "assets/spriteSheets/tiffany-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });
    this.load.spritesheet("patty", "assets/spriteSheets/patty-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });

    this.load.image("platform", "assets/sprites/platform.png");
    // << LOAD SOUNDS HERE >>
    this.load.audio("jump", "assets/audio/jump.wav");
  }

  createAnimations() {
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("stephanie", {
        start: 17,
        end: 20
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "jump",
      frames: [{ key: "stephanie", frame: 17 }],
      frameRate: 20
    });
    this.anims.create({
      key: "idleUnarmed",
      frames: [{ key: "stephanie", frame: 11 }],
      frameRate: 10
    });
    this.anims.create({
      key: "idleArmed",
      frames: [{ key: "stephanie", frame: 6 }],
      frameRate: 10
    });
  }


  create() {
    let spriteOptions = [];

    spriteOptions.push(this.add.sprite(100, 400, "ayse").setScale(0.8));
    spriteOptions.push(this.add.sprite(270, 400, "stephanie").setScale(0.8));
    spriteOptions.push(this.add.sprite(450, 400, "tiffany").setScale(0.8));
    spriteOptions.push(this.add.sprite(650, 400, "patty").setScale(0.8));

    let totalOptions = spriteOptions.length;
    let selectedSprite = 0;
    spriteOptions.forEach(function(sprite) {
      sprite
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {console.log(sprite)});
    });



    // Create game entities
    // << START CREATE GAME ENTITIES HERE >>

    this.createAnimations();
    this.cursors = this.input.keyboard.createCursorKeys();
    //create ground
    this.ground = this.physics.add.staticGroup();
    this.ground
      .create(400, 600, "platform")
      .setScale(2)
      .refreshBody();
    // Create sounds
    this.jumpSound = this.sound.add("jump");
    // Create collisions for all entities
    // this.physics.add.collider(this.player, this.ground)
    // this.physics.add.collider(this.enemy, this.ground)
    // this.physics.add.collider(this.player, this.enemy)
    // << END CREATE GAME ENTITIES HERE >>
    //  << SOCKET THINGS!!! >>
    this.socket = socket;
    //AYSE EDIT
    //this.otherPlayers = this.physics.add.group();
    this.otherPlayers = [];
    //console.log(“in waitFG”)
    // ask the server who current players are
    this.socket.emit("currentPlayers");
    //get currentPlayers in room and add self and other players
    this.socket.on("currentPlayers", (players, room) => {
      //Find all the players in the same room
      const playersInRoom = {};
      Object.keys(players).forEach(id => {
        if (players[id].roomId === room) {
          playersInRoom[id] = players[id];
        }
      });
      // console.log(‘Players in room’, playersInRoom)
      // console.log(‘ROOM’, room)
      // console.log(‘CURRENT PLAYERS: ’, players)
      // console.log(‘CURRENT PLAYERS IN ROOM: ’, playersInRoom)
      // console.log(‘players in room empty until we subscribe’)
      Object.keys(playersInRoom).forEach(id => {
        if (players[id].playerId === this.socket.id) {
          this.addPlayer(players[id]);
        } else {
          this.addOtherPlayers(players[id]);
        }
      });
    });
    //add new players as other players
    this.socket.on("newPlayer", playerInfo => {
      console.log("NEW PLAYER HAS JOINED");
      this.addOtherPlayers(playerInfo);
    });
    /*
    we want to have subscribe after the listeners are
    created (above) but now we have to figure out how to
    pass it roomId...
    commented out until we find out how
    */
    // this.socket.emit(‘subscribe’, roomId.value)
  }
  // update(time, delta) {
  //   // << DO UPDATE LOGIC HERE >>
  //   // this.player.update(this.cursors, this.jumpSound); // Add a parameter for the jumpSound
  // }
  // SOCKET RELATED FUNCTIONS

  addPlayer(playerInfo) {
    this.player = new Player(
      this,
      playerInfo.x,
      playerInfo.y,
      "stephanie"
    ).setScale(0.5);
    this.player.setCollideWorldBounds(true);
    this.physics.add(this.ground, this.player);
  }
  addOtherPlayers(playerInfo) {
    const otherPlayer = new Player(this, playerInfo.x, playerInfo.y, "ayse");
    otherPlayer.setCollideWorldBounds(true);
    this.physics.add(this.ground, otherPlayer);
    this.otherPlayers.push(otherPlayer);
    // const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, ‘josh’).setOrigin(0.5, 0.5).setScale(0.5);
    // otherPlayer.playerId = playerInfo.playerId;
    //this.otherPlayers.add(otherPlayer)
  }
}

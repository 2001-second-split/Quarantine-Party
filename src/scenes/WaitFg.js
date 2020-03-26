import Player from '../entity/Player'
import Enemy from '../entity/Enemy';

import {socket} from '../index'
import io from 'socket.io-client';

export default class WaitFg extends Phaser.Scene {
  constructor() {
    super('WaitFg');

  }

  preload() {

    // << LOAD SPRITES HERE >>
    this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {
      frameWidth: 340,
      frameHeight: 460,
    });
    // LOAD AYSE SPRITE
    this.load.spritesheet('stephanie', 'assets/spriteSheets/step-sheet.png', {
      frameWidth: 300,
      frameHeight: 300    });
    this.load.image('steph', 'assets/sprites/steph.png');
    this.load.image('platform', 'assets/sprites/platform.png');

    // << LOAD SOUNDS HERE >>
    this.load.audio('jump', 'assets/audio/jump.wav');

  }

  createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('josh', { start: 17, end: 20 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'jump',
      frames: [{ key: 'josh', frame: 17 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'idleUnarmed',
      frames: [{ key: 'josh', frame: 11 }],
      frameRate: 10,
    });
    this.anims.create({
      key: 'idleArmed',
      frames: [{ key: 'josh', frame: 6 }],
      frameRate: 10,
    });
  }

  create() {
    // Create game entities
    // << START CREATE GAME ENTITIES HERE >>

    // this.player = new Player(this, 50, 400, 'josh').setScale(0.25);
    // this.enemy = new Enemy(this, 600, 400, 'steph').setScale(2);
    // const stepSprite = this.add.sprite(200,510,"stephanie").setScale(0.5)
    // this.player.setBounce(0.2);
    // this.player.setCollideWorldBounds(true);
    // this.enemy.setCollideWorldBounds(true);

    // Create the animations during the FgScene's create phase
    this.createAnimations();

    this.cursors = this.input.keyboard.createCursorKeys();

    //create ground
    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 600, 'platform').setScale(2).refreshBody();

    // Create sounds
    this.jumpSound = this.sound.add('jump');


    // Create collisions for all entities
    // this.physics.add.collider(this.player, this.ground)
    // this.physics.add.collider(this.enemy, this.ground)
    // this.physics.add.collider(this.player, this.enemy)

    // << END CREATE GAME ENTITIES HERE >>



    //  << SOCKET THINGS!!! >>
    const self = this;
    this.socket = socket;
    this.otherPlayers = this.physics.add.group();

    // console.log('SOCKET', this.socket)


    // // ONCE A CLIENT JOINS A ROOM
    // this.socket.on('connect', function(){
    //   console.log("client - connected");

      // self.input.keyboard.on('keydown_W', function() {
      //   self.socket.emit('testKey')
      // });




      //get currentPlayers in room and add self and other players
      self.socket.on('currentPlayers', function (players, room) {

        console.log('CURRENT PLAYER')
        console.log('players in room:', players)
        const playersInRoom = Object.keys(players).filter(id => {
          players[id].roomId === room
        })
        Object.keys(playersInRoom).forEach(id => {
          if(players[id].playerId === this.socket.id){
            self.addPlayer(players[id])
          } else {
            self.addOtherPlayers(players[id])
          }
        })
      })

      //add new players as other players
      self.socket.on('newPlayer', function (playerInfo) {
        console.log('NEW PLAYER')
        self.addOtherPlayers(playerInfo)
      })

      self.socket.on('disconnect', function (playerId) {
        console.log("client - disconnected")

        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
          if (playerId === otherPlayer.playerId) {
            otherPlayer.destroy();
          }
        });
      });

      // this.socket.emit('subscribe', roomId.value)
      this.socket.emit('currentPlayers');


    // });

    //end create
  }

  // update(time, delta) {
  //   // << DO UPDATE LOGIC HERE >>
  //   // this.player.update(this.cursors, this.jumpSound); // Add a parameter for the jumpSound
  // }

  // SOCKET RELATED FUNCTIONS

  addPlayer(self, playerInfo){
    self.player = new Player(this, playerInfo.x, playerInfo.y, 'josh').setScale(0.25);
    self.player.setCollideWorldBounds(true);
  }

  addOtherPlayers(self, playerInfo){
    const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'josh').setOrigin(0.5, 0.5).setScale(0.5);
    otherPlayer.playerId = playerInfo.playerId;

    self.otherPlayers.add(otherPlayer)
  }


}

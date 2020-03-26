import Player from '../entity/Player'
import Enemy from '../entity/Enemy';

import {socket} from '../index'

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
    // LOAD STEPHANIE SPRITE
    this.load.spritesheet('stephanie', 'assets/spriteSheets/stephanie-sheet.png', {
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

    this.socket = socket;

    this.otherPlayers = this.physics.add.group();

    console.log("in waitFG")

    // ask the server who current players are
    this.socket.emit('currentPlayers');


    //get currentPlayers in room and add self and other players
    this.socket.on('currentPlayers', (players, room) => {

      const playersInRoom = Object.keys(players).filter(id => {
        players[id].roomId === room
      })

      console.log('CURRENT PLAYERS: ', players)
      console.log('CURRENT PLAYERS IN ROOM: ', playersInRoom)
      console.log('players in room empty until we subscribe')

      Object.keys(playersInRoom).forEach(id => {
        if(players[id].playerId === this.socket.id){
          this.addPlayer(players[id])
        } else {
          this.addOtherPlayers(players[id])
        }
      })
    })

    //add new players as other players
    this.socket.on('newPlayer', playerInfo => {
      console.log('NEW PLAYER HAS JOINED')
      this.addOtherPlayers(playerInfo)
    })

    /*
    we want to have subscribe after the listeners are
    created (above) but now we have to figure out how to
    pass it roomId...
    commented out until we find out how
    */

    // this.socket.emit('subscribe', roomId.value)

  }

  // update(time, delta) {
  //   // << DO UPDATE LOGIC HERE >>
  //   // this.player.update(this.cursors, this.jumpSound); // Add a parameter for the jumpSound
  // }

  // SOCKET RELATED FUNCTIONS

  addPlayer(playerInfo){
    this.player = new Player(this, playerInfo.x, playerInfo.y, 'josh').setScale(0.25);
    this.player.setCollideWorldBounds(true);
  }

  addOtherPlayers(playerInfo){
    const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'josh').setOrigin(0.5, 0.5).setScale(0.5);
    otherPlayer.playerId = playerInfo.playerId;

    this.otherPlayers.add(otherPlayer)
  }


}

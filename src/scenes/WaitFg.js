import Player from '../entity/Player'
import Ground from '../entity/Ground'
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
    // this.anims.create({
    //   key: 'idleArmed',
    //   frames: [{ key: 'josh', frame: 6 }],
    //   frameRate: 10,
    // });
  }

  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>
    //this.player = new Player(this, 50, 400, 'josh').setScale(0.25);
    this.otherPlayers = this.physics.add.group();
    //this.enemy = new Enemy(this, 600, 400, 'steph').setScale(2);

    // this.player.setBounce(0.2);
    // this.player.setCollideWorldBounds(true);
    //this.enemy.setCollideWorldBounds(true);

    // Create the animations during the FgScene's create phase
    this.socket = socket;
    console.log('SCOKET', this.socket)
    //get currentPlayers in room and add self and other players
    this.socket.on('currentPlayers', (players, room) => {
      console.log('CURRENT PLAYER')
      const playersInRoom = Object.keys(players).filter(id => {
        players[id].roomId === room
      })
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
      console.log('NEW PLAYER')
      this.addOtherPlayers(playerInfo)
    })

    this.createAnimations();

    this.cursors = this.input.keyboard.createCursorKeys();

    //create ground
    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 600, 'platform').setScale(2).refreshBody();

    // Create sounds
    this.jumpSound = this.sound.add('jump');


    // Create collisions for all entities
    this.physics.add.collider(this.player, this.ground)
    this.physics.add.collider(this.enemy, this.ground)
    this.physics.add.collider(this.player, this.enemy)

  }

  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    //this.player.update(this.cursors, this.jumpSound); // Add a parameter for the jumpSound
  }

  addPlayer(playerInfo){
    this.player = new Player(this, playerInfo.x, playerInfo.y, 'josh').setScale(0.25);
  }

  addOtherPlayers(playerInfo){
    const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5);
    otherPlayer.playerId = playerInfo.playerId;
    this.otherPlayers.add(otherPlayer)
  }

}

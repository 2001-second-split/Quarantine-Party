import Player from '../entity/Player'
import Ground from '../entity/Ground'
import Enemy from '../entity/Enemy';


export default class WaitFg extends Phaser.Scene {
  constructor() {
    super('WaitFg');
    // this.addPlayer = this.addPlayer.bind(this)
    // this.addOtherPlayers = this.addOtherPlayers.bind(this)
  }

  preload() {
    // << LOAD SPRITES HERE >>
    this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {
      frameWidth: 340,
      frameHeight: 460,
    });

    this.load.image('platform', 'assets/sprites/platform.png');

    this.load.image('ground', 'assets/sprites/ground.png');

    // << LOAD SOUNDS HERE >>
    this.load.audio('jump', 'assets/audio/jump.wav');

  }

  // createAnimations() {
  //   this.anims.create({
  //     key: 'run',
  //     frames: this.anims.generateFrameNumbers('josh', { start: 17, end: 20 }),
  //     frameRate: 10,
  //     repeat: -1,
  //   });
  //   this.anims.create({
  //     key: 'jump',
  //     frames: [{ key: 'josh', frame: 17 }],
  //     frameRate: 20,
  //   });
  //   this.anims.create({
  //     key: 'idleUnarmed',
  //     frames: [{ key: 'josh', frame: 11 }],
  //     frameRate: 10,
  //   });
  //   // this.anims.create({
  //   //   key: 'idleArmed',
  //   //   frames: [{ key: 'josh', frame: 6 }],
  //   //   frameRate: 10,
  //   // });
  // }

  create() {
    //this.socket = socket;
    //this.otherPlayers = this.add.group()
    this.platform = this.physics.add.staticGroup();
    this.platform.create(300, 300, 'platform').setScale(0.35);
    this.player = new Player(this, 50, 400, 'josh').setScale(0.25);
    this.enemy = new Enemy(this, 600, 400, 'steph').setScale(2);
    //const stepSprite = this.add.sprite(200,510,"stephanie").setScale(0.5)
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.enemy.setCollideWorldBounds(true);
  }



      // console.log('CURRENT PLAYER FE')
      // const playersInRoom = Object.keys(players).filter(id => {
      //   players[id].roomId === room
      // })
      // Object.keys(playersInRoom).forEach(id => {
      //   if(players[id].playerId === this.socket.id){
      //     this.addPlayer(players[id])
      //   } else {
      //     this.addOtherPlayers(players[id])
      //   }
      // })
    //})
  //   //add new players as other players
  //   this.socket.on('newPlayer', playerInfo => {
  //     console.log('NEW PLAYER')
  //     this.addOtherPlayers(playerInfo)
  //     console.log('OTHER PLAYERS', this.otherPlayers)
  //   })
  // }

  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    //this.player.update(this.cursors, this.jumpSound); // Add a parameter for the jumpSound

  }

  // addPlayer(playerInfo){
  //   this.player = new Player(this, playerInfo.x, playerInfo.y, 'josh').setScale(0.25);
  // }

  // addOtherPlayers(playerInfo){
  //   let otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'ayse').setScale(0.5);
  //   otherPlayer.playerId = playerInfo.playerId;
  //   this.otherPlayers.add(otherPlayer)
  //   console.log('OTHER PLAYERS', this.otherPlayers)
  // }

}

//WAITFG
// import Player from '../entity/Player'
// import Ground from '../entity/Ground'
// import Enemy from '../entity/Enemy';
// //import {socket} from '../index'
// import io from 'socket.io-client';


// const socket = io("http://localhost:3000")

// export default class WaitFg extends Phaser.Scene {
//   constructor() {
//     super('WaitFg');
//     // this.addPlayer = this.addPlayer.bind(this)
//     // this.addOtherPlayers = this.addOtherPlayers.bind(this)
//   }

//   preload() {
//     // << LOAD SPRITES HERE >>
//     this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {
//       frameWidth: 340,
//       frameHeight: 460,
//     });

//     this.load.image('platform', 'assets/sprites/platform.png');

//     this.load.image('ground', 'assets/sprites/ground.png');

//     // << LOAD SOUNDS HERE >>
//     this.load.audio('jump', 'assets/audio/jump.wav');

//   }

//   // createAnimations() {
//   //   this.anims.create({
//   //     key: 'run',
//   //     frames: this.anims.generateFrameNumbers('josh', { start: 17, end: 20 }),
//   //     frameRate: 10,
//   //     repeat: -1,
//   //   });
//   //   this.anims.create({
//   //     key: 'jump',
//   //     frames: [{ key: 'josh', frame: 17 }],
//   //     frameRate: 20,
//   //   });
//   //   this.anims.create({
//   //     key: 'idleUnarmed',
//   //     frames: [{ key: 'josh', frame: 11 }],
//   //     frameRate: 10,
//   //   });
//   //   // this.anims.create({
//   //   //   key: 'idleArmed',
//   //   //   frames: [{ key: 'josh', frame: 6 }],
//   //   //   frameRate: 10,
//   //   // });
//   // }

//   create() {
//     //this.socket = socket;
//     this.otherPlayers = []
//     //this.otherPlayers = this.add.group()
//     this.platform = this.physics.add.staticGroup();
//     this.platform.create(300, 300, 'platform').setScale(0.35);
//     this.player = new Player(this, 50, 400, 'josh').setScale(0.25);
//     this.player.setBounce(0.2);
//     this.player.setCollideWorldBounds(true);
//     console.log('SOCKET', socket)
//     socket.broadcast.emit('newPlayer', this.player)

//     // this.enemy = new Enemy(this, 600, 400, 'steph').setScale(2);
//     // this.enemy.setCollideWorldBounds(true);

//     //const stepSprite = this.add.sprite(200,510,"stephanie").setScale(0.5)
//     socket.on('newPlayer', player => {
//       this.otherPlayers.push(player)
//     //   this.otherPlayers.push(new Player(this, player.x, player.y, 'josh').setScale(0.25))
//     //   this.otherPlayers.forEach(player => {
//     //     player.setCollideWorldBounds(true)
//     //   })
//     //   console.log('OTHER PLAYERS', this.otherPlayers)
//     })
//   }



//       // console.log('CURRENT PLAYER FE')
//       // const playersInRoom = Object.keys(players).filter(id => {
//       //   players[id].roomId === room
//       // })
//       // Object.keys(playersInRoom).forEach(id => {
//       //   if(players[id].playerId === this.socket.id){
//       //     this.addPlayer(players[id])
//       //   } else {
//       //     this.addOtherPlayers(players[id])
//       //   }
//       // })
//     //})
//   //   //add new players as other players
//   //   this.socket.on('newPlayer', playerInfo => {
//   //     console.log('NEW PLAYER')
//   //     this.addOtherPlayers(playerInfo)
//   //     console.log('OTHER PLAYERS', this.otherPlayers)
//   //   })
//   // }

//   update(time, delta) {
//     // << DO UPDATE LOGIC HERE >>
//     //this.player.update(this.cursors, this.jumpSound); // Add a parameter for the jumpSound

//   }

//   // addPlayer(playerInfo){
//   //   this.player = new Player(this, playerInfo.x, playerInfo.y, 'josh').setScale(0.25);
//   // }

//   // addOtherPlayers(playerInfo){
//   //   let otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'ayse').setScale(0.5);
//   //   otherPlayer.playerId = playerInfo.playerId;
//   //   this.otherPlayers.add(otherPlayer)
//   //   console.log('OTHER PLAYERS', this.otherPlayers)
//   // }

// }


//WAIT SCENE
// import 'phaser'
// import {socket} from '../index'

// export default class WaitScene extends Phaser.Scene {
//   constructor() {
//     super('WaitScene');
//     this.socket = socket
//   }

//   create() {
//     // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
//     this.scene.launch('WaitFg');
//     //this.scene.launch('WaitBg');


//     //get currentPlayers in room, and switch to board scene when all four players joined
//     this.socket.on('subscribedPlayers', (clients) => {
//       if(clients.length === 4){
//         this.scene.stop('WaitScene')
//         this.scene.start('BoardScene')
//       }
//     })
//   }
// }


//SERVER
// io.in(room).clients((error, clients) => {
//   if (error) throw error;
//   io.emit('subscribedPlayers', clients)
// });

//MAP
//"data":[67, 0, 0, 0, 0, 0, 0, 0, 66, 0, 0, 0, 68, 0, 66, 0, 0, 0, 0, 66, 0, 0, 0, 0, 68, 0, 66, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 66, 0, 1, 0, 66, 0, 66, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 67, 0, 0, 0],


//BOARDFG
// import Player from '../entity/Player'
// import Ground from '../entity/Ground'
// import Phaser from 'phaser'



// export default class BoardFg extends Phaser.Scene {
//   constructor() {
//     super('BoardFg');

//   }

//   preload() {
//     // Preload Sprites
//     // << LOAD SPRITES HERE >>
//     this.load.spritesheet('ayse', 'assets/spriteSheets/ayse-sheet.png', {
//       frameWidth: 340,
//       frameHeight: 460,
//     });

//     // this.load.spritesheet('ayse', 'assets/spriteSheets/ayse-sprite.png', {
//     //   frameWidth: 2000,
//     //   frameHeight: 2000
//     // })

//     this.load.image('steph', 'assets/sprites/steph.png');
//     this.load.image('ground', 'assets/sprites/platform.png');

//     // Preload Sounds
//     // << LOAD SOUNDS HERE >>
//     this.load.audio('jump', 'assets/audio/jump.wav');
//   }




//   create() {
//     // Create game entities
//     // << CREATE GAME ENTITIES HERE >>

//     // Josh. The player. Our sprite is a little large, so we'll scale it down
//     //this.player = new Player(this, 320, 300, 'ayse').setScale(0.2);
//     //this.player.setCollideWorldBounds(true);

//     // this.steph = new Player(this, 875, 250, 'steph').setScale(1.5);
//     // this.steph.setCollideWorldBounds(true);

//     // Ayse. The player. Scaling it down
//     // const ayseSprite = this.add.sprite(50,50,"ayse").setScale(.1)
//     // this.ayse = new Player(this, 50, 50, 'ayse').setScale(0.1)

//     // platform/ground correlating to tile locations
//     this.platform = this.physics.add.staticGroup();
//     //           .create(x-axis, y-axis, image to use)
//     this.platform.create(375, 450, 'platform').setScale(.1);
//     this.platform.create(500, 375, 'platform').setScale(.1);
//     this.platform.create(625, 425, 'platform').setScale(.1);
//     this.platform.create(755, 375, 'platform').setScale(.1);
//     this.platform.create(875, 300, 'platform').setScale(.1);

//     // Creating Movements

//     // moveUp()
//     // moveDown()
//     // moveLeft()
//     // moveRight()

//     // this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
//     // this.createGround(160, 540);
//     // this.createGround(600, 540);


//     // this.cursors = this.input.keyboard.createCursorKeys()

//     // Create sounds
//     // << CREATE SOUNDS HERE >>
//     this.jumpSound = this.sound.add('jump');


//     // Create collisions for all entities
//     // << CREATE COLLISIONS HERE >>
//     // this.physics.add.collider(this.player, this.groundGroup)
//     //this.physics.add.collider(this.steph, this.platform)
//     this.physics.add.collider(this.player, this.platform)


//     // this.physics.add.overlap(

//     // );


//     //testing scene change
//     // this.input.on('pointerup', function (pointer) { //on click the scene will change
//     //   this.scene.pause('BoardScene')
//     //   this.scene.pause('BoardDice')
//     //   this.scene.start('minigameTPScene');
//     // }, this);

//   }

//   // createGround(x, y) {
//   //   this.groundGroup.create(x, y, 'platform');
//   // }

//   // time: total time elapsed (ms)
//   // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
//   update(time, delta) {
//     // << DO UPDATE LOGIC HERE >>
//     // this.player.update(this.cursors, this.jumpSound); // Add a parameter for the jumpSound

//   }



// }

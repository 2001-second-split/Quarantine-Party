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

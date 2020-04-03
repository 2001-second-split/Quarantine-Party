import { socket } from "../index";
import Align from "../entity/Align";
import Player from '../entity/Player'

export default class minigameTPScene extends Phaser.Scene {
  constructor() {
    super('minigameTPScene');

    this.gameOver = false;

    this.firstPlayerScore = 0;
    this.secondPlayerScore = 0;
    this.thirdPlayerScore = 0;
    this.fourthPlayerScore = 0;

    //this.collectTP = this.collectTP.bind(this);
    //this.hitBomb = this.hitBomb.bind(this);

    this.queue = [];
  }


  preload() {
    this.load.spritesheet("ayse", "assets/spriteSheets/ayse-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });
    this.load.spritesheet("stephanie", "assets/spriteSheets/stephanie-sheet.png", {
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

    this.load.image('sky', 'assets/minigameTP/sky.png');
    this.load.image('platform', 'assets/minigameTP/platform.png');
    this.load.image('tp', 'assets/minigameTP/tp.png');
    this.load.image('bomb', 'assets/minigameTP/bomb.png');
  }

  createAnimations(name) {
    //  Our player animations, turning, walking left and walking right.
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

  create(data) {
    this.player = new Player(this, 100, 400, data.player.name).setScale(0.5)
    this.createAnimations(data.player.name)
    this.otherPlayers = []
    data.otherPlayers.forEach(player => {
      this.otherPlayers.push(new Player(this, 150, 400, player.name).setScale(0.5))
      this.createAnimations(player.name)
    })



    // << LIST ALL THE SOCKETS FIRST >>
    // socket.on('playerMoved', (playerInfo) => {
    //   this.otherPlayersArr.forEach(otherPlayer => {
    //     if (playerInfo.playerId === otherPlayer.playerId) {
    //       otherPlayer.setPosition(playerInfo.x, playerInfo.y);
    //     }
    //   });
    // });

    // socket.on('updatedPlayersHit', (count, totalPlayers) => {
    //   console.log("players bombed", count);

    //   if (count === (totalPlayers-1)) {
    //     // console.log('bodyCount is 3')
    //     this.physics.pause();

    //     // game over text
    //     this.add.text(250, 150, 'Game Over!', { fontSize: '32px', fill: '#FFF' })

    //     socket.emit("gameOver")
    //     return;
    //   }
    // });

    socket.on('gameOverClient', () => {
      console.log("in gameOver socket.on")

      this.scene.stop('minigameTPScene');
      // this.scene.restart();

      this.scene.wake('BoardScene')
      this.scene.wake('BoardBg');
      this.scene.wake('BoardDice')
     })

    // << END SOCKETS >>


    // << SOCKET EMITS NEEDED IN BEGINNING OF GAME >>
    //socket.emit('currentPlayersMG')


    // << GAME ENTITIES >>

    //this.add.image(400, 300, 'sky');

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 800, 'platform').setScale(2).refreshBody();
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.otherPlayers, this.platforms);
    //this.physics.add.collider(this.toiletpaper, this.platforms);



    //  Now let's create some ledges
    // this.platforms.create(600, 400, 'platform');
    // this.platforms.create(50, 250, 'platform');
    // this.platforms.create(750, 220, 'platform');

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();
    // this.jumpSound = this.sound.add("jump");

    //  Some toiletpaper to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    this.toiletpaper = this.physics.add.group({
        key: 'tp',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.toiletpaper.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setCollideWorldBounds(true);
    });

    this.bombs = this.physics.add.group();


     // Return To Game Button
     this.add.text(250, 200, 'Mini Game Under Construction', { fontSize: '32px', fill: '#FFF' });
     const returnButton = this.add.text(250, 250, 'Return To Board', { fontSize: '32px', fill: '#FFF' });
     returnButton.setInteractive();

     //when you click the button
     returnButton.on('pointerup', () => {
      console.log('returnButton pressed')
      socket.emit("gameOver")

     })

  } // end create

  update(){
    this.player.update(this.cursors)
  }

}

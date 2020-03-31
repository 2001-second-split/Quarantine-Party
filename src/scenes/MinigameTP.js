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

    this.collectTP = this.collectTP.bind(this);
    this.hitBomb = this.hitBomb.bind(this);
  }

  // init(data) {
  //   console.log("data in init", data)
  //   const queue = data.queue;
  //   console.log(queue)
  //   this.bodyCount = 0;
  // }

  preload() {
    this.load.spritesheet("ayse", "/public/assets/spriteSheets/ayse-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });
    this.load.spritesheet("stephanie", "/public/assets/spriteSheets/stephanie-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
      }
    );
    this.load.spritesheet("tiffany", "/public/assets/spriteSheets/tiffany-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });
    this.load.spritesheet("patty", "/public/assets/spriteSheets/patty-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });
    this.load.path = '/public/assets/minigameTP/'
    this.load.image('sky', 'sky.png');
    this.load.image('platform', 'platform.png');
    this.load.image('tp', 'tp.png');
    this.load.image('bomb', 'bomb.png');
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
    // const data = this.scene.settings.data;
    // console.log("data in create", data)


    // << LIST ALL THE SOCKETS FIRST >>
    socket.on('currentPlayersMG', (players, room) => {
      const playersInRoom = {};

      Object.keys(players).forEach(id => {
        if (players[id].roomId === room) {
          playersInRoom[id] = players[id];
        }
      });

      Object.keys(playersInRoom).forEach(id => {
        if (players[id].playerId === socket.id) {
          this.addPlayer(players[id],socket.id, players[id].name);
        } else {
          this.addOtherPlayers(players[id], id,players[id].name);
        }
      });

    });

    this.otherPlayersArr = [];

    socket.on('playerMoved', (playerInfo) => {
      this.otherPlayersArr.forEach(otherPlayer => {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });

    socket.on('updatedPlayersHit', (count) => {
      console.log("received updatedBodyCount", count);

      if (count === 2) {
        console.log('bodyCount is 2')
        this.physics.pause();

        // game over text
        this.add.text(250, 150, 'Game Over!', { fontSize: '32px', fill: '#FFF' })

        socket.emit("gameOver")
        return;
      }
    });

     socket.on('gameOver', () => {
       console.log("in gameOver socket.on")

      //  this.scene.stop('MinigameTPScene');

       this.scene.wake('BoardBg');
       this.scene.wake('BoardDice')
     })

    // << END SOCKETS >>

    // EMIT NECESSARY REQUESTS TO SERVER
    socket.emit('currentPlayersMG')

    // << GAME ENTITIES >>

    this.add.image(400, 300, 'sky');

    this.platforms = this.physics.add.staticGroup();
    // this.platforms.create(400, 800, 'platform').setScale(2).refreshBody();

    //  Now let's create some ledges
    // this.platforms.create(600, 400, 'platform');
    // this.platforms.create(50, 250, 'platform');
    // this.platforms.create(750, 220, 'platform');

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

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

    //  The score
    this.p1scoreText = this.add.text(16, 16, `Player 1: 0`, { fontSize: '16px', fill: '#000' });
    this.p2scoreText = this.add.text(166, 16, `Player 2: 0`, { fontSize: '16px', fill: '#000' });
    this.p3scoreText = this.add.text(316, 16, `Player 3: 0`, { fontSize: '16px', fill: '#000' });
    this.p4scoreText = this.add.text(466, 16, `Player 4: 0`, { fontSize: '16px', fill: '#000' });
    // this.p4scoreText = this.add.text(466, 16, `${data.queue[3]}: 0`, { fontSize: '16px', fill: '#000' });

    // physics things
    this.physics.add.collider(this.toiletpaper, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    //  Checks to see if the player overlaps with any of the toiletpaper, if he does call the collectTP function
    // this.physics.add.overlap(this.player, this.toiletpaper, this.collectTP, null, this);
    // this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);


     // Return To Game Button
     const returnButton = this.add.text(250, 250, 'Return Button', { fontSize: '32px', fill: '#FFF' });
     returnButton.setInteractive();

     returnButton.on('pointerup', () => {
       console.log('returnButton pressed')
       this.scene.stop('minigameTPScene')

       //this.scene.wake('BoardScene')
       this.scene.wake('BoardBg');
       this.scene.wake('BoardDice')

     })



  } // end create

  // SOCKET RELATED FUNCTIONS
  addPlayer(playerInfo, socketId, spriteSkin) {
    //create player entity to show in minigame scene
    this.player = new Player(this, playerInfo.x, playerInfo.y, spriteSkin).setScale(0.5);
    this.player.playerId = socketId
    this.player.name = spriteSkin
    this.createAnimations(spriteSkin);

    //character physics
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.toiletpaper, this.collectTP.bind(this), null, this);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb.bind(this), null, this);

    return this.player;
  }

  addOtherPlayers(playerInfo, socketId, spriteSkin) {
    //create other player entities
    const otherPlayer = new Player(this, playerInfo.x, playerInfo.y, spriteSkin ).setScale(0.5);
    otherPlayer.playerId = socketId;
    otherPlayer.name = spriteSkin;

    this.otherPlayersArr.push(otherPlayer);

    otherPlayer.setCollideWorldBounds(true);
    otherPlayer.setBounce(0.2)
    // this.physics.add.collider(otherPlayer, this.platforms);

    return otherPlayer;

  }

  update () {

    // if player exists, update the player whenever they move
    if (typeof this.player !== 'undefined'){
      this.player.update(this.cursors)
    }
  }

  collectTP(player, toiletpaper) {
    toiletpaper.disableBody(true, true);

    //  Add and update the score
    this.firstPlayerScore += 10;
    this.p1scoreText.setText(`Player: ${this.firstPlayerScore}`);

    if (this.toiletpaper.countActive(true) === 0) {
      //  A new batch of toiletpaper to collect
      this.toiletpaper.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
      });

      let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      this.bomb = this.bombs.create(x, 16, 'bomb');
      this.bomb.setBounce(1);
      this.bomb.setCollideWorldBounds(true);
      this.bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      this.bomb.allowGravity = false;
    }
  }

  hitBomb (player, bomb) {
    this.bomb.destroy()
    this.player.disableBody(true, true);
    socket.emit('playerHit')
    // this.p1scoreText.setText(`Player: BOMBED`);
    this.add.text(250, 300, 'You ran into the bomb!!', { fontSize: '24px', fill: '#FFF' })
  }
}

import { socket } from "../index";
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
    console.log("data in miniGameTP", data)


    // << SOCKET THINGS >>
    this.otherPlayersArr = [];
    socket.emit('currentPlayersMG')

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

    socket.on('playerMoved', (playerInfo) => {
      this.otherPlayersArr.forEach(otherPlayer => {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });
    // << END SOCKETS >>


    // << GAME ENTITIES >>

    this.add.image(400, 300, 'sky');

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 800, 'platform').setScale(2).refreshBody();

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
    this.p1scoreText = this.add.text(16, 16, `${data.queue[0]}: 0`, { fontSize: '16px', fill: '#000' });
    this.p2scoreText = this.add.text(166, 16, `${data.queue[1]}: 0`, { fontSize: '16px', fill: '#000' });
    this.p3scoreText = this.add.text(316, 16, `${data.queue[2]}: 0`, { fontSize: '16px', fill: '#000' });
    this.p4scoreText = this.add.text(466, 16, `${data.queue[3]}: 0`, { fontSize: '16px', fill: '#000' });

    // physics things
    // this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.toiletpaper, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    //  Checks to see if the player overlaps with any of the toiletpaper, if he does call the collectTP function
    // this.physics.add.overlap(this.player, this.toiletpaper, this.collectTP, null, this);
    // this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);


    //AYSE ADDITION TO CHECK GAME STATE
     //create a "start button" but this is actually just text for now
     const returnButton = this.add.text(250, 250, 'Return Button', { fontSize: '32px', fill: '#FFF' });

     //make it interactive! so when we click it...
     returnButton.setInteractive();

     // when we release the mouse, it'll log a message and change scenes
     returnButton.on('pointerup', () => {
       console.log('returnbutton pressed')
       this.scene.stop('minigameTPScene')

       this.scene.wake('BoardScene')
       this.scene.wake('BoardBg');
       this.scene.wake('BoardDice')

     })


  }

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
    if (this.gameOver) {
      // return;
      this.scene.stop('MinigameTPScene');

      this.scene.wake('BoardBg');
      this.scene.wake('BoardDice')
      // this.gameOver = false;
  }

    if (typeof this.player !== 'undefined'){
      this.player.update(this.cursors)
    }
  }

  collectTP(player, toiletpaper) {
    toiletpaper.disableBody(true, true);

    //  Add and update the score
    this.firstPlayerScore += 10;
    this.p1scoreText.setText(`${this.scene.settings.data.queue[0]}: ${this.firstPlayerScore}`);

    if (this.toiletpaper.countActive(true) === 0)
    {
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
    // this.physics.pause();
    // this.player.visible = false
    this.bomb.destroy()
    this.player.disableBody(true, true);
    // this.player.setActive(false)
    // this.player.anims.play('turn');
    // this.gameOver = true;
  }
}

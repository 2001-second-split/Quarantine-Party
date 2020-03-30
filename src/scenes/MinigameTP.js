import { socket } from "../index";

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

  createAnimations() {
    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(`${this.scene.settings.data.player.name}`, { start: 4, end: 6 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'turn',
      frames: [ { key: `${this.scene.settings.data.player.name}`, frame: 0 } ],
      frameRate: 20
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(`${this.scene.settings.data.player.name}`, { start: 1, end: 3 }),
      frameRate: 5,
      repeat: -1
    });
    // this.anims.create({
    //   key: '2standing',
    //   frames: [ { key: `${this.scene.settings.data.second}`, frame: 0 } ],
    //   frameRate: 20
    // });
  }

  create() {
    console.log(this.scene.settings.data.player.name, "data")

    // socket.emit('currentPlayers')

    // socket.on('currentPlayers', (players, room) => {
    //   console.log(players)
    //   Object.keys(players).forEach(function (id) {
    //     if (players[id].playerId === self.socket.id) {
    //       addPlayer(self, players[id]);
    //     } else {
    //       addOtherPlayers(self, players[id]);
    //     }
    //   });
    // });

    this.add.image(400, 300, 'sky');

    this.platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    this.platforms.create(600, 1000, 'platform').setScale(3).refreshBody();

    //  Now let's create some ledges
    // this.platforms.create(600, 400, 'platform');
    // this.platforms.create(50, 250, 'platform');
    // this.platforms.create(750, 220, 'platform');

    // The player and its settings
    this.player = this.physics.add.sprite(100, 450, `${this.scene.settings.data.player.name}`).setScale(0.25);

    // this.otherPlayer = this.physics.add.sprite(250, 450, `${this.scene.settings.data.second}`).setScale(0.25);
    // this.physics.add.sprite(400, 450, `${this.scene.settings.data.third}`).setScale(0.25);
    // this.physics.add.sprite(550, 450, `${this.scene.settings.data.fourth}`).setScale(0.25);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    // this.otherPlayer.setCollideWorldBounds(true);

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
    this.p1scoreText = this.add.text(16, 16, `${this.scene.settings.data.first}: 0`, { fontSize: '16px', fill: '#000' });
    this.p2scoreText = this.add.text(166, 16, `${this.scene.settings.data.second}: 0`, { fontSize: '16px', fill: '#000' });
    this.p3scoreText = this.add.text(316, 16, `${this.scene.settings.data.third}: 0`, { fontSize: '16px', fill: '#000' });
    this.p4scoreText = this.add.text(466, 16, `${this.scene.settings.data.fourth}: 0`, { fontSize: '16px', fill: '#000' });

    this.createAnimations();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.toiletpaper, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    //  Checks to see if the player overlaps with any of the toiletpaper, if he does call the collectTP function
    this.physics.add.overlap(this.player, this.toiletpaper, this.collectTP, null, this);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);


    //AYSE ADDITION TO CHECK GAME STATE
     //create a "start button" but this is actually just text for now
     const returnButton = this.add.text(250, 250, 'Return Button', { fontSize: '32px', fill: '#FFF' });

     //make it interactive! so when we click it...
     returnButton.setInteractive();

     // when we release the mouse, it'll log a message and change scenes
     returnButton.on('pointerup', () => {
       console.log('returnbutton pressed')
       this.scene.stop('minigameTPScene')

       //this.scene.wake('BoardScene')
       this.scene.wake('BoardBg');
       this.scene.wake('BoardDice')

     })


  }

  update () {
    if (this.gameOver) {
      // return;
      this.scene.stop('MinigameTPScene');

      // this.scene.run('BoardScene');
      // this.scene.start('BoardScene');
     //this.scene.wake('BoardScene');
      this.scene.wake('BoardBg');
      this.scene.wake('BoardDice')
      // this.gameOver = false;
  }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    }
    else{
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  collectTP(player, toiletpaper) {
    toiletpaper.disableBody(true, true);

    //  Add and update the score
    this.firstPlayerScore += 10;
    this.p1scoreText.setText(`${this.scene.settings.data.first}: ${this.firstPlayerScore}`);

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

import { socket } from "../index";
import Align from "../entity/Align";
import Player from '../entity/Player'

export default class minigameTPScene extends Phaser.Scene {
  constructor() {
    super('minigameTPScene');

    this.gameOver = false;

    this.clientScore = {
      ayse: 0,
      patty: 0,
      stephanie: 0,
      tiffany: 0,
    }
    this.updateScore = false;

    this.collectTP = this.collectTP.bind(this);
    this.hitBomb = this.hitBomb.bind(this);

  }

  preload() {
    const spriteKeys = ["ayse", "stephanie", "tiffany", "patty"]
    spriteKeys.forEach(key => {
      this.load.spritesheet(key, `assets/spriteSheets/${key}-sheet.png`, {
        frameWidth: 300,
        frameHeight: 300,
        endFrame: 8
      });
    })

    this.load.image('sky2', 'assets/minigameTP/sky.png');
    this.load.image('platform', 'assets/minigameTP/platform.png');
    this.load.image('tp', 'assets/minigameTP/tp.png');
    this.load.image('bomb', 'assets/minigameTP/bomb.png');

    this.load.audio('jump', 'assets/audio/jump.wav')
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

    /*     PLAYER SET UP BASED ON DATA FROM BOARD SCENE     */

    const passedDataPlayer = data.player;
    const passedDataOtherPlayers = data.otherPlayers;

    this.player = new Player(this, 100, 400, passedDataPlayer.name);
    this.player
      .setScale(0.5)
      .setCollideWorldBounds(true)
      .setBounce(0.2);
    this.createAnimations(passedDataPlayer.name)
    this.player.name = passedDataPlayer.name;


    const otherPlayersArr = []



    /*     DISPLAY OTHER PLAYER SPRITES     */

    // WE SHOULD TRY TO REFACTOR THIS INTO A FOR EACH
    // REASON: IF WE ARE TESTING WITH LESS THAN 4 PEOPLE, WE DON'T HAVE TO REMEMBER TO COMMENT OUT A PLAYER

    passedDataOtherPlayers.forEach( (playerData) => {
      // refactor code here if we get to it
    })

    const otherPlayer0 = new Player(this, 900, 50, passedDataOtherPlayers[0].name).setScale(0.35)
    otherPlayer0.body.enable = false
    otherPlayer0[name] = passedDataOtherPlayers[0].name
    otherPlayersArr.push(otherPlayer0)
    this.createAnimations(passedDataOtherPlayers[0].name)

    const otherPlayer1 = new Player(this, 1050, 50, passedDataOtherPlayers[1].name).setScale(0.35)
    otherPlayer1.body.enable = false
    otherPlayer1[name] = passedDataOtherPlayers[1].name
    otherPlayersArr.push(otherPlayer1)
    this.createAnimations(passedDataOtherPlayers[1].name)


    const otherPlayer2 = new Player(this, 1200, 50, passedDataOtherPlayers[2].name).setScale(0.35)
    otherPlayer2.body.enable = false
    otherPlayer2[name] = passedDataOtherPlayers[2].name
    otherPlayersArr.push(otherPlayer2)
    this.createAnimations(passedDataOtherPlayers[2].name)


    /*          LIST SOCKETS         */
    socket.on('updatedPlayersHit', (count, totalPlayers, playerHit) => {

      // loop through array to set player tint
      otherPlayersArr.forEach( (player) => {
        if (player[name] === playerHit.name){
          player.setTint(0xff0000);
        }
      })

      if (count === (totalPlayers-1)) {
        this.physics.pause();

        // game over text
        this.add.text(250, 150, 'Game Over!', { fontSize: '32px', fill: '#FFF' })
        count = 0;

        socket.emit("gameOver")
        socket.emit('resetTPgame')
        this.clientScore = {
          ayse: 0,
          patty: 0,
          stephanie: 0,
          tiffany: 0,
        }
        return;
      }
    });

    socket.on('gameOverClient', () => {
      this.scene.stop('minigameTPScene');
      this.scene.wake('BoardBg');
      this.scene.wake('BoardDice')
      this.scene.wake('BoardScene')
    })

    socket.on('updateScores', (playerWhoScored, score) => {
      this.clientScore[playerWhoScored] = score;

      this.score1.destroy();
      this.score2.destroy();
      this.score3.destroy();
      this.score4.destroy();

      this.updateScore = true;
    })

    /*          END SOCKETS         */


    /*          GAME ENTITIES CREATED         */


    this.platforms = this.physics.add.staticGroup();

    //  Floating Platforms from left to right
    this.platforms.create(0, 250, 'platform');
    this.platforms.create(100, 600, 'platform');
    this.platforms.create(800, 500, 'platform');
    this.platforms.create(1200, 250, 'platform');

    // Platforms on bottom of screen
    this.platforms.create(200, 800, 'platform');
    this.platforms.create(400, 800, 'platform');
    this.platforms.create(800, 800, 'platform');
    this.platforms.create(1200, 800, 'platform');

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();
    this.jumpSound = this.sound.add("jump");

    //  Some toiletpaper to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    this.toiletpaper = this.physics.add.group({
        key: 'tp',
        repeat: 17,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.toiletpaper.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setCollideWorldBounds(true);
    });

    this.bombs = this.physics.add.group();

    //  The score
    this.score1 = this.add.text(16, 16, `Ayse's Score: ${this.clientScore['ayse']}`, { fontSize: '24px', fill: '#FFF' });
    this.score2 = this.add.text(16, 36, `Patty's Score: ${this.clientScore['patty']}`, { fontSize: '24px', fill: '#FFF' });
    this.score3 = this.add.text(16, 56, `Tiffany's's Score: ${this.clientScore['tiffany']}`, { fontSize: '24px', fill: '#FFF' });
    this.score4 = this.add.text(16, 76, `Stephanie's's Score: ${this.clientScore['stephanie']}`, { fontSize: '24px', fill: '#FFF' });


    // physics things
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.toiletpaper, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);


    //  Checks to see if the player overlaps with any of the toiletpaper, if he does call the collectTP function
    this.physics.add.overlap(this.player, this.toiletpaper, this.collectTP, null, this);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);


    this.instructions = this.add.text(350, 150, 'Collect toilet paper! Avoid the virus!', { fontSize: '24px', fill: '#FFF' });

  } // end create

  update () {

    if (this.updateScore) {
      this.score1 = this.add.text(16, 16, `Ayse's Score: ${this.clientScore['ayse']}`, { fontSize: '24px', fill: '#FFF' });
      this.score2 = this.add.text(16, 36, `Patty's Score: ${this.clientScore['patty']}`, { fontSize: '24px', fill: '#FFF' });
      this.score3 = this.add.text(16, 56, `Tiffany's's Score: ${this.clientScore['tiffany']}`, { fontSize: '24px', fill: '#FFF' });
      this.score4 = this.add.text(16, 76, `Stephanie's's Score: ${this.clientScore['stephanie']}`, { fontSize: '24px', fill: '#FFF' });
      this.updateScore = false;
    }

    this.player.update(this.cursors, this.jumpSound)
  }

  collectTP(player, toiletpaper) {

    toiletpaper.disableBody(true, true);

    //  Send message to server that this player scored
    const name = this.player.name;
    socket.emit('scoredTP', name, this.clientScore[name])

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
    this.physics.pause()
    player.setTint(0xff0000);
    socket.emit('playerHit', player)

    this.instructions.destroy()
    this.add.text(350, 150, 'You caught the virus!', { fontSize: '24px', fill: '#FFF' })
    this.add.text(350, 200, 'Please wait for the others to finish playing.', { fontSize: '24px', fill: '#FFF' })

  }

}

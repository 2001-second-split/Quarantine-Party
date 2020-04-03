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

    this.load.image('sky2', 'assets/minigameTP/sky.png');
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

    // PLAYER SET UP BASED ON DATA FROM BOARD SCENE

    console.log("data in create", data)
    const passedDataPlayer = data.player;
    const passedDataOtherPlayers = data.otherPlayers;

    console.log(passedDataPlayer.name)

    // show player entity
    this.player = new Player(this, 100, 400, passedDataPlayer.name);
    this.player
      .setScale(0.5)
      .setCollideWorldBounds(true)
      .setBounce(0.2);
    this.createAnimations(passedDataPlayer.name)
    this.player.name = passedDataPlayer.name;

    const otherPlayersArr = []
    // passedDataOtherPlayers.forEach(player => {

    //   const otherPlayer = new Player(this, 100, 100, player.name)
    //     .setScale(0.5)
    //     .setCollideWorldBounds(true)
    //     .setBounce(0.2);
    //   otherPlayer.body.enable = false
    //   otherPlayersArr.push(otherPlayer)
    //   this.createAnimations(player.name)
    // })


    /*    DISPLAY OTHER PLAYER SPRITES     */

    // WE SHOULD TRY TO REFACTOR THIS INTO A FOR EACH
    // REASON: IF WE ARE TESTING WITH LESS THAN 4 PEOPLE, WE DON'T HAVE TO REMEMBER TO COMMENT OUT A PLAYER

    // passedDataOtherPlayers.forEach( (playerData) => {

    // }))

      const otherPlayer0 = new Player(this, 200, 100, passedDataOtherPlayers[0].name).setScale(0.35)
      otherPlayer0.body.enable = false
      otherPlayer0[name] = passedDataOtherPlayers[0].name
      console.log("otherPlayer0", otherPlayer0[name])
      console.log("passedDataOtherPlayers", passedDataOtherPlayers[0].name)
      otherPlayersArr.push(otherPlayer0)
      this.createAnimations(passedDataOtherPlayers[0].name)

      const otherPlayer1 = new Player(this, 400, 100, passedDataOtherPlayers[1].name).setScale(0.35)
      otherPlayer1.body.enable = false
      otherPlayer1[name] = passedDataOtherPlayers[1].name
      otherPlayersArr.push(otherPlayer1)
      this.createAnimations(passedDataOtherPlayers[1].name)

      // const otherPlayer2 = new Player(this, 600, 100, passedDataOtherPlayers[2].name).setScale(0.35)
      // otherPlayer2.body.enable = false
      // otherPlayer2[name] = passedDataOtherPlayers[2].name
      // otherPlayersArr.push(otherPlayer2)
      // this.createAnimations(passedDataOtherPlayers[2].name)


    /*          LIST SOCKETS         */

    // socket.on('playerMoved', (playerInfo) => {
    //   otherPlayersArr.forEach(otherPlayer => {
    //     if (playerInfo.playerId === otherPlayer.playerId) {
    //       otherPlayer.setPosition(playerInfo.x, playerInfo.y);
    //     }
    //   });
    // });

    socket.on('updatedPlayersHit', (count, totalPlayers, playerHit) => {
      console.log("players bombed", count);
      console.log("updatedplayerhit param", playerHit)

      //otherPlayersArr?
      //playerInfo in playerMoved?

      otherPlayersArr.forEach( (player) => {
        console.log(otherPlayersArr)
        console.log("forEach player", player)
        if (player.name === playerHit.name){ //ISSUE: PLAYER.NAME IS ""
          console.log("if", player.name, playerHit.name)
          player.setTint(0xff0000);
        }
      })

      if (count === (totalPlayers-1)) {
        // console.log('bodyCount is 3')
        this.physics.pause();

        // game over text
        this.add.text(250, 150, 'Game Over!', { fontSize: '32px', fill: '#FFF' })

        count = 0;
        socket.emit("gameOver")
        return;
      }
    });

    socket.on('gameOverClient', () => {
      console.log("minigameTP - in gameOver socket")

      this.scene.stop('minigameTPScene');

      this.scene.wake('BoardBg');
      this.scene.wake('BoardDice')
      this.scene.wake('BoardScene')
    })

    socket.on('updateScores', (scores) => {
      console.log('TP - scores', scores);
      this.clientScore = scores;
      this.score1.destroy();
      this.score2.destroy();
      this.score3.destroy();
      this.score4.destroy();

      this.updateScore = true;
    })

    // << END SOCKETS >>


    // << SOCKET EMITS NEEDED IN BEGINNING OF GAME >>



    // << GAME ENTITIES >>

    // Add Background & Scale to game size
    // const bg = this.add.image(-0, 0, 'sky2');
    // Align.scaleToGame(bg, 1)
    // Align.center(bg)

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
    // this.jumpSound = this.sound.add("jump");

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


    this.instructions = this.add.text(250, 200, 'Collect toilet paper! Avoid the virus!', { fontSize: '32px', fill: '#FFF' });

    // Return To Game Button

    const returnButton = this.add.text(250, 250, 'Return To Board', { fontSize: '32px', fill: '#FFF' });


    returnButton.setInteractive();

    //when you click the button
    returnButton.on('pointerup', () => {
      console.log('returnButton pressed')
      socket.emit("gameOver")

    })



  } // end create

  update () {

    if (this.updateScore) {
      this.score1 = this.add.text(16, 16, `Ayse's Score: ${this.clientScore['ayse']}`, { fontSize: '24px', fill: '#FFF' });
      this.score2 = this.add.text(16, 36, `Patty's Score: ${this.clientScore['patty']}`, { fontSize: '24px', fill: '#FFF' });
      this.score3 = this.add.text(16, 56, `Tiffany's's Score: ${this.clientScore['tiffany']}`, { fontSize: '24px', fill: '#FFF' });
      this.score4 = this.add.text(16, 76, `Stephanie's's Score: ${this.clientScore['stephanie']}`, { fontSize: '24px', fill: '#FFF' });
      this.updateScore = false;
    }

    this.player.update(this.cursors)
  }


  // SOCKET RELATED FUNCTIONS
  // addPlayer(playerInfo, socketId, spriteSkin) {
  //   // //create player entity to show in minigame scene
  //   // this.player = new Player(this, playerInfo.x, playerInfo.y, spriteSkin).setScale(0.5);
  //   // this.player.playerId = socketId
  //   // this.player.name = spriteSkin
  //   // this.createAnimations(spriteSkin);

  //   // //character physics
  //   // this.player.setCollideWorldBounds(true);
  //   // this.player.setBounce(0.2);

  //   // this.physics.add.collider(this.player, this.platforms);
  //   this.physics.add.overlap(this.player, this.toiletpaper, this.collectTP.bind(this), null, this);
  //   this.physics.add.collider(this.player, this.bombs, this.hitBomb.bind(this), null, this);

  //   return this.player;
  // }



  collectTP(player, toiletpaper) {
    console.log("in collectTP")
    toiletpaper.disableBody(true, true);

    //  Send message to server that this player scored
    // this.firstPlayerScore += 10;
    console.log("this.player", this.player.name)
    socket.emit('scoredTP', this.player.name, this.clientScore)
    // this.p1scoreText.setText(`${data.queue[0]}: ${this.firstPlayerScore}`);

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
    // this.player.disableBody(true, true);
    this.physics.pause()
    player.setTint(0xff0000);
    socket.emit('playerHit', player)
    // this.firstPlayerScore.setText(`Player: BOMBED`);
    this.instructions.destroy()
    this.instructions = this.add.text(250, 200, 'You caught the virus! Please wait for the others to finish.', { fontSize: '32px', fill: '#FFF' })
  }
}

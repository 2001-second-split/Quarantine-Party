import 'phaser'

export default class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene');

  }

  preload() {

    // LOAD SPRITES

    // LOAD FG athings
    // this.load.image('podium', 'assets/sprites/podium.png')

    // LOAD BACKGROUND IMAGE
    // this.load.image('background', 'assets/backgrounds/background.png');
  }

  createCelebrations() {
    //add jumping anims so person in first place can look like they're celebrating?
  }

  create() {
    // << CREATE SCENE ENTITIES HERE >>
    // this.add.image(-160, 0, 'sky').setOrigin(0).setScale(.5);

    // Create Background
    this.header = this.add.text(250, 50, 'CONGRATS', { fontSize: '32px', fill: '#000' });

    // Create players
    // this.firstPlace = this.add.sprite(200,510,“stephanie”).setScale(0.5)
    // this.otherPlayers = this.physics.add.group();

    // Create podium
    // this.podium = this.physics.add.staticGroup();
    // this.ground.create(400, 600, "podium").setScale(1);

    // Create collisions for all entities
    // this.physics.add.collider(this.firstPlace, this.podium)
    // this.physics.add.collider(this.otherPlayers, this.podium)
    // this.firstPlace.setCollideWorldBounds(true);
    // this.otherPlayers.setCollideWorldBounds(true);

    // Create celebration music
    // this.celebrateSound = this.sound.add('celebrate');


    // Play Again Button?
    // const playAgainButton = this.add.text(250, 250, 'Play Again?', { fontSize: '32px', fill: '#FFF' });
    // playAgainButton.setInteractive();


  }

  update() {
    // if Play Again is hit, restart game from beginning
    // playAgainButton.on('pointerup', () => {
    //   console.log('playagain pressed')
    //   this.scene.stop('EndScene')
    //   this.scene.start('StartingScene');
    // })
  }

}


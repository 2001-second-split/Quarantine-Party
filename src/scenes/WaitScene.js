import "phaser";

export default class WaitScene extends Phaser.Scene {
  constructor() {
    super("WaitScene");
    this.selectedSprite = '';
  }

  preload() {
    this.load.spritesheet("ayse", "assets/spriteSheets/ayse-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });
    this.load.spritesheet(
      "stephanie",
      "assets/spriteSheets/stephanie-sheet.png",
      {
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
  }

  select(name) {
    this.selectedSprite = name;
  }
  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.scene.launch("WaitBg");

    let spriteOptions = [];

    const ayseSprite = this.add.sprite(100, 400, "ayse").setScale(0.8);
    const stephanieSprite = this.add.sprite(270, 400, "stephanie").setScale(0.8);
    const tiffanySprite = this.add.sprite(450, 400, "tiffany").setScale(0.8);
    const pattySprite = this.add.sprite(650, 400, "patty").setScale(0.8);

    ayseSprite.name = "ayse";
    stephanieSprite.name = "stephanie";
    tiffanySprite.name - "tiffany";
    pattySprite.name = "patty";

    spriteOptions.push(pattySprite, tiffanySprite, stephanieSprite, ayseSprite);

    //method 1
    const currentScene = this;

    spriteOptions.forEach(function(sprite) {
      sprite.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
        console.log("selected a sprite")
        currentScene.selectedSprite = sprite.name;
      });
    });

    // method 2
    // const select = this.select.bind(this);

    // spriteOptions.forEach(function(sprite) {
    //   sprite.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
    //     console.log("selected a sprite")
    //     select(sprite.name)
    //   });
    // });





  }

  // update() {
  //   console.log(this.selectedSprite)
  //   if(this.selectedSprite !== ''){
  //     this.scene.launch("WaitFg", {selectedSprite: this.selectedSprite});
  //   }
  // }
}

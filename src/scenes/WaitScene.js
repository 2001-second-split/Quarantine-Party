import "phaser";

export default class WaitScene extends Phaser.Scene {
  constructor() {
    super("WaitScene");
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

  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    let spriteOptions = [];
    const ayseSprite = this.add.sprite(100, 400, "ayse").setScale(0.8);
    const stephanieSprite = this.add
      .sprite(270, 400, "stephanie")
      .setScale(0.8);
    const tiffanySprite = this.add.sprite(450, 400, "tiffany").setScale(0.8);
    const pattySprite = this.add.sprite(650, 400, "patty").setScale(0.8);
    ayseSprite.name = "ayse";
    stephanieSprite.name = "stephanie";
    tiffanySprite.name - "tiffany";
    pattySprite.name = "patty";
    spriteOptions.push(pattySprite);
    spriteOptions.push(tiffanySprite);
    spriteOptions.push(stephanieSprite);
    spriteOptions.push(ayseSprite);

    let selectedSprite = "";

    spriteOptions.forEach(function(sprite) {
      sprite.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
        selectedSprite = sprite.name;
      });
    });


    this.scene.launch("WaitBg");

    if(selectedSprite !== ''){

    this.scene.launch("WaitFg", {selectedSprite: selectedSprite});
    }
  }
}

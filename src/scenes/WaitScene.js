import "phaser";

export default class WaitScene extends Phaser.Scene {
  constructor() {
    super("WaitScene");

    this.selectedSprite = "";
  }
  selectCharacter() {}

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
    const currentScene = this;
    this.cursors = this.input.keyboard.createCursorKeys();

    const ayseSprite = this.add.sprite(100, 400, "ayse").setScale(0.8);
    const stephanieSprite = this.add
      .sprite(270, 400, "stephanie")
      .setScale(0.8);
    const tiffanySprite = this.add.sprite(450, 400, "tiffany").setScale(0.8);
    const pattySprite = this.add.sprite(650, 400, "patty").setScale(0.8);
    ayseSprite.name = "ayse";
    stephanieSprite.name = "stephanie";
    tiffanySprite.name = "tiffany";
    pattySprite.name = "patty";
    spriteOptions.push(pattySprite);
    spriteOptions.push(tiffanySprite);
    spriteOptions.push(stephanieSprite);
    spriteOptions.push(ayseSprite);

    spriteOptions.forEach(function(sprite) {
      sprite.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
        currentScene.selectedSprite = sprite.name;
        //Disabling character select after selected one
        //May change later! :D
        for(let i = 0; i < spriteOptions.length; i++){
          // if(sprite.name !== spriteOptions[i].name){
            spriteOptions[i].input.enabled=false
          // }
        }

        if (currentScene.selectedSprite !== "") {
          currentScene.scene.launch("WaitFg", {
            selectedSprite: currentScene.selectedSprite
          });


        } else {
          console.log("NO CHARACTER SELECTED - undefined", currentScene.selectedSprite);
        }
      });
    });

    this.scene.launch("WaitBg");
  }

  update() {}
}

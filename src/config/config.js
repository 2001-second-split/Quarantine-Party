const config = {
  title: "Quaratine Party",
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  //resize and recenter height/width when browser size is changed
  scale: {
    parent: 'parent',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 800,
   },
  //create dom element on top of canvas to prompt the user to join a game
  dom: {
      createContainer: true
  },
  render: {
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },  // Game objects will be pulled down along the y-axis
      debug: false,
    }
  }
};

export default config;

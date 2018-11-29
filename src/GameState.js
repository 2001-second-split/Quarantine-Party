// Singleton for now
class GameState {
  constructor() {
    // this.instance = this;

    this.player;
    this.groundGroup;

    this.gun;
    // Is the player armed
    this.armed = false;
    // Is the player facing left
    this.left = false;
    this.brandon;
    this.lasers;
    this.lastFired = 0;

    // For user input
    this.cursors;
  }

  // getInstance() {
  //   this.instance;
  // }
}

export default new GameState();

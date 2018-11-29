import BgScene from './BgScene';
import FgScene from './FgScene';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    // Load scenes in parallel
    this.scene.launch('BgScene');
    this.scene.launch('FgScene');
  }
}

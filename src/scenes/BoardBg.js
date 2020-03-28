import 'phaser';
import {socket} from '../index'

let charPosition;
export default class BoardBg extends Phaser.Scene {
  constructor() {
    super('BoardBg');
    //define path that a user can traverse
    this.walkablePath = [
      [0, 0], [0, 1], [0, 2], [0, 3],
      [0, 4], [0, 5], [1, 5], [2, 5],
      [2, 4], [2, 3], [2, 2], [3, 2],
      [4, 2], [4, 1], [5, 1], [6, 1],
      [6, 2], [6, 3], [6, 4], [6, 5],
      [5, 5], [4, 5], [4, 6], [4, 7]
    ]
  }

  preload() {
    // Preload map & sprites
    this.load.json('map', 'assets/backgrounds/final_boardCSV.json');
    this.load.spritesheet('tiles','assets/spriteSheets/boardWChar.png', {frameWidth: 128, frameHeight: 128})
  }

  create() {
    //Parse the board data from the map file
    this.data = this.cache.json.get('map');

    this.tileWidthHalf = this.data.tilewidth / 2;
    this.tileHeightHalf = this.data.tileheight / 2;

    this.mapheight = 8
    this.mapwidth = 8

    this.centerX = this.mapwidth * this.tileWidthHalf + 50;
    this.centerY = 80;

    //build map
    this.buildMap()
    socket.on('moveSelfOnBoard', rolledNum => {
      console.log('INSIDE SOCKET IN BOARD')
      this.moveCharacter(rolledNum)
    })
    //this.resetAnimation(2)
    //this.moveCharacter(3)
  }

  buildMap (){
    // construct the map from the bottom layer up.
    for (let i = 0; i < this.data.layers.length; i++){
      const layer = this.data.layers[i].data;
        //keep track of the instance in layer you are building
        let j = 0;

        //loop over the height and the width of the layer
        for (let y = 0; y < this.mapheight; y++){
            for (let x = 0; x < this.mapwidth; x++){
                const id = layer[j] - 1;
                if(id >= 0) {
                  //convert Cartesian coord to isometric
                  const tx = (x - y) * this.tileWidthHalf;
                  const ty = (x + y) * this.tileHeightHalf;
                  //grab current iteration of tile from map and place it on isometric coords
                  const tile = this.add.image(this.centerX + tx, this.centerY + ty, 'tiles', id);
                  //give depth to the tile
                  tile.depth = this.centerY + ty;
                }
                j++;
            }
        }
    }
  }

  moveCharacter(idx) {
    //if character was already on a tile get its index
    const charExists = typeof charPosition !== 'undefined'
    const prevIdx = charExists? charPosition.prevIndex : 0
    //if user throws a dice larger than the spaces left on the board, the user wins
    if((prevIdx  + idx) >= (this.walkablePath.length -1)){
      console.log('YOU WON')
      return
    }


    //convert Cartesian coords to isometric ones
    const x = this.walkablePath[idx + prevIdx][0];
    const y = this.walkablePath[idx + prevIdx][1];

    const tx = (x - y) * this.tileWidthHalf;
    const ty = (x + y) * this.tileHeightHalf;
    //if character is on the board, remove it from its previous position
    if(charExists) charPosition.destroy()
    //place character to its new location
    charPosition = this.add.image(this.centerX + tx, this.centerY + ty, 'tiles', 68);
    charPosition.depth = this.centerY + ty
    //update characters' previous location index by adding current index
    charPosition.prevIndex = prevIdx > 0 ? prevIdx + idx: idx

  }


  // const coinPositions = [
  //   [0, 0], [0, 1], [0, 3], [0, 5], [2, 5],
  //   [2, 3], [3, 2], [4, 1], [6, 1], [6, 3],
  //   [6, 5], [4, 5], [4, 7]
  // ]

}

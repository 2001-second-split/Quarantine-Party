import 'phaser';
import {socket} from '../index'

export default class BoardBg extends Phaser.Scene {
  constructor() {
    super('BoardBg');
    //define path that a user can traverse, add an aditional paramater for coins
    this.walkablePath = [
      [0, 0], [0, 1], [0, 2], [0, 3, true],
      [0, 4], [0, 5], [1, 5], [2, 5, true],
      [2, 4], [2, 3], [2, 2], [3, 2],
      [4, 2], [4, 1, true], [5, 1], [6, 1],
      [6, 2], [6, 3, true], [6, 4], [6, 5],
      [5, 5], [4, 5], [4, 6], [4, 7]
    ]
    // associate character names with corresponding tiles in tilemap
    this.characterIndexes = {ayse: 68, stephanie: 69, tiffany: 70, patty: 71}
    this.charPosition = {}
  }

  init(data){
    this.queue = data.queue
    this.player = data.player
    this.otherPlayers = data.otherPlayers
  }

  preload() {
    // Preload map & sprites
    this.load.json('map', 'assets/backgrounds/final_boardCSV.json');
    this.load.spritesheet('tiles','assets/spriteSheets/boardWChars.png', {frameWidth: 128, frameHeight: 128})
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

    //place characters to tile 0
    socket.emit('placeOnBoard', 0, this.queue[0])

    socket.on('placedOnBoard', (rolledNum, charName) => {
      this.moveCharacter(rolledNum, charName)
    })

    //listen for movement on board
    // socket.on('moveSelfOnBoard', rolledNum => {
    //   this.moveCharacter(rolledNum, this.player.name)
    //   //update the queue
    //   this.queue.push(this.queue.shift())
    // })

    //listen for movement on board
    socket.on('moveCharOnBoard', (rolledNum, charName) => {
      this.moveCharacter(rolledNum, charName)
      console.log('QUEUE BEFORE', this.queue)
      //Update queue once a player moves. This will first update the queue in BoardDice and then BoardBg (in next render cycle)
      socket.emit('unshiftQueue')
      //check the next in player in queue. Place the player on the board if she is not already
      if(typeof this.charPosition[this.queue[1]] === 'undefined'){
        socket.emit('placeOnBoard', 0, this.queue[1])
      }

    })

    //listen for minigames
    socket.on('minigameStarted', () => {
      //make the current scene sleep + minigame wake
      this.scene.switch('minigameTPScene')
    })
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
  //on transition to Board
  //place whomever is infront in que to tile 0
  // placeCharacters(player, queue){
  //   if (player === queue[0]){
  //     this.moveCharacter(0, player)
  //   }
  // }



  moveCharacter(idx, charName) {
    //if character was already on a tile get its index
    const charExists = typeof this.charPosition[charName] !== 'undefined'

    const prevIdx = charExists? this.charPosition[charName].prevIndex : 0
    console.log('CHAR', charName, 'PREV INDEX', prevIdx)
    //if user throws a dice larger than the spaces left on the board, the user wins
    if((prevIdx  + idx) >= (this.walkablePath.length -1)){
      console.log('YOU WON');
      //EMIT THIS TO EVERYONE

      // disable board scene
      // this.scene.setVisible(false, 'BoardBg')
      // this.scene.setVisible(false, 'BoardDice')
      // this.scene.pause('BoardScene')

      //data to pass to endScene
      const data = {
        first: 'ayse',
        second: 'tiffany',
        third: 'stephanie',
        fourth: 'patty',
      }
      // transition to end scene
      this.scene.stop('BoardScene')
      this.scene.start('EndScene', data);

      // this.scene.transition({
      //   target: 'EndScene',
      //   data: data,
      //   duration: 100000 //wait 3 seconds before transitioning
      // })


      return
    }


    //convert Cartesian coords to isometric ones
    const x = this.walkablePath[idx + prevIdx][0];
    const y = this.walkablePath[idx + prevIdx][1];

    const tx = (x - y) * this.tileWidthHalf;
    const ty = (x + y) * this.tileHeightHalf;
    //if character is on the board, remove it from its previous position
    if(charExists){
      this.charPosition[charName].destroy()
      delete this.charPosition[charName]
    }
    //place character to its new location

    const movedChar = this.add.image(this.centerX + tx, this.centerY + ty, 'tiles', this.characterIndexes[charName]);

    movedChar.depth = this.centerY + ty
    movedChar.prevIndex = prevIdx + idx
    console.log('PREVIDX +IDX', movedChar.prevIndex)

    this.charPosition[charName] = movedChar
    //update characters' previous location index by adding current index
    //charPosition[charName].prevIndex = prevIdx > 0 ? prevIdx + idx: idx

    //after placing the character to new position, check to see if he lands on a coin
    //trigger minigame if on a coin
    if(charExists &&  this.walkablePath[this.charPosition[charName].prevIndex].length === 3){
      socket.emit('startMinigame')
    }
  }

}

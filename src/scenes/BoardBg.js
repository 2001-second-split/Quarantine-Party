import 'phaser';

export default class BoardBg extends Phaser.Scene {
  constructor() {
    super('BoardBg');
  }

  preload() {
    // Preload map & sprites
    this.load.json('map', 'assets/backgrounds/final_boardCSV.json');
    this.load.spritesheet('tiles', 'assets/spriteSheets/tilesheet.png', { frameWidth: 128, frameHeight: 128 });
  }

  create() {
    //build map
    this.buildMap()
  }

  buildMap (){
    //  Parse the data out of the map
    const data = this.cache.json.get('map');

    const tilewidth = data.tilewidth;
    const tileheight = data.tileheight;

    const tileWidthHalf = tilewidth / 2;
    const tileHeightHalf = tileheight / 2;

    for (let i = 0; i < data.layers.length; i++){
      const layer = data.layers[i].data;

        const mapwidth = data.layers[i].width;
        const mapheight = data.layers[i].height;

        const centerX = mapwidth * tileWidthHalf + 50;
        const centerY = 80;

        let j = 0;

        for (let y = 0; y < mapheight; y++)
        {
            for (let x = 0; x < mapwidth; x++)
            {
                const id = layer[j] - 1;

                if(id >= 0) {
                  const tx = (x - y) * tileWidthHalf;
                  const ty = (x + y) * tileHeightHalf;

                  const tile = this.add.image(centerX + tx, centerY + ty, 'tiles', id);

                  tile.depth = centerY + ty;
                }
                j++;
            }
        }
    }

  }
}

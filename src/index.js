import 'phaser';

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let groundGroup;
let cursors;
let gun;
let armed = false;
let left = false

const game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/logo.png');
    this.load.image('ground', 'assets/sprites/ground.png')
    this.load.image('sky', 'assets/backgrounds/sky.png')
    this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {frameWidth: 340, frameHeight: 460})
    this.load.image('gun', 'assets/sprites/gun.png')
}

function create ()
{
    //background
    this.add.image(400, 300, 'sky')

    // var logo = this.add.image(400, 150, 'logo');

    //ground
    groundGroup = this.physics.add.staticGroup()
    groundGroup.enableBody = true
    createGround(160, 540,)
    createGround(600, 540)

    //player
    player = this.physics.add.sprite(20, 400, 'josh').setScale(.25)
    //ensure player can't walk off camera
    player.setCollideWorldBounds(true);
    //allow the player to collide with ground
    this.physics.add.collider(player, groundGroup)
    //sword
    gun = this.physics.add.sprite(300, 400, 'gun').setScale(.25)
    //allow the sword to be collided with
    this.physics.add.collider(gun, groundGroup)
    // create a checker to see if the player collides with the sword
    this.physics.add.overlap(player, gun, collectGun, null, this)

    // create player's animations
    this.anims.create({
        key: 'runUnarmed',
        frames: this.anims.generateFrameNumbers('josh', { start: 17, end: 20}),
        frameRate: 10,
        repeat: -1
    })

    this.anims.create({
        key: 'attackArmed',
        frames: this.anims.generateFrameNumbers('josh', { start: 6, end: 11}),
        frameRate: 10,
        repeat: -1
    })

    this.anims.create({
        key: 'jump',
        frames: [ {key: 'josh', frame: 17}],
        frameRate: 20,
    })

    this.anims.create({
        key: 'idleUnarmed',
        frames: [ {key: 'josh', frame: 11}],
        frameRate: 10,
    })

    this.anims.create({
        key: 'idleArmed',
        frames: [ {key: 'josh', frame: 6}],
        frameRate: 10,
    })

    // assign the curors
    cursors = this.input.keyboard.createCursorKeys()

    // this.tweens.add({
    //     targets: logo,
    //     y: 450,
    //     duration: 2000,
    //     ease: 'Power2',
    //     yoyo: true,
    //     loop: -1
    // });

}

function update () {

    if (cursors.left.isDown)
{
    if (!left) {
        player.flipX = !player.flipX
        left = true
    }
    player.setVelocityX(-160);
    if(player.body.touching.down) {
        player.anims.play('runUnarmed', true);

    }
}
else if (cursors.right.isDown)
{
    if (left) {
        player.flipX = !player.flipX
        left = false
    }
    player.setVelocityX(160);

    if(player.body.touching.down) {

        player.anims.play('runUnarmed', true);
    }
}
else
{
    player.setVelocityX(0);
    if(!armed) {
        player.anims.play('idleUnarmed');
    } else {
        player.anims.play('idleArmed')
    }
}

if (cursors.up.isDown && player.body.touching.down)
{
    player.setVelocityY(-330);
}

if(!player.body.touching.down) {
    player.anims.play('jump')
        }
}

function createGround (x,y) {
    let ground = groundGroup.create(
        x,y,'ground'
    )
}

function collectGun(player, gun) {
    gun.disableBody(true, true)
    armed = true
}


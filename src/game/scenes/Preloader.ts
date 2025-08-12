import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor () {
        super('Preloader');
    }

    init () {
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        this.load.on('progress', (progress: number) => {

            bar.width = 4 + (460 * progress);

        });
    }

    preload () {
        this.load.setPath('assets');

        this.load.image('walls', 'walls1.png');
        this.load.spritesheet('mainHallDecorator', 'sprites/mainHallDecorator.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('playerTexture', 'sprites/player.png', {frameWidth: 32, frameHeight: 32}); //minimum working example
        this.load.tilemapTiledJSON('map', 'map/map.json');
    }

    create () {
        this.scene.start('MainDungeon');
    }
}

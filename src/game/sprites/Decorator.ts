import { GameObjects } from "phaser";

class Decorator extends GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'decorator');
        scene.add.existing(this)
    }
}

export class MainHallDecorator extends Decorator {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.setTexture('mainHallDecorator');
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('mainHallDecorator', { start: 4, end: 5 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.play('idle');
    }
}
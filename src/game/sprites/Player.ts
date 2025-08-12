import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
    private keys: any;
    private speed: number = 200;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'playerTexture', 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.keys = scene.input.keyboard?.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('playerTexture', { start: 0, end: 0 }),
            frameRate: 2,
            repeat: -1
        });

        this.anims.play('idle')
    }

    update() {
        this.setVelocity(0);
    
        let moving = false;
    
        if (this.keys.left.isDown) {
            this.setVelocityX(-this.speed);
            moving = true;
            this.anims.play('idle');
        } else if (this.keys.right.isDown) {
            this.setVelocityX(this.speed);
            moving = true;
            this.anims.play('idle');
        }
    
        if (this.keys.up.isDown) {
            this.setVelocityY(-this.speed);
            moving = true;
            this.anims.play('idle');
        } else if (this.keys.down.isDown) {
            this.setVelocityY(this.speed);
            moving = true;
            this.anims.play('idle');
        }
    
        if (moving && this.body && this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
            this.body.velocity.normalize().scale(this.speed);
        }
    }
}

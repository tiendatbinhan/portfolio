import Phaser from "phaser";
import { DIRECTION } from "../configs";

export class Player extends Phaser.Physics.Arcade.Sprite {
    private keys: any;
    private speed: number = 200;
    private direction: number = DIRECTION.DOWN;
    private lastMoveDirection: number = DIRECTION.DOWN;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'playerTextureIdle', 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body?.setSize(32, 32);
        this.body?.setOffset(16, 16);

        this.keys = scene.input.keyboard?.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        for (const key in DIRECTION) {
            let startFrame = 12 * Number(key);
            let endFrame = Number(key) === DIRECTION.UP? startFrame+3:startFrame+11
            this.anims.create({
                key: `idle_${Number(key)}`,
                frames: this.anims.generateFrameNumbers('playerTextureIdle', { start: startFrame, end: endFrame }),
                frameRate: 8,
                repeat: -1
            });

            startFrame = 6 * Number(key);
            endFrame = startFrame+5;
            this.anims.create({
                key: `walk_${Number(key)}`,
                frames: this.anims.generateFrameNumbers('playerTextureWalk', { start: startFrame, end: endFrame }),
                frameRate: 8,
                repeat: -1
            })
        }

        this.anims.play(`idle_${this.direction}`);
    }

    update() {
        this.setVelocity(0);
    
        let moving = false;
        let horizontalMove = false;
        let verticalMove = false;
    
        if (this.keys.left.isDown) {
            this.setVelocityX(-this.speed);
            moving = true;
            horizontalMove = true;
            this.lastMoveDirection = DIRECTION.LEFT;
        } else if (this.keys.right.isDown) {
            this.setVelocityX(this.speed);
            moving = true;
            horizontalMove = true;
            this.lastMoveDirection = DIRECTION.RIGHT;
        }
    
        if (this.keys.up.isDown) {
            this.setVelocityY(-this.speed);
            moving = true;
            verticalMove = true;
            this.lastMoveDirection = DIRECTION.UP;
        } else if (this.keys.down.isDown) {
            this.setVelocityY(this.speed);
            moving = true;
            verticalMove = true;
            this.lastMoveDirection = DIRECTION.DOWN;
        }
    
        if (moving && this.body && this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
            this.body.velocity.normalize().scale(this.speed);
        }

        if (moving) {
            this.direction = this.lastMoveDirection;
            this.anims.play(`walk_${this.direction}`, true);
        } else {
            this.anims.play(`idle_${this.lastMoveDirection}`, true);
        }
    }
}

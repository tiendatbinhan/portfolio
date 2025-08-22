import Phaser from "phaser";
import { DIRECTION } from "../configs";

export class Player extends Phaser.Physics.Arcade.Sprite {
    private keys: any;
    private speed: number = 200;
    private direction: number = DIRECTION.DOWN;
    private lastMoveDirection: number = DIRECTION.DOWN;
    private path: Phaser.Geom.Point[] = [];
    private pathIndex: number = 0;
    private movingByPath: boolean = false;

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
        if (this.movingByPath && this.path && this.pathIndex < this.path.length) {
            const target = this.path[this.pathIndex];
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const threshold = 4; // pixels
            if (dist < threshold) {
                this.setVelocity(0);
                this.pathIndex++;
                if (this.pathIndex >= this.path.length) {
                    this.movingByPath = false;
                    this.setVelocity(0);
                    this.anims.play(`idle_${this.lastMoveDirection}`, true);
                }
            } else {

                const angle = Math.atan2(dy, dx);
                this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);

                let dir = this.lastMoveDirection;
                if (Math.abs(dx) > Math.abs(dy)) {
                    dir = dx > 0 ? DIRECTION.RIGHT : DIRECTION.LEFT;
                } else {
                    dir = dy > 0 ? DIRECTION.DOWN : DIRECTION.UP;
                }
                this.direction = dir;
                this.lastMoveDirection = dir;
                this.anims.play(`walk_${this.direction}`, true);
            }
            return;
        }

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
    
        if (moving && this.body && horizontalMove && verticalMove) {
            this.body.velocity.normalize().scale(this.speed);
        }

        if (moving) {
            this.direction = this.lastMoveDirection;
            this.anims.play(`walk_${this.direction}`, true);
        } else {
            this.anims.play(`idle_${this.lastMoveDirection}`, true);
        }
    }

    cancelPath() {
        this.movingByPath = false;
        this.setVelocity(0);
        this.anims.play(`idle_${this.lastMoveDirection}`, true);
    }

    moveByPixel(path: Phaser.Geom.Point[]) {
        if (!path || path.length === 0) return;
        this.path = path;
        this.pathIndex = 0;
        this.movingByPath = true;
    }
}

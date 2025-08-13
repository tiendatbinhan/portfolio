import Phaser from "phaser";
import { GAME_CONFIG } from "../configs";

export class InfoDisplayer extends Phaser.Physics.Arcade.Sprite {
    info: string;
    title: string;
    key: any;

    constructor(scene: Phaser.Scene, x: number, y: number, title: string = "Info") {
        super(scene, x, y, 'texture');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(true);

        this.title = title;

        this.key = scene.input.keyboard?.addKeys({
            interact: Phaser.Input.Keyboard.KeyCodes.F
        })
    }

    setInfo(info: string) {
        this.info = info;
    }

    manhattanDistance(px: number, py: number): number {
        const tileSize = GAME_CONFIG.TILE_SIZE;
        const xIndex = Math.floor(this.x / tileSize);
        const yIndex = Math.floor(this.y / tileSize);
        return Math.abs(xIndex - px) + Math.abs(yIndex - py);
    }

    canInteract(px: number, py: number): boolean {
        return this.manhattanDistance(px, py) < 2;
    }

    onInteract() {
        this.scene.scene.start('DisplayInfo', {info: this.info})
    }
}
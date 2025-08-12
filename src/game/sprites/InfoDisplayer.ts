import { GameObjects } from "phaser";
import { GAME_CONFIG } from "../configs";

class InfoDisplayer extends GameObjects.Sprite {
    info: string;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'texture');
        scene.add.existing(this);
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
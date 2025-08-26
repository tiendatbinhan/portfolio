import * as Phaser from 'phaser';
import { Player } from "../sprites/Player";

export class NavigationManager {
    private scene: Phaser.Scene;
    private player: Player;
    private navmesh: any;

    constructor(scene: Phaser.Scene, player: Player, navmesh: any) {
        this.scene = scene;
        this.player = player;
        this.navmesh = navmesh;

        // Listen to world clicks emitted by InputScene
        this.scene.events.on('worldClick', this.onWorldClick, this);
    }

    private onWorldClick(pointer: Phaser.Input.Pointer) {
        if (!this.player || !this.navmesh) return;

        // Convert pointer to world coordinates
        const worldPoint = pointer.positionToCamera(this.scene.cameras.main) || pointer;

        // Find path on navmesh
        const path = this.navmesh.findPath(
            { x: this.player.x, y: this.player.y },
            { x: worldPoint.x, y: worldPoint.y }
        );

        if (path && path.length > 0) {
            this.player.moveByPixel(path);
        }
    }

    // Optional: cleanup if needed
    public destroy() {
        this.scene.events.off('worldClick', this.onWorldClick, this);
    }
}

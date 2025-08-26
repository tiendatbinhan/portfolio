import * as Phaser from 'phaser';
import { Player } from "../sprites/Player";
import { MainHallDecorator } from "../sprites/Decorator";
import { InfoDisplayer } from "../sprites/InfoDisplayer";

export class PhysicsManager {
    private scene: Phaser.Scene;
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }
    
    setupCollisions(
        player: Player,
        mapLayer: Phaser.Tilemaps.TilemapLayer | null,
        decorators: MainHallDecorator[],
        infoDisplayers: InfoDisplayer[]
    ): void {
        // Player vs map layer collision
        if (mapLayer) {
            this.scene.physics.add.collider(player, mapLayer);
        }
        
        // Player vs decorators collision
        decorators.forEach(decorator => {
            this.scene.physics.add.collider(player, decorator);
        });
        
        // Player vs info displayers collision
        infoDisplayers.forEach(infoDisplayer => {
            this.scene.physics.add.collider(player, infoDisplayer);
        });
    }
}
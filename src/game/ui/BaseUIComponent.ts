import * as Phaser from 'phaser';

type VisualGameObject = 
    | Phaser.GameObjects.Sprite
    | Phaser.GameObjects.Text
    | Phaser.GameObjects.NineSlice
    | Phaser.GameObjects.Image
    | Phaser.GameObjects.Graphics
    | Phaser.GameObjects.Container;

export abstract class BaseUIComponent {
    protected scene: Phaser.Scene;
    protected gameObjects: VisualGameObject[] = [];
    protected depth: number = 1000;
    
    constructor(scene: Phaser.Scene, depth?: number) {
        this.scene = scene;
        if (depth) this.depth = depth;
    }
    
    abstract create(): void;
    
    setVisible(visible: boolean): void {
        this.gameObjects.forEach(obj => obj.setVisible(visible));
    }
    
    setDepth(depth: number): void {
        this.depth = depth;
        this.gameObjects.forEach(obj => obj.setDepth(depth));
    }
    
    destroy(): void {
        this.gameObjects.forEach(obj => obj.destroy());
        this.gameObjects = [];
    }
}
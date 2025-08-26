import * as Phaser from 'phaser';
import { BaseUIComponent } from './BaseUIComponent';

export interface PanelConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    texture?: string;
    frame?: string;
}

export class Panel extends BaseUIComponent {
    private panel: Phaser.GameObjects.NineSlice | null = null;
    private config: PanelConfig;
    
    constructor(scene: Phaser.Scene, config: PanelConfig, depth?: number) {
        super(scene, depth);
        this.config = config;
    }
    
    create(): void {
        this.panel = this.scene.add.nineslice(
            this.config.x,
            this.config.y,
            this.config.texture || 'gui',
            this.config.frame || 'panel_brownimg.png',
            this.config.width,
            this.config.height,
            16, 16, 16, 16
        );
        this.panel.setDepth(this.depth);
        
        this.gameObjects = [this.panel];
    }
    
    getPanel(): Phaser.GameObjects.NineSlice | null {
        return this.panel;
    }
}
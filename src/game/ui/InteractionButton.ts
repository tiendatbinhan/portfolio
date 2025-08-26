import * as Phaser from 'phaser';
import { Button, ButtonConfig } from './Button';

export interface InteractionButtonConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    width?: number;
    height?: number;
    text?: string;
    onInteract?: (title: string, info: string) => void;
}

export class InteractionButton {
    private button: Button;
    private scene: Phaser.Scene;
    private currentDisplayer: { title: string; info: string } | null = null;
    private onInteractCallback: ((title: string, info: string) => void) | undefined;
    
    constructor(config: InteractionButtonConfig) {
        this.scene = config.scene;
        this.onInteractCallback = config.onInteract;
        
        const buttonConfig: ButtonConfig = {
            x: config.x,
            y: config.y,
            width: config.width || 120,
            height: config.height || 40,
            text: config.text || 'Press F',
            textStyle: {
                fontSize: '14px',
                color: '#FFFFFF',
                fontFamily: 'PixelPurl',
                fontStyle: 'bold'
            },
            onClick: () => this.handleClick(),
            texture: 'gui',
            frame: 'button_brownimg.png'
        };
        
        this.button = new Button(this.scene, buttonConfig, 3000); // High depth to appear above other UI
        this.button.create();
        this.button.setVisible(false); // Initially hidden
    }
    
    show(displayerData: { title: string; info: string }, playerX: number, playerY: number): void {
        this.currentDisplayer = displayerData;
        
        // Position button above the player
        const buttonX = playerX;
        const buttonY = playerY - 60; // 60 pixels above player
        
        this.button.setPosition(buttonX, buttonY);
        this.button.setText(`${displayerData.title} (F)`);
        this.button.setVisible(true);
    }
    
    hide(): void {
        this.button.setVisible(false);
        this.currentDisplayer = null;
    }
    
    private handleClick(): void {
        if (this.currentDisplayer && this.onInteractCallback) {
            this.onInteractCallback(this.currentDisplayer.title, this.currentDisplayer.info);
        }
    }
    
    isVisible(): boolean {
        // We need to access the button's visibility state
        // Since Button doesn't expose this directly, we'll track it ourselves
        return this.currentDisplayer !== null;
    }
    
    destroy(): void {
        this.button.destroy();
    }
}
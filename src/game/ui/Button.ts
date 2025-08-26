import * as Phaser from 'phaser';
import { BaseUIComponent } from './BaseUIComponent';

export interface ButtonConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
    onClick?: () => void;
    texture?: string;
    frame?: string;
}

export class Button extends BaseUIComponent {
    private button: Phaser.GameObjects.NineSlice | null = null;
    private buttonText: Phaser.GameObjects.Text | null = null;
    private config: ButtonConfig;

    constructor(scene: Phaser.Scene, config: ButtonConfig, depth?: number) {
        super(scene, depth);
        this.config = config;
    }

    create(): void {
        // Create button background
        this.button = this.scene.add.nineslice(
            this.config.x,
            this.config.y,
            this.config.texture || 'gui',
            this.config.frame || 'button_brownimg.png',
            this.config.width,
            this.config.height,
            16, 16, 0, 0
        );
        this.button.setDepth(this.depth);
        this.button.setInteractive({ useHandCursor: true });

        // Create button text
        const defaultTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: '16px',
            color: '#000000',
            fontFamily: 'PixelPurl'
        };
        this.buttonText = this.scene.add.text(
            this.config.x,
            this.config.y,
            this.config.text,
            { ...defaultTextStyle, ...this.config.textStyle }
        );
        this.buttonText.setOrigin(0.5);
        this.buttonText.setDepth(this.depth + 1);

        // Add click handler
        if (this.config.onClick) {
            this.button.on('pointerup', (pointer: Phaser.Input.Pointer) => {
                pointer.event.stopPropagation();
                this.config.onClick!();
            });
        }

        this.gameObjects = [this.button, this.buttonText];
    }

    setText(text: string): void {
        if (this.buttonText) this.buttonText.setText(text);
    }

    setPosition(x: number, y: number): void {
        if (this.button) this.button.setPosition(x, y);
        if (this.buttonText) this.buttonText.setPosition(x, y);
    }
}

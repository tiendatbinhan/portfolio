import * as Phaser from 'phaser';
import { BaseUIComponent } from './BaseUIComponent';

export interface ScrollableTextConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
    scrollStep?: number;
}

export class ScrollableText extends BaseUIComponent {
    private textObject: Phaser.GameObjects.Text | null = null;
    private scrollY: number = 0;
    private maxScrollY: number = 0;
    private config: ScrollableTextConfig;
    
    constructor(scene: Phaser.Scene, config: ScrollableTextConfig, depth?: number) {
        super(scene, depth);
        this.config = config;
    }
    
    create(): void {
        const defaultTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: '18px',
            color: '#000000',
            fontFamily: 'PixelPurl',
            wordWrap: { width: this.config.width }
        };
        
        this.textObject = this.scene.add.text(
            this.config.x,
            this.config.y,
            this.config.text,
            { ...defaultTextStyle, ...this.config.textStyle }
        );
        this.textObject.setOrigin(0.5);
        this.textObject.setDepth(this.depth);
        
        this.gameObjects = [this.textObject];
        this.calculateMaxScroll();
    }
    
    setText(text: string): void {
        if (this.textObject) {
            this.textObject.setText(text);
            this.scrollY = 0;
            this.calculateMaxScroll();
            this.updatePosition();
        }
    }
    
    scrollUp(): boolean {
        if (this.scrollY > 0) {
            this.scrollY -= this.config.scrollStep || 30;
            this.scrollY = Math.max(0, this.scrollY);
            this.updatePosition();
            return true;
        }
        return false;
    }
    
    scrollDown(): boolean {
        if (this.scrollY < this.maxScrollY) {
            this.scrollY += this.config.scrollStep || 30;
            this.scrollY = Math.min(this.maxScrollY, this.scrollY);
            this.updatePosition();
            return true;
        }
        return false;
    }
    
    canScrollUp(): boolean {
        return this.scrollY > 0;
    }
    
    canScrollDown(): boolean {
        return this.scrollY < this.maxScrollY;
    }
    
    getScrollInfo(): { textHeight: number, maxScrollY: number, currentScrollY: number, canScrollUp: boolean, canScrollDown: boolean } {
        const textHeight = this.textObject?.height || 0;
        return {
            textHeight,
            maxScrollY: this.maxScrollY,
            currentScrollY: this.scrollY,
            canScrollUp: this.canScrollUp(),
            canScrollDown: this.canScrollDown()
        };
    }
    
    private calculateMaxScroll(): void {
        if (this.textObject) {
            const textHeight = this.textObject.height;
            this.maxScrollY = Math.max(0, textHeight - this.config.height);
        }
    }
    
    private updatePosition(): void {
        if (this.textObject) {
            this.textObject.setY(this.config.y - this.scrollY);
        }
    }
}
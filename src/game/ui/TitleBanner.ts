import * as Phaser from 'phaser';
import { BaseUIComponent } from './BaseUIComponent';

export interface TitleBannerConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    title: string;
    titleStyle?: Phaser.Types.GameObjects.Text.TextStyle;
    texture?: string;
    frame?: string;
}

export class TitleBanner extends BaseUIComponent {
    private banner: Phaser.GameObjects.Sprite | null = null;
    private titleText: Phaser.GameObjects.Text | null = null;
    private config: TitleBannerConfig;
    
    constructor(scene: Phaser.Scene, config: TitleBannerConfig, depth?: number) {
        super(scene, depth);
        this.config = config;
    }
    
    create(): void {
        this.banner = this.scene.add.sprite(
            this.config.x,
            this.config.y,
            this.config.texture || 'gui',
            this.config.frame || 'banner_hangingimg.png'
        );
        this.banner.setDepth(this.depth);
        this.banner.setScale(this.config.width / 256, this.config.height / 64);
        
        const defaultTitleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: '24px',
            color: '#000000',
            fontFamily: 'DungeonCrawler',
            fontStyle: 'bold'
        };
        
        this.titleText = this.scene.add.text(
            this.config.x,
            this.config.y,
            this.config.title,
            { ...defaultTitleStyle, ...this.config.titleStyle }
        );
        this.titleText.setOrigin(0.5);
        this.titleText.setDepth(this.depth + 1);
        
        this.gameObjects = [this.banner, this.titleText];
    }
    
    setTitle(title: string): void {
        if (this.titleText) {
            this.titleText.setText(title);
        }
    }
}
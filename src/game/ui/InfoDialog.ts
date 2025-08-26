import * as Phaser from 'phaser';
import { BaseUIComponent } from './BaseUIComponent';
import { Panel } from './Panel';
import { TitleBanner } from './TitleBanner';
import { ScrollableText } from './ScrollableText';
import { Button } from './Button';

export interface InfoDialogConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    onClose?: () => void;
}

export class InfoDialog extends BaseUIComponent {
    private panel: Panel;
    private titleBanner: TitleBanner;
    private scrollableText: ScrollableText;
    private closeButton: Button;
    private scrollUpButton: Button;
    private scrollDownButton: Button;
    private config: InfoDialogConfig;
    
    constructor(scene: Phaser.Scene, config: InfoDialogConfig, depth: number = 2000) {
        super(scene, depth);
        this.config = config;
        
        // Initialize components
        this.panel = new Panel(scene, {
            x: config.x,
            y: config.y,
            width: config.width,
            height: config.height
        }, depth);
        
        this.titleBanner = new TitleBanner(scene, {
            x: config.x,
            y: config.y - 150,
            width: 400,
            height: 64,
            title: ''
        }, depth + 1);
        
        this.scrollableText = new ScrollableText(scene, {
            x: config.x,
            y: config.y,
            width: config.width - 120,
            height: 300,
            text: ''
        }, depth + 1);
        
        const scrollButtonX = config.x + (config.width / 2) - 30;
        
        this.scrollUpButton = new Button(scene, {
            x: scrollButtonX,
            y: config.y - 50,
            width: 40,
            height: 40,
            text: '↑',
            onClick: () => this.scrollUp()
        }, depth + 1);
        
        this.scrollDownButton = new Button(scene, {
            x: scrollButtonX,
            y: config.y + 50,
            width: 40,
            height: 40,
            text: '↓',
            onClick: () => this.scrollDown()
        }, depth + 1);
        
        this.closeButton = new Button(scene, {
            x: config.x,
            y: config.y + 150,
            width: 100,
            height: 40,
            text: 'Close',
            onClick: () => this.hide()
        }, depth + 1);
    }
    
    create(): void {
        this.panel.create();
        this.titleBanner.create();
        this.scrollableText.create();
        this.closeButton.create();
        this.scrollUpButton.create();
        this.scrollDownButton.create();
        
        // Initially hidden
        this.setVisible(false);
    }
    
    show(title: string, info: string): void {
        this.titleBanner.setTitle(title);
        this.scrollableText.setText(info);
        this.updateScrollButtons();
        this.setVisible(true);
    }
    
    hide(): void {
        this.setVisible(false);
        if (this.config.onClose) {
            this.config.onClose();
        }
    }
    
    private scrollUp(): void {
        if (this.scrollableText.scrollUp()) {
            this.updateScrollButtons();
        }
    }
    
    private scrollDown(): void {
        if (this.scrollableText.scrollDown()) {
            this.updateScrollButtons();
        }
    }
    
    private updateScrollButtons(): void {
        const canScrollUp = this.scrollableText.canScrollUp();
        const canScrollDown = this.scrollableText.canScrollDown();
        
        // Only show scroll buttons if there's content to scroll
        this.scrollUpButton.setVisible(canScrollUp);
        this.scrollDownButton.setVisible(canScrollDown);
    }
    
    setVisible(visible: boolean): void {
        this.panel.setVisible(visible);
        this.titleBanner.setVisible(visible);
        this.scrollableText.setVisible(visible);
        this.closeButton.setVisible(visible);
        
        if (visible) {
            this.updateScrollButtons();
        } else {
            this.scrollUpButton.setVisible(false);
            this.scrollDownButton.setVisible(false);
        }
    }
    
    destroy(): void {
        this.panel.destroy();
        this.titleBanner.destroy();
        this.scrollableText.destroy();
        this.closeButton.destroy();
        this.scrollUpButton.destroy();
        this.scrollDownButton.destroy();
    }
}
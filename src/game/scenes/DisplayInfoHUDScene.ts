import { Scene } from "phaser";
import { GAME_CONFIG } from "../configs";

export class DisplayInfoHUDScene extends Scene {
    private dialogPanel: Phaser.GameObjects.Sprite | null = null;
    private titleBanner: Phaser.GameObjects.Sprite | null = null;
    private titleText: Phaser.GameObjects.Text | null = null;
    private infoText: Phaser.GameObjects.Text | null = null;
    private closeButton: Phaser.GameObjects.Sprite | null = null;
    private closeText: Phaser.GameObjects.Text | null = null;
    private scrollUpButton: Phaser.GameObjects.Sprite | null = null;
    private scrollDownButton: Phaser.GameObjects.Sprite | null = null;
    private scrollUpText: Phaser.GameObjects.Text | null = null;
    private scrollDownText: Phaser.GameObjects.Text | null = null;
    private scrollY: number = 0;
    private maxScrollY: number = 0;

    constructor() {
        super({ key: 'DisplayInfoHUDScene', active: false });
    }

    create() {
        // Create dialog panel (centered on screen)
        const panelWidth = 600;
        const panelHeight = 400;
        const panelX = GAME_CONFIG.WIDTH / 2;
        const panelY = GAME_CONFIG.HEIGHT / 2;

        // Create main dialog panel
        this.dialogPanel = this.add.sprite(panelX, panelY, 'gui', 'panel_brownimg.png');
        this.dialogPanel.setDepth(2000);
        this.dialogPanel.setScale(panelWidth / 64, panelHeight / 64);
        this.dialogPanel.setVisible(false);

        // Create title banner
        const bannerWidth = 400;
        const bannerHeight = 64;
        const bannerX = panelX;
        const bannerY = panelY - 150;
        this.titleBanner = this.add.sprite(bannerX, bannerY, 'gui', 'banner_hangingimg.png');
        this.titleBanner.setDepth(2001);
        this.titleBanner.setScale(bannerWidth / 256, bannerHeight / 64); // 256x64 is the banner size
        this.titleBanner.setVisible(false);

        // Create title text
        this.titleText = this.add.text(bannerX, bannerY, '', {
            fontSize: '24px',
            color: '#000000',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        this.titleText.setOrigin(0.5);
        this.titleText.setDepth(2002);
        this.titleText.setVisible(false);

        // Create info text (with word wrapping and scrolling)
        this.infoText = this.add.text(panelX, panelY, '', {
            fontSize: '18px',
            color: '#000000',
            fontFamily: 'Arial',
            wordWrap: { width: panelWidth - 120 } // Reduced width to make room for scroll buttons
        });
        this.infoText.setOrigin(0.5);
        this.infoText.setDepth(2001);
        this.infoText.setVisible(false);

        // Create scroll up button
        const scrollButtonWidth = 40;
        const scrollButtonHeight = 40;
        const scrollButtonX = panelX + (panelWidth / 2) - 30;
        const scrollUpY = panelY - 50;
        this.scrollUpButton = this.add.sprite(scrollButtonX, scrollUpY, 'gui', 'button_brownimg.png');
        this.scrollUpButton.setDepth(2001);
        this.scrollUpButton.setScale(scrollButtonWidth / 48, scrollButtonHeight / 24);
        this.scrollUpButton.setVisible(false);

        this.scrollUpText = this.add.text(scrollButtonX, scrollUpY, '↑', {
            fontSize: '16px',
            color: '#000000',
            fontFamily: 'Arial'
        });
        this.scrollUpText.setOrigin(0.5);
        this.scrollUpText.setDepth(2002);
        this.scrollUpText.setVisible(false);

        // Create scroll down button
        const scrollDownY = panelY + 50;
        this.scrollDownButton = this.add.sprite(scrollButtonX, scrollDownY, 'gui', 'button_brownimg.png');
        this.scrollDownButton.setDepth(2001);
        this.scrollDownButton.setScale(scrollButtonWidth / 48, scrollButtonHeight / 24);
        this.scrollDownButton.setVisible(false);

        this.scrollDownText = this.add.text(scrollButtonX, scrollDownY, '↓', {
            fontSize: '16px',
            color: '#000000',
            fontFamily: 'Arial'
        });
        this.scrollDownText.setOrigin(0.5);
        this.scrollDownText.setDepth(2002);
        this.scrollDownText.setVisible(false);

        // Create close button
        const closeButtonWidth = 100;
        const closeButtonHeight = 40;
        this.closeButton = this.add.sprite(panelX, panelY + 150, 'gui', 'button_brownimg.png');
        this.closeButton.setDepth(2001);
        this.closeButton.setScale(closeButtonWidth / 48, closeButtonHeight / 24); // 48x24 is button size
        this.closeButton.setVisible(false);

        this.closeText = this.add.text(panelX, panelY + 150, 'Close', {
            fontSize: '16px',
            color: '#000000',
            fontFamily: 'Arial'
        });
        this.closeText.setOrigin(0.5);
        this.closeText.setDepth(2002);
        this.closeText.setVisible(false);

        // Add click handlers
        this.closeButton.setInteractive();
        this.closeButton.on('pointerdown', () => {
            this.hideDialog();
        });

        this.scrollUpButton.setInteractive();
        this.scrollUpButton.on('pointerdown', () => {
            this.scrollUp();
        });

        this.scrollDownButton.setInteractive();
        this.scrollDownButton.on('pointerdown', () => {
            this.scrollDown();
        });

        // Listen for dialog events
        this.game.events.on('showInfoDialog', this.showDialog, this);
    }

    showDialog(title: string, info: string): void {
        if (!this.dialogPanel || !this.titleBanner || !this.titleText || !this.infoText || !this.closeButton || !this.closeText || !this.scrollUpButton || !this.scrollDownButton || !this.scrollUpText || !this.scrollDownText) return;

        this.titleText.setText(title);
        this.infoText.setText(info);
        
        // Reset scroll position
        this.scrollY = 0;
        this.updateScrollButtons();
        
        this.dialogPanel.setVisible(true);
        this.titleBanner.setVisible(true);
        this.titleText.setVisible(true);
        this.infoText.setVisible(true);
        this.closeButton.setVisible(true);
        this.closeText.setVisible(true);
        this.scrollUpButton.setVisible(true);
        this.scrollDownButton.setVisible(true);
        this.scrollUpText.setVisible(true);
        this.scrollDownText.setVisible(true);
    }

    hideDialog(): void {
        if (!this.dialogPanel || !this.titleBanner || !this.titleText || !this.infoText || !this.closeButton || !this.closeText || !this.scrollUpButton || !this.scrollDownButton || !this.scrollUpText || !this.scrollDownText) return;

        this.dialogPanel.setVisible(false);
        this.titleBanner.setVisible(false);
        this.titleText.setVisible(false);
        this.infoText.setVisible(false);
        this.closeButton.setVisible(false);
        this.closeText.setVisible(false);
        this.scrollUpButton.setVisible(false);
        this.scrollDownButton.setVisible(false);
        this.scrollUpText.setVisible(false);
        this.scrollDownText.setVisible(false);
    }

    private scrollUp(): void {
        if (this.scrollY > 0) {
            this.scrollY -= 30;
            this.updateTextPosition();
            this.updateScrollButtons();
        }
    }

    private scrollDown(): void {
        if (this.scrollY < this.maxScrollY) {
            this.scrollY += 30;
            this.updateTextPosition();
            this.updateScrollButtons();
        }
    }

    private updateTextPosition(): void {
        if (!this.infoText) return;
        
        const panelY = GAME_CONFIG.HEIGHT / 2;
        this.infoText.setY(panelY - this.scrollY);
    }

    private updateScrollButtons(): void {
        if (!this.scrollUpButton || !this.scrollDownButton || !this.scrollUpText || !this.scrollDownText) return;

        // Calculate max scroll based on text height
        if (this.infoText) {
            const textHeight = this.infoText.height;
            const panelHeight = 300; // Approximate visible area
            this.maxScrollY = Math.max(0, textHeight - panelHeight);
        }

        // Show/hide scroll buttons based on scroll position
        const canScrollUp = this.scrollY > 0;
        const canScrollDown = this.scrollY < this.maxScrollY;

        this.scrollUpButton.setVisible(canScrollUp);
        this.scrollUpText.setVisible(canScrollUp);
        this.scrollDownButton.setVisible(canScrollDown);
        this.scrollDownText.setVisible(canScrollDown);
    }
}
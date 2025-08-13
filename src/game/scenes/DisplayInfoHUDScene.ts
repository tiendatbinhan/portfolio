import { Scene } from "phaser";
import { GAME_CONFIG } from "../configs";

export class DisplayInfoHUDScene extends Scene {
    private dialogPanel: Phaser.GameObjects.Sprite | null = null;
    private titleBanner: Phaser.GameObjects.Sprite | null = null;
    private titleText: Phaser.GameObjects.Text | null = null;
    private infoText: Phaser.GameObjects.Text | null = null;
    private closeButton: Phaser.GameObjects.Sprite | null = null;
    private closeText: Phaser.GameObjects.Text | null = null;

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

        // Create info text (with word wrapping)
        this.infoText = this.add.text(panelX, panelY, '', {
            fontSize: '18px',
            color: '#000000',
            fontFamily: 'Arial',
            wordWrap: { width: panelWidth - 80 }
        });
        this.infoText.setOrigin(0.5);
        this.infoText.setDepth(2001);
        this.infoText.setVisible(false);

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

        // Add click handler for close button
        this.closeButton.setInteractive();
        this.closeButton.on('pointerdown', () => {
            this.hideDialog();
        });

        // Listen for dialog events
        this.game.events.on('showInfoDialog', this.showDialog, this);
    }

    showDialog(title: string, info: string): void {
        if (!this.dialogPanel || !this.titleBanner || !this.titleText || !this.infoText || !this.closeButton || !this.closeText) return;

        this.titleText.setText(title);
        this.infoText.setText(info);
        
        this.dialogPanel.setVisible(true);
        this.titleBanner.setVisible(true);
        this.titleText.setVisible(true);
        this.infoText.setVisible(true);
        this.closeButton.setVisible(true);
        this.closeText.setVisible(true);
    }

    hideDialog(): void {
        if (!this.dialogPanel || !this.titleBanner || !this.titleText || !this.infoText || !this.closeButton || !this.closeText) return;

        this.dialogPanel.setVisible(false);
        this.titleBanner.setVisible(false);
        this.titleText.setVisible(false);
        this.infoText.setVisible(false);
        this.closeButton.setVisible(false);
        this.closeText.setVisible(false);
    }
}
import { Scene } from "phaser";
import { GAME_CONFIG } from "../configs";

export class HUDScene extends Scene {
    private interactionButtons: Phaser.GameObjects.Sprite[] = [];
    private interactionTexts: Phaser.GameObjects.Text[] = [];
    private hudHeight: number;

    constructor() {
        super({ key: 'HUDScene', active: false });
    }

    create() {
        // Set HUD height to 1/6 of game height
        this.hudHeight = GAME_CONFIG.HEIGHT / 6;

        // Listen for events from MainDungeon scene using global game events
        this.game.events.on('updateInteractionText', this.updateInteractionText, this);
    }

    updateInteractionText(interactableDisplayers: string[]): void {
        // Clear existing buttons and texts
        this.clearInteractionUI();

        if (interactableDisplayers.length > 0) {
            // Create separate button for each interaction
            const buttonWidth = 200;
            const buttonHeight = 48;
            const spacing = 20;
            const totalWidth = (buttonWidth + spacing) * interactableDisplayers.length - spacing;
            const startX = (GAME_CONFIG.WIDTH - totalWidth) / 2;
            const y = GAME_CONFIG.HEIGHT - this.hudHeight

            interactableDisplayers.forEach((title, index) => {
                const x = startX + index * (buttonWidth + spacing) + buttonWidth / 2;

                // Create button panel
                const button = this.add.sprite(x, y, 'gui', 'panel_brownimg.png');
                button.setDepth(1000);
                button.setScale(buttonWidth / 64, buttonHeight / 64); // 64x64 is the original panel size

                // Create text for this button
                const text = this.add.text(x, y, title, {
                    fontSize: '16px',
                    color: '#000000',
                    fontFamily: 'Arial'
                });
                text.setOrigin(0.5);
                text.setDepth(1001);

                this.interactionButtons.push(button);
                this.interactionTexts.push(text);
            });
        }
    }

    private clearInteractionUI(): void {
        // Remove all existing buttons and texts
        this.interactionButtons.forEach(button => button.destroy());
        this.interactionTexts.forEach(text => text.destroy());
        this.interactionButtons = [];
        this.interactionTexts = [];
    }
}

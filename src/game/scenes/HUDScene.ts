import { Scene } from "phaser";
import { GAME_CONFIG } from "../configs";

export class HUDScene extends Scene {
    private interactionButtons: Phaser.GameObjects.NineSlice[] = [];
    private interactionTexts: Phaser.GameObjects.Text[] = [];
    private hudHeight: number;

    constructor() {
        super({ key: 'HUDScene', active: false });
    }

    create() {
        this.hudHeight = GAME_CONFIG.HEIGHT / 6;

        this.game.events.on('updateInteractionText', this.updateInteractionText, this);
    }

    updateInteractionText(interactableDisplayers: string[]): void {
        this.clearInteractionUI();

        if (interactableDisplayers.length > 0) {
            const buttonWidth = 200;
            const buttonHeight = 48;
            const spacing = 20;
            const totalWidth = (buttonWidth + spacing) * interactableDisplayers.length - spacing;
            const startX = (GAME_CONFIG.WIDTH - totalWidth) / 2;
            const y = GAME_CONFIG.HEIGHT - this.hudHeight

            interactableDisplayers.forEach((title, index) => {
                const x = startX + index * (buttonWidth + spacing) + buttonWidth / 2;

                const button = this.add.nineslice(
                    x, 
                    y, 
                    'gui', 
                    'panel_brownimg.png', 
                    buttonWidth, 
                    buttonHeight, 
                    16, 
                    16, 
                    16, 
                    16
                );
                button.setDepth(1000);
                
                const text = this.add.text(x, y, title, {
                    fontSize: '16px',
                    color: '#000000',
                    fontFamily: 'PixelPurl'
                });
                text.setOrigin(0.5);
                text.setDepth(1001);

                this.interactionButtons.push(button);
                this.interactionTexts.push(text);
            });
        }
    }

    private clearInteractionUI(): void {
        this.interactionButtons.forEach(button => button.destroy());
        this.interactionTexts.forEach(text => text.destroy());
        this.interactionButtons = [];
        this.interactionTexts = [];
    }
}

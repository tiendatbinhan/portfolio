import { Scene } from "phaser";
import { Button, ButtonConfig } from "../ui/Button";
import { GAME_CONFIG } from "../configs";
import { InfoDisplayer } from "../sprites/InfoDisplayer";

export class HUDScene extends Scene {
    private interactionButtons: Button[] = [];
    private hudHeight: number;

    constructor() {
        super({ key: 'HUDScene', active: true }); // Set active to true
    }

    create() {
        this.hudHeight = GAME_CONFIG.HEIGHT / 6;
        this.game.events.on('updateInteractionText', this.updateInteractionText, this);
        
        // Ensure this scene receives input
        this.input.enabled = true;
        this.input.setTopOnly(false);
        
        console.log("HUDScene created");
    }

    updateInteractionText(interactableDisplayers: InfoDisplayer[]): void {
        this.clearInteractionUI();

        if (interactableDisplayers.length > 0) {
            const buttonWidth = 200;
            const buttonHeight = 48;
            const spacing = 20;
            const totalWidth = (buttonWidth + spacing) * interactableDisplayers.length - spacing;
            const startX = (GAME_CONFIG.WIDTH - totalWidth) / 2;
            const y = GAME_CONFIG.HEIGHT - this.hudHeight + buttonHeight / 2 - 20;

            interactableDisplayers.forEach((displayer, index) => {
                const x = startX + index * (buttonWidth + spacing) + buttonWidth / 2;

                const buttonConfig: ButtonConfig = {
                    x,
                    y,
                    width: buttonWidth,
                    height: buttonHeight,
                    text: displayer.title,
                    textStyle: {
                        fontSize: '16px',
                        color: '#000000',
                        fontFamily: 'PixelPurl'
                    },
                    onClick: () => {
                        console.log("Interaction button clicked");
                        displayer.onInteract();
                    },
                    texture: 'gui',
                    frame: 'panel_brownimg.png'
                };

                const button = new Button(this, buttonConfig, 1000);
                button.create();
                this.interactionButtons.push(button);

                this.events.emit('registerUIBounds', {
                    x,
                    y,
                    width: buttonWidth,
                    height: buttonHeight,
                    onClick: () => displayer.onInteract()
                });
            });
        }
    }

    private clearInteractionUI(): void {
        this.events.emit('clearUIBounds');
        // Destroy buttons
        this.interactionButtons.forEach(button => button.destroy());
        this.interactionButtons = [];
    }

    // Add this to ensure proper cleanup
    shutdown() {
        this.clearInteractionUI();
        this.game.events.off('updateInteractionText', this.updateInteractionText, this);
    }
}
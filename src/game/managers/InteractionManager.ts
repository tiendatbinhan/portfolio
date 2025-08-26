import { Player } from "../sprites/Player";
import { InfoDisplayer } from "../sprites/InfoDisplayer";
import { GAME_CONFIG } from "../configs";

export class InteractionManager {
    private scene: Phaser.Scene;
    private player: Player;
    private infoDisplayers: InfoDisplayer[];
    
    constructor(scene: Phaser.Scene, player: Player, infoDisplayers: InfoDisplayer[]) {
        this.scene = scene;
        this.player = player;
        this.infoDisplayers = infoDisplayers;
        
        this.setupInputHandlers();
    }
    
    private setupInputHandlers(): void {
        // F key for interaction
        this.scene.input.keyboard?.on('keydown-F', () => {
            this.handleInteraction();
        });
        
        // Listen for dialog trigger from HUD buttons
        this.scene.game.events.on('triggerInfoDialog', (title: string) => {
            this.handleInfoDialogTrigger(title);
        });
    }
    
    updateInteractionText(): void {
        if (!this.player) return;

        const playerTileX = Math.floor(this.player.x / GAME_CONFIG.TILE_SIZE);
        const playerTileY = Math.floor(this.player.y / GAME_CONFIG.TILE_SIZE);

        const interactableDisplayers = this.infoDisplayers
            .filter(displayer => displayer.canInteract(playerTileX, playerTileY));

        this.scene.game.events.emit('updateInteractionText', interactableDisplayers);
        
        const hudScene = this.scene.scene.get('HUDScene');
        if (hudScene && hudScene.scene.isActive()) {
            (hudScene as any).updateInteractionText(interactableDisplayers);
        }
    }
    
    private handleInteraction(): void {
        if (!this.player) return;

        const playerTileX = Math.floor(this.player.x / GAME_CONFIG.TILE_SIZE);
        const playerTileY = Math.floor(this.player.y / GAME_CONFIG.TILE_SIZE);
        
        const interactableDisplayer = this.infoDisplayers.find(displayer => 
            displayer.canInteract(playerTileX, playerTileY)
        );

        if (interactableDisplayer) {
            this.scene.game.events.emit('showInfoDialog', interactableDisplayer.title, interactableDisplayer.info);
        }
    }
    
    private handleInfoDialogTrigger(title: string): void {
        // Find the InfoDisplayer by title and show its dialog
        const displayer = this.infoDisplayers.find(d => d.title === title);
        if (displayer) {
            displayer.onInteract();
        } else {
            console.log("No displayer found")
        }
    }
    
    destroy(): void {
        // Clean up event listeners
        this.scene.game.events.off('triggerInfoDialog');
    }
}
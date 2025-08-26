import { Scene } from "phaser";
import { GAME_CONFIG } from "../configs";
import { InfoDialog } from "../ui/InfoDialog";

export class DisplayInfoHUDScene extends Scene {
    private infoDialog: InfoDialog | null = null;

    constructor() {
        super({ key: 'DisplayInfoHUDScene', active: false });
    }

    create() {
        // Create the info dialog
        this.infoDialog = new InfoDialog(this, {
            x: GAME_CONFIG.WIDTH / 2,
            y: GAME_CONFIG.HEIGHT / 2,
            width: 600,
            height: 400,
            onClose: () => {
                // Handle dialog close if needed
            }
        });
        
        this.infoDialog.create();
        
        // Listen for dialog events
        this.game.events.on('showInfoDialog', this.showDialog, this);
    }

    showDialog(title: string, info: string): void {
        if (this.infoDialog) {
            this.infoDialog.show(title, info);
            this.scene.bringToTop();
        }
    }

    hideDialog(): void {
        if (this.infoDialog) {
            this.infoDialog.hide();
            this.scene.sendToBack();
        }
    }
}
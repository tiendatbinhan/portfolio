import * as Phaser from 'phaser';
import { ClickManager, UIBounds } from '../managers';

export class InputScene extends Phaser.Scene {
    private clickManager!: ClickManager;

    constructor() {
        super({ key: 'InputScene', active: true });
    }

    create() {
        this.clickManager = new ClickManager(this);

        // Forward world clicks to MainDungeon or NavigationManager
        this.clickManager.setWorldClickHandler((pointer) => {
            const mainDungeon = this.scene.get('MainDungeon');
            if (mainDungeon) {
                mainDungeon.events.emit('worldClick', pointer);
            }
        });

        // Listen for HUDScene registering UI bounds
        const hudScene = this.scene.get('HUDScene');
        if (hudScene) {
            hudScene.events.on('registerUIBounds', (bounds: UIBounds) => {
                this.clickManager.registerUIBounds(bounds);
            });

            hudScene.events.on('clearUIBounds', () => {
                this.clickManager.clearUIBounds();
            });

            hudScene.events.on('removeUIBounds', (bounds: UIBounds) => {
                this.clickManager.removeUIBounds(bounds);
            });
        }
    }
}

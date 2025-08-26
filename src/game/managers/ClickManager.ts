export interface UIBounds {
    x: number;
    y: number;
    width: number;
    height: number;
    onClick?: () => void;  // Added callback
}

export class ClickManager {
    private scene: Phaser.Scene;
    private uiBounds: UIBounds[] = [];
    private onWorldClick: ((pointer: Phaser.Input.Pointer) => void) | null = null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.setupInputHandlers();
    }

    private setupInputHandlers(): void {
        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // Check if click is within any UI bounds
            const clickedUI = this.uiBounds.find(bounds => this.isClickOnUI(pointer, bounds));
            if (clickedUI) {
                console.log("UI clicked");
                clickedUI.onClick?.(); // Invoke UI callback
                return; // Stop propagation to world
            }

            // Click is on world, handle world click
            if (this.onWorldClick) {
                console.log("World clicked.");
                this.onWorldClick(pointer);
            }
        });
    }

    registerUIBounds(bounds: UIBounds): void {
        this.uiBounds.push(bounds);
    }

    clearUIBounds(): void {
        this.uiBounds = [];
    }

    removeUIBounds(bounds: UIBounds): void {
        const index = this.uiBounds.indexOf(bounds);
        if (index > -1) {
            this.uiBounds.splice(index, 1);
        }
    }

    setWorldClickHandler(handler: (pointer: Phaser.Input.Pointer) => void): void {
        this.onWorldClick = handler;
    }

    private isClickOnUI(pointer: Phaser.Input.Pointer, bounds: UIBounds): boolean {
        const px = pointer.x;
        const py = pointer.y;

        return px >= bounds.x - bounds.width / 2 &&
               px <= bounds.x + bounds.width / 2 &&
               py >= bounds.y - bounds.height / 2 &&
               py <= bounds.y + bounds.height / 2;
    }
}

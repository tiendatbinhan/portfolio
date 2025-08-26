export class SceneManager {
    private scene: Phaser.Scene;
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }
    
    launchHUDScenes(): void {
        // Launch HUD scene and ensure it's active
        this.scene.scene.launch('HUDScene');
        
        // Launch DisplayInfoHUDScene
        this.scene.scene.launch('DisplayInfoHUDScene');
        this.scene.scene.sendToBack('DisplayInfoHUDScene');
    }
    
    getScene(key: string): Phaser.Scene | null {
        return this.scene.scene.get(key);
    }
}
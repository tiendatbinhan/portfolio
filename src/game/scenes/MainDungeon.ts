import { Scene } from "phaser";
import { 
    SceneManager, 
    MapManager, 
    ObjectManager, 
    PhysicsManager, 
    InteractionManager, 
    NavigationManager, 
} from "../managers";

export class MainDungeon extends Scene {
    private sceneManager: SceneManager;
    private mapManager: MapManager;
    private objectManager: ObjectManager;
    private physicsManager: PhysicsManager;
    private interactionManager: InteractionManager | null = null;
    private navigationManager: NavigationManager | null = null;

    constructor() {
        super('MainDungeon');
    }

    create() {
        // Initialize managers
        this.sceneManager = new SceneManager(this);
        this.mapManager = new MapManager(this);
        this.objectManager = new ObjectManager(this);
        this.physicsManager = new PhysicsManager(this);
        
        // Launch HUD scenes
        this.sceneManager.launchHUDScenes();
        
        // Create map
        const mapLayer = this.mapManager.createMap({
            mapKey: 'map',
            tilesetName: 'walls1',
            tilesetKey: 'walls',
            layerName: 'Tile Layer 1',
            objectLayerName: 'Object Layer 1'
        });
        
        if (!mapLayer) {
            console.error('Failed to create map layer');
            return;
        }
        
        // Process objects from map
        const objectLayer = this.mapManager.getObjectLayer('Object Layer 1');
        if (objectLayer) {
            this.objectManager.processObjects(objectLayer);
        }
        
        const player = this.objectManager.getPlayer();
        if (player) {
            // Setup camera to follow player
            this.cameras.main.startFollow(player);
            
            // Setup physics collisions
            this.physicsManager.setupCollisions(
                player,
                mapLayer,
                this.objectManager.getDecorators(),
                this.objectManager.getInfoDisplayers()
            );
            
            // Setup interaction system
            this.interactionManager = new InteractionManager(
                this,
                player,
                this.objectManager.getInfoDisplayers()
            );
            
            // Build navmesh and setup navigation
            const navmesh = this.mapManager.buildNavMesh();
            if (navmesh) {
                this.navigationManager = new NavigationManager(this, player, navmesh);
            }
        }
        
        // Listen for scene shutdown to cleanup
        this.events.once('shutdown', this.onShutdown, this);
    }

    update(_time: number, _delta: number): void {
        const player = this.objectManager.getPlayer();
        if (player) {
            player.update();
            this.interactionManager?.updateInteractionText();
        }
    }
    
    private onShutdown(): void {
        // Clean up managers when scene is shut down
        this.interactionManager?.destroy();
        // Remove the shutdown listener to prevent memory leaks
        this.events.off('shutdown', this.onShutdown, this);
    }
}
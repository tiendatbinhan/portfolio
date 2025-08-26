import * as Phaser from 'phaser';

export interface MapConfig {
    mapKey: string;
    tilesetName: string;
    tilesetKey: string;
    layerName: string;
    objectLayerName: string;
}

export class MapManager {
    private scene: Phaser.Scene;
    private map: Phaser.Tilemaps.Tilemap | null = null;
    private mapLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private navmesh: any = null;
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }
    
    createMap(config: MapConfig): Phaser.Tilemaps.TilemapLayer | null {
        this.map = this.scene.make.tilemap({ key: config.mapKey });
        const wallSet = this.map.addTilesetImage(config.tilesetName, config.tilesetKey);

        if (wallSet == null) {
            console.error('Cannot load the tileset.');
            return null;
        }

        this.mapLayer = this.map.createLayer(config.layerName, wallSet, 0, 0);
        this.mapLayer?.setCollisionByProperty({"walkable": false});
        
        return this.mapLayer;
    }
    
    getObjectLayer(layerName: string): Phaser.Types.Tilemaps.TiledObject[] | undefined {
        return this.map?.getObjectLayer(layerName)?.objects;
    }
    
    buildNavMesh(layerName: string = "mesh"): any {
        if (this.map && this.mapLayer && (this.scene as any).navMeshPlugin) {
            this.navmesh = (this.scene as any).navMeshPlugin.buildMeshFromTilemap(
                layerName, 
                this.map, 
                [this.mapLayer], 
                undefined, 
                16
            );
        }
        return this.navmesh;
    }
    
    getNavMesh(): any {
        return this.navmesh;
    }
    
    getMapLayer(): Phaser.Tilemaps.TilemapLayer | null {
        return this.mapLayer;
    }
}
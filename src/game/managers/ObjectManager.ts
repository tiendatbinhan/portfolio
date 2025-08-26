import * as Phaser from 'phaser';
import { MainHallDecorator } from "../sprites/Decorator";
import { Player } from "../sprites/Player";
import { InfoDisplayer } from "../sprites/InfoDisplayer";

export interface ObjectSpawner {
    type: string;
    spawn(scene: Phaser.Scene, obj: Phaser.Types.Tilemaps.TiledObject): any;
}

export class DecoratorSpawner implements ObjectSpawner {
    type = 'Decorator';
    
    spawn(scene: Phaser.Scene, obj: Phaser.Types.Tilemaps.TiledObject): MainHallDecorator | null {
        const isMainHall = Array.isArray(obj.properties) && 
            obj.properties.some((p: { name: string; value: unknown }) =>
                p.name === 'type' && p.value === 'mainhall'
            );
            
        if (isMainHall) {
            return new MainHallDecorator(scene, obj.x ?? 0, obj.y ?? 0);
        }
        
        return null;
    }
}

export class InfoDisplayerSpawner implements ObjectSpawner {
    type = 'InfoDisplayer';
    
    spawn(scene: Phaser.Scene, obj: Phaser.Types.Tilemaps.TiledObject): InfoDisplayer {
        const title = obj.properties?.find((p: { name: string; value: unknown }) => 
            p.name === 'title')?.value as string || 'Info';
        const info = obj.properties?.find((p: { name: string; value: unknown }) => 
            p.name === 'info')?.value as string || 'No information available.';
        const chamber = obj.properties?.find((p: { name: string; value: unknown }) => 
            p.name === 'chamber')?.value as number || 0;
        
        const infoDisplayer = new InfoDisplayer(scene, obj.x ?? 0, obj.y ?? 0, title);
        infoDisplayer.setInfo(info);
        infoDisplayer.setTextureByChamber(chamber);
        
        return infoDisplayer;
    }
}

export class PlayerSpawner implements ObjectSpawner {
    type = 'Player';
    
    spawn(scene: Phaser.Scene, obj: Phaser.Types.Tilemaps.TiledObject): Player {
        return new Player(scene, obj.x ?? 0, obj.y ?? 0);
    }
}

export class ObjectManager {
    private scene: Phaser.Scene;
    private spawners: Map<string, ObjectSpawner> = new Map();
    
    public decorators: MainHallDecorator[] = [];
    public infoDisplayers: InfoDisplayer[] = [];
    public player: Player | null = null;
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.registerSpawners();
    }
    
    private registerSpawners(): void {
        const spawners = [
            new DecoratorSpawner(),
            new InfoDisplayerSpawner(),
            new PlayerSpawner()
        ];
        
        spawners.forEach(spawner => {
            this.spawners.set(spawner.type, spawner);
        });
    }
    
    processObjects(objects: Phaser.Types.Tilemaps.TiledObject[]): void {
        objects.forEach(obj => {
            const spawner = this.spawners.get(obj.type || '');
            if (spawner) {
                const spawnedObject = spawner.spawn(this.scene, obj);
                
                // Store spawned objects in appropriate arrays
                if (obj.type === 'Decorator' && spawnedObject) {
                    this.decorators.push(spawnedObject);
                } else if (obj.type === 'InfoDisplayer') {
                    this.infoDisplayers.push(spawnedObject);
                } else if (obj.type === 'Player') {
                    this.player = spawnedObject;
                }
            }
        });
    }
    
    getPlayer(): Player | null {
        return this.player;
    }
    
    getDecorators(): MainHallDecorator[] {
        return this.decorators;
    }
    
    getInfoDisplayers(): InfoDisplayer[] {
        return this.infoDisplayers;
    }
}
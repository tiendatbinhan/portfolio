import { Scene } from "phaser";
import { MainHallDecorator } from "../sprites/Decorator";

export class MainDungeon extends Scene
{
    constructor() {
        super('MainDungeon');
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const wallSet = map.addTilesetImage('walls1', 'walls');

        if (wallSet == null) {
            console.log('Cannot load the tileset.');
            return
        }

        const mapLayer = map.createLayer('Tile Layer 1', wallSet, 0, 0);
        mapLayer?.setCollisionByProperty({"walkable": false});

        const objectLayer = map.getObjectLayer('Object Layer 1')?.objects;
        objectLayer?.forEach(obj => {
            if (
                obj.type === 'Decorator' &&
                Array.isArray(obj.properties) &&
                obj.properties.some(
                    (p: { name: string; value: unknown }) =>
                        p.name === 'type' && p.value === 'mainhall'
                )
            ) {
                new MainHallDecorator(this, obj.x ?? 0, obj.y ?? 0);
            }
        })
    }
}
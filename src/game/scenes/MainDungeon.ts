import { Scene } from "phaser";
import { MainHallDecorator } from "../sprites/Decorator";
import { Player } from "../sprites/Player";

export class MainDungeon extends Scene
{
    player: Player;
    decorators: MainHallDecorator[] = [];

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
                const decorator = new MainHallDecorator(this, obj.x ?? 0, obj.y ?? 0);
                this.decorators.push(decorator);
            }

            if (obj.type === 'Player') {
                this.player = new Player(this, obj.x ?? 0, obj.y ?? 0);
                this.cameras.main.startFollow(this.player);
            }
        });

        if (this.player && mapLayer) {
            this.physics.add.collider(this.player, mapLayer);
        }

        if (this.player) {
            this.decorators.forEach(decorator => {
                this.physics.add.collider(this.player, decorator);
            });
        }
    }

    update(time: number, delta: number): void {
        if (this.player) {
            this.player.update();
        }
    }
}
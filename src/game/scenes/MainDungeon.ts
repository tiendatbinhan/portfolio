import { Scene } from "phaser";
import { MainHallDecorator } from "../sprites/Decorator";
import { Player } from "../sprites/Player";
import { InfoDisplayer } from "../sprites/InfoDisplayer";
import { GAME_CONFIG } from "../configs";

export class MainDungeon extends Scene
{
    player: Player;
    decorators: MainHallDecorator[] = [];
    infoDisplayers: InfoDisplayer[] = [];

    constructor() {
        super('MainDungeon');
    }

    create() {
        // Launch HUD scene and ensure it's active
        this.scene.launch('HUDScene');
        this.scene.bringToTop('HUDScene');

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

            if (obj.type === 'InfoDisplayer') {
                const title = obj.properties?.find((p: { name: string; value: unknown }) => p.name === 'title')?.value as string || 'Info';
                const infoDisplayer = new InfoDisplayer(this, obj.x ?? 0, obj.y ?? 0, title);
                this.infoDisplayers.push(infoDisplayer);
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
            
            this.infoDisplayers.forEach(infoDisplayer => {
                this.physics.add.collider(this.player, infoDisplayer);
            });
        }
    }

    update(time: number, delta: number): void {
        if (this.player) {
            this.player.update();
            this.updateInteractionText();
        }
    }

    private updateInteractionText(): void {
        if (!this.player) return;

        const playerTileX = Math.floor(this.player.x / GAME_CONFIG.TILE_SIZE);
        const playerTileY = Math.floor(this.player.y / GAME_CONFIG.TILE_SIZE);

        const interactableDisplayers = this.infoDisplayers
            .filter(displayer => displayer.canInteract(playerTileX, playerTileY))
            .map(displayer => displayer.title);

        this.game.events.emit('updateInteractionText', interactableDisplayers);
        
        const hudScene = this.scene.get('HUDScene');
        if (hudScene && hudScene.scene.isActive()) {
            (hudScene as any).updateInteractionText(interactableDisplayers);
        }
    }
}
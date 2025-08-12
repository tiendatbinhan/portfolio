import { Scene } from "phaser";

export class DisplayInfo extends Scene
{
    info: string;

    constructor() {
        super('DisplayInfo');
    }

    init(info: string) {
        this.info = info;
    }

    create() {
        
    }
}
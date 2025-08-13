import { Boot } from './scenes/Boot';
import { MainDungeon } from './scenes/MainDungeon';
import { HUDScene } from './scenes/HUDScene';
import { DisplayInfoHUDScene } from './scenes/DisplayInfoHUDScene';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { GAME_CONFIG } from './configs';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: GAME_CONFIG.WIDTH,
    height: GAME_CONFIG.HEIGHT,
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: [
        Boot,
        Preloader,
        MainDungeon,
        HUDScene,
        DisplayInfoHUDScene
    ],
    physics: {
        default: 'arcade',
        arcade: {}
    },
    render: {
        transparent: true
    }
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;

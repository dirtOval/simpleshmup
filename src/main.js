import Phaser from 'phaser';

import HelloWorldScene from './scenes/HelloWorldScene';
import GameScene from './scenes/GameScene';

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [GameScene],
}

export default new Phaser.Game(config)

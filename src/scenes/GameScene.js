import Phaser from 'phaser';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Explosion from '../entities/Explosion.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');

    this.player = undefined;
    this.cursors = undefined;
    this.enemies = [];
    this.isGameOver = false;
  }

  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('playerBullet', 'assets/playerBullet.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('enemyBullet', 'assets/enemyBullet.png');
    this.load.image('sky', 'assets/sky.png');
    this.load.spritesheet('explosion', 'assets/explosion.png',
                          {frameWidth: 64, frameHeight: 64})
  }

  //instantiation functions
  createPlayer() {
    const player = new Player(this, 100, 300);
    return player;
  }

  createEnemy() {
    this.enemies.push(new Enemy(this, 825, Math.floor(Math.random() * 550) + 50));
  }

  create() {
    this.sky = this.add.tileSprite(500, 300, 1067, 600, 'sky');
    this.player = this.createPlayer();
    this.createEnemy();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.enemies , (player, enemy) => {
      if (!this.isGameOver) {
        const explosion = this.physics.add.sprite(this.player.x, this.player.y, 'explosion');
        explosion.setScale(2);
        explosion.play('explode');
        explosion.on('animationcomplete', function() {
          explosion.destroy();
        })
        player.setActive(false).setVisible(false);
        enemy.destroy();
        this.isGameOver = true;
      }
    });

    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 15}),
      frameRate: 20,
      repeat: 0
    })
  }

  update() {

    //controls
    if (!this.isGameOver) {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-250);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(250);
      } else {
        this.player.setVelocityX(0);
      }

      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-250);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(250);
      } else {
        this.player.setVelocityY(0);
      }
    }


    //background scroll effect
    this.sky.tilePositionX += 5;
  }
}
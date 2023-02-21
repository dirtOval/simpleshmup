import Phaser from 'phaser';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
// import Explosion from '../entities/Explosion.js';
import PlayerBullet from '../entities/PlayerBullet.js';
import EnemyBullet from '../entities/EnemyBullet.js';
import ScoreLabel  from '../ui/ScoreLabel.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');

    this.player = undefined;
    this.cursors = undefined;
    this.enemies = [];
    this.isGameOver = false;
    this.playerBullets = [];
    this.enemyBullets = [];
    this.canShoot = true;
    this.scoreLabel = undefined;
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
    this.enemies.push(new Enemy(this, 825, Math.floor(Math.random() * 550) + 50, Math.floor(Math.random() * -150 - 100)));
  }

  createScoreLabel(x, y, score)
	{
		const style = { fontSize: '32px', fill: '#FFF' }
		const label = new ScoreLabel(this, x, y, score, style)

		this.add.existing(label)

		return label
	}

  fireBullet() {
    this.playerBullets.push(new PlayerBullet(this, this.player.x + 30, this.player.y - 13));
  }

  fireEnemyBullet(enemy) {
    this.enemyBullets.push(new EnemyBullet(this, enemy.x - 30, enemy.y - 13))
  }

  explosion(x, y) {
    const explosion = this.physics.add.sprite(x, y, 'explosion');
        explosion.setScale(2);
        explosion.play('explode');
        explosion.on('animationcomplete', function() {
          explosion.destroy();
        })
  }

  create() {
    this.sky = this.add.tileSprite(500, 300, 1067, 600, 'sky');
    this.player = this.createPlayer();
    this.createEnemy(); //initial enemy on screen
    this.cursors = this.input.keyboard.createCursorKeys();
    this.scoreLabel = this.createScoreLabel(16, 16, 0)

    //colliders
    this.physics.add.collider(this.player, this.enemies , (player, enemy) => {
      if (!this.isGameOver) {
        this.explosion(this.player.x, this.player.y);
        player.setActive(false).setVisible(false);
        enemy.destroy();
        this.isGameOver = true;
      }
    });

    this.physics.add.collider(this.playerBullets, this.enemies, (bullet, enemy) => {
      this.explosion(enemy.x, enemy.y);
      bullet.destroy();
      enemy.destroy();
      this.scoreLabel.add(10);
    })

    this.physics.add.collider(this.player, this.enemyBullets, (player, bullet) => {
      this.explosion(this.player.x, this.player.y);
      bullet.destroy();
      player.setActive(false).setVisible(false);
    })

    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 15}),
      frameRate: 20,
      repeat: 0
    })

    //timer to spawn enemy
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.createEnemy();
      }
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

      if (this.cursors.space.isDown) {
        if (this.canShoot) {
          this.fireBullet();
          this.canShoot = false;
          this.time.delayedCall(50, () => {
            this.canShoot = true;
          })
        }
      }
    }

    //enemy shooting script
    // for (let enemy of this.enemies) {
    //   let delay = Math.floor(Math.random() * 1000 + 1000);
    //   this.time.addEvent({
    //     delay: delay,
    //     loop: false,
    //     repeat: 1,
    //     callback: this.fireEnemyBullet(enemy)
    //   })
    // }
    for (let enemy of this.enemies) {
      let chance = Math.random() * 100;
      if (chance > 30) {
        enemy.shootBullet(this);
      }
    }

    //interestingly this doesn't work
    for (let bullet of this.playerBullets) {
      if (bullet.x > 800) {
        bullet.destroy();
      }
    }
    //background scroll effect
    this.sky.tilePositionX += 5;
  }
}
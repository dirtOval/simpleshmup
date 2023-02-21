import Phaser from 'phaser';
import EnemyBullet from './EnemyBullet.js';

class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor (scene, x, y, speed) {
    super(scene, x, y, 'enemy');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(1.5);
    this.setVelocityX(speed);
    this.canShoot = true;
  }

  shootBullet(scene) {
    let delay = Math.floor(Math.random() * 1000 + 100);
    scene.time.addEvent({
      delay: delay,
      loop: false,
      callback: () =>  {
        if (this.canShoot) {
          this.canShoot = false;
          scene.enemyBullets.push(new EnemyBullet(scene, this.x - 30 , this.y - 13 ));
          setTimeout(1000, () => {
            this.canShoot = true;
          })
        }
      }
    })
  }


}

export default Enemy;
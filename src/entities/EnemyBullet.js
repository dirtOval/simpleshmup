import Phaser from 'phaser';

class EnemyBullet extends Phaser.Physics.Arcade.Sprite {

  constructor (scene, x, y)
  {
      super(scene, x, y, 'enemyBullet');

      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.setScale(1.5);
      this.setVelocityX(-400);
  }
}

export default EnemyBullet;
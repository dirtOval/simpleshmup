import Phaser from 'phaser';

class PlayerBullet extends Phaser.Physics.Arcade.Sprite {

  constructor (scene, x, y)
  {
      super(scene, x, y, 'playerBullet');

      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.setScale(1.5);
      this.setVelocityX(600);
  }
}

export default PlayerBullet;
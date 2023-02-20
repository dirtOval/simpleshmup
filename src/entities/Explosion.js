import Phaser from 'phaser';

class Explosion extends Phaser.Physics.Arcade.Sprite {

  constructor (scene, x, y)
  {
      super(scene, x, y, 'explosion');

      scene.add.existing(this);
      scene.physics.add.existing(this);
  }
}

export default Explosion;
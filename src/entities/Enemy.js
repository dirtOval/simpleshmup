import Phaser from 'phaser';

class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor (scene, x, y) {
    super(scene, x, y, 'enemy');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(1.5);
    this.setVelocityX(-100);
  }
}

export default Enemy;
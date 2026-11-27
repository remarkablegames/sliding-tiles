import Phaser from 'phaser';

export class Tile extends Phaser.GameObjects.Image {
  readonly value: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: string,
    value: number,
  ) {
    super(scene, x, y, texture, frame);

    this.value = value;
    this.setOrigin(0);

    scene.add.existing(this);
  }
}

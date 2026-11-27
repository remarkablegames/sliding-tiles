import Phaser from 'phaser';

import { COLOR, FONT_FAMILY, KEY, LAYOUT } from '../constants';
import { createSeed, getPicsumUrl, getPuzzleTextureKey } from '../utils';

export class Boot extends Phaser.Scene {
  constructor() {
    super(KEY.SCENE.BOOT);
  }

  preload() {
    this.add
      .text(LAYOUT.WIDTH / 2, LAYOUT.HEIGHT / 2, 'Loading photo...', {
        fontFamily: FONT_FAMILY,
        fontSize: 20,
        color: COLOR.MUTED,
      })
      .setOrigin(0.5);

    const seed = createSeed();

    this.registry.set(KEY.DATA.SEED, seed);
    this.load.image(getPuzzleTextureKey(seed), getPicsumUrl(seed));
  }

  create() {
    this.scene.start(KEY.SCENE.GAME);
  }
}

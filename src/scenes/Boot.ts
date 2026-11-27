import Phaser from 'phaser';

import { COLOR, FONT_FAMILY, KEY } from '../constants';
import { createSeed, getPicsumUrl, getPuzzleTextureKey } from '../utils';

export class Boot extends Phaser.Scene {
  constructor() {
    super(KEY.SCENE.BOOT);
  }

  preload() {
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        '🧩 Loading puzzle...',
        {
          fontFamily: FONT_FAMILY,
          fontSize: 24,
          color: COLOR.MUTED,
        },
      )
      .setOrigin(0.5);

    const seed = createSeed();

    this.registry.set(KEY.DATA.SEED, seed);
    this.load.image(getPuzzleTextureKey(seed), getPicsumUrl(seed));
  }

  create() {
    this.scene.start(KEY.SCENE.GAME);
  }
}

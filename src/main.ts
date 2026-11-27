import Phaser from 'phaser';

import { COLOR, LAYOUT } from './constants';
import * as scenes from './scenes';

new Phaser.Game({
  width: LAYOUT.WIDTH,
  height: LAYOUT.HEIGHT,
  title: 'Sliding Tiles',
  url: import.meta.env.VITE_APP_HOMEPAGE,
  version: import.meta.env.VITE_APP_VERSION,
  scene: [
    scenes.Boot,
    ...Object.values(scenes).filter((scene) => scene !== scenes.Boot),
  ],
  disableContextMenu: import.meta.env.PROD,
  backgroundColor: COLOR.BACKGROUND,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
});

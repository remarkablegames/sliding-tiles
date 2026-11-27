import Phaser from 'phaser';

import { PUZZLE } from '../constants';

export function createSeed(): string {
  return Phaser.Utils.String.UUID();
}

export function getPicsumUrl(seed: string): string {
  const size = String(PUZZLE.IMAGE_SIZE);

  return `https://picsum.photos/seed/${seed}/${size}/${size}`;
}

export function getPuzzleTextureKey(seed: string): string {
  return `puzzle-${seed}`;
}

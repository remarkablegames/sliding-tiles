import Phaser from 'phaser';

import { COLOR, type Difficulty, LAYOUT, PUZZLE } from '../constants';
import { Tile } from './Tile';

interface KeyBinding {
  event: string;
  handler: () => void;
}

interface DirectionBinding {
  event: string;
  dx: number;
  dy: number;
}

export class PuzzleBoard {
  private readonly scene: Phaser.Scene;
  private readonly size: Difficulty;
  private readonly textureKey: string;
  private readonly onMove: () => void;
  private readonly onSolve: () => void;
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly missingTile: Tile;
  private readonly tiles: Tile[] = [];
  private readonly keyBindings: KeyBinding[] = [];
  private readonly cellSize: number;
  private readonly tileSize: number;
  private boardX: number;
  private boardY: number;
  private readonly blankValue: number;
  private cells: (Tile | null)[] = [];
  private blankIndex: number;
  private locked = false;
  private animating = false;

  constructor(
    scene: Phaser.Scene,
    size: Difficulty,
    textureKey: string,
    onMove: () => void,
    onSolve: () => void,
  ) {
    this.scene = scene;
    this.size = size;
    this.textureKey = textureKey;
    this.onMove = onMove;
    this.onSolve = onSolve;
    this.blankValue = size * size - 1;
    this.cellSize = LAYOUT.BOARD.SIZE / size;
    this.tileSize = this.cellSize - PUZZLE.GAP;

    this.boardX = this.scene.scale.width / 2 - LAYOUT.BOARD.SIZE / 2;
    this.boardY = this.scene.scale.height / 2 - LAYOUT.BOARD.SIZE / 2;

    this.background = scene.add
      .rectangle(
        this.boardX,
        this.boardY,
        LAYOUT.BOARD.SIZE,
        LAYOUT.BOARD.SIZE,
        COLOR.BOARD,
      )
      .setOrigin(0)
      .setStrokeStyle(1, COLOR.BOARD_BORDER, 0.7);

    this.ensureFrames();
    this.createTiles();

    const blankPosition = this.getCellPosition(this.blankValue);

    this.missingTile = new Tile(
      scene,
      blankPosition.x,
      blankPosition.y,
      textureKey,
      this.getFrameName(this.blankValue),
      this.blankValue,
    );
    this.missingTile.setDisplaySize(this.tileSize, this.tileSize);
    this.missingTile.setVisible(false);

    this.blankIndex = this.blankValue;
    this.createKeyboardInput();
    this.shuffle();
  }

  reset(): void {
    this.shuffle();
  }

  setLocked(locked: boolean): void {
    this.locked = locked;

    if (locked) {
      this.cancelAnimations();
    }
  }

  isSolved(): boolean {
    return this.cells.every((tile, index) =>
      tile === null ? index === this.blankValue : tile.value === index,
    );
  }

  destroy(): void {
    this.removeKeyboardInput();

    for (const tile of this.tiles) {
      this.scene.tweens.killTweensOf(tile);
      tile.destroy();
    }

    this.tiles.length = 0;
    this.cells = [];

    this.scene.tweens.killTweensOf(this.missingTile);
    this.missingTile.destroy();
    this.background.destroy();
  }

  private ensureFrames(): void {
    const texture = this.scene.textures.get(this.textureKey);
    const source = texture.source[0];
    const cropSize = Math.min(source.width, source.height);
    const offsetX = (source.width - cropSize) / 2;
    const offsetY = (source.height - cropSize) / 2;
    const sourceTileSize = Math.floor(cropSize / this.size);

    for (let value = 0; value < this.size * this.size; value++) {
      const frameName = this.getFrameName(value);

      if (texture.has(frameName)) {
        continue;
      }

      const row = Math.floor(value / this.size);
      const col = value % this.size;

      texture.add(
        frameName,
        0,
        Math.floor(offsetX + col * sourceTileSize),
        Math.floor(offsetY + row * sourceTileSize),
        sourceTileSize,
        sourceTileSize,
      );
    }
  }

  private createTiles(): void {
    this.cells = Array.from({ length: this.size * this.size }, (_, index) => {
      if (index === this.blankValue) {
        return null;
      }

      const tile = new Tile(
        this.scene,
        0,
        0,
        this.textureKey,
        this.getFrameName(index),
        index,
      );

      tile.setDisplaySize(this.tileSize, this.tileSize);
      tile.setInteractive({ useHandCursor: true });
      tile.on(Phaser.Input.Events.POINTER_DOWN, () => {
        const currentIndex = this.cells.indexOf(tile);

        if (currentIndex !== -1) {
          this.tryMove(currentIndex);
        }
      });

      this.tiles.push(tile);

      return tile;
    });
  }

  private getFrameName(value: number): string {
    return `tile-${String(this.size)}-${String(value)}`;
  }

  private getCellPosition(index: number): { x: number; y: number } {
    const row = Math.floor(index / this.size);
    const col = index % this.size;

    return {
      x: this.boardX + col * this.cellSize + PUZZLE.GAP / 2,
      y: this.boardY + row * this.cellSize + PUZZLE.GAP / 2,
    };
  }

  private layoutTiles(): void {
    this.cells.forEach((tile, index) => {
      if (!tile) {
        return;
      }

      const position = this.getCellPosition(index);
      tile.setPosition(position.x, position.y);
    });
  }

  resize(width: number, height: number): void {
    this.boardX = width / 2 - LAYOUT.BOARD.SIZE / 2;
    this.boardY = height / 2 - LAYOUT.BOARD.SIZE / 2;

    this.background.setPosition(this.boardX, this.boardY);
    this.layoutTiles();
  }

  private cancelAnimations(): void {
    for (const tile of this.tiles) {
      this.scene.tweens.killTweensOf(tile);
    }

    this.animating = false;
    this.layoutTiles();
  }

  private shuffle(): void {
    this.locked = false;
    this.animating = false;

    for (const tile of this.tiles) {
      this.scene.tweens.killTweensOf(tile);
    }

    this.scene.tweens.killTweensOf(this.missingTile);
    this.missingTile.setVisible(false).setAlpha(1);

    let previousBlank = -1;
    const totalMoves = this.size * this.size * PUZZLE.SHUFFLE_MOVES_PER_CELL;

    for (let index = 0; index < totalMoves; index++) {
      const candidates = this.getNeighbors(this.blankIndex).filter(
        (neighbor) => neighbor !== previousBlank,
      );
      const next = Phaser.Utils.Array.GetRandom(candidates);

      previousBlank = this.blankIndex;
      this.swap(next);
    }

    if (this.isSolved()) {
      const candidates = this.getNeighbors(this.blankIndex);
      this.swap(Phaser.Utils.Array.GetRandom(candidates));
    }

    this.layoutTiles();
  }

  private getNeighbors(index: number): number[] {
    const row = Math.floor(index / this.size);
    const col = index % this.size;
    const neighbors: number[] = [];

    if (row > 0) {
      neighbors.push(index - this.size);
    }

    if (row < this.size - 1) {
      neighbors.push(index + this.size);
    }

    if (col > 0) {
      neighbors.push(index - 1);
    }

    if (col < this.size - 1) {
      neighbors.push(index + 1);
    }

    return neighbors;
  }

  private swap(index: number): void {
    const tile = this.cells[index];

    if (!tile) {
      return;
    }

    const previousBlank = this.blankIndex;

    this.cells[previousBlank] = tile;
    this.cells[index] = null;
    this.blankIndex = index;
  }

  private tryMove(index: number): boolean {
    if (this.locked || this.animating) {
      return false;
    }

    const tile = this.cells[index];

    if (!tile || !this.isAdjacent(index)) {
      return false;
    }

    const previousBlank = this.blankIndex;

    this.cells[previousBlank] = tile;
    this.cells[index] = null;
    this.blankIndex = index;

    const target = this.getCellPosition(previousBlank);

    this.animating = true;
    this.onMove();

    this.scene.tweens.add({
      targets: tile,
      x: target.x,
      y: target.y,
      duration: PUZZLE.TWEEN_DURATION,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.animating = false;

        if (this.isSolved()) {
          this.locked = true;
          this.revealMissingTile();
          this.onSolve();
        }
      },
    });

    return true;
  }

  private isAdjacent(index: number): boolean {
    const row = Math.floor(index / this.size);
    const col = index % this.size;
    const blankRow = Math.floor(this.blankIndex / this.size);
    const blankCol = this.blankIndex % this.size;

    return Math.abs(row - blankRow) + Math.abs(col - blankCol) === 1;
  }

  private revealMissingTile(): void {
    const position = this.getCellPosition(this.blankValue);

    this.missingTile
      .setPosition(position.x, position.y)
      .setVisible(true)
      .setAlpha(0);

    this.scene.tweens.add({
      targets: this.missingTile,
      alpha: 1,
      duration: 300,
      ease: 'Sine.easeOut',
    });
  }

  private createKeyboardInput(): void {
    const keyboard = this.scene.input.keyboard;

    if (!keyboard) {
      return;
    }

    const bindings: DirectionBinding[] = [
      { event: 'keydown-LEFT', dx: -1, dy: 0 },
      { event: 'keydown-A', dx: -1, dy: 0 },
      { event: 'keydown-RIGHT', dx: 1, dy: 0 },
      { event: 'keydown-D', dx: 1, dy: 0 },
      { event: 'keydown-UP', dx: 0, dy: -1 },
      { event: 'keydown-W', dx: 0, dy: -1 },
      { event: 'keydown-DOWN', dx: 0, dy: 1 },
      { event: 'keydown-S', dx: 0, dy: 1 },
    ];

    for (const { event, dx, dy } of bindings) {
      const handler = () => {
        this.moveDirection(dx, dy);
      };

      keyboard.on(event, handler);
      this.keyBindings.push({ event, handler });
    }

    keyboard.addCapture('LEFT,RIGHT,UP,DOWN,W,A,S,D');
  }

  private removeKeyboardInput(): void {
    const keyboard = this.scene.input.keyboard;

    if (keyboard) {
      for (const { event, handler } of this.keyBindings) {
        keyboard.off(event, handler);
      }

      keyboard.removeCapture('LEFT,RIGHT,UP,DOWN,W,A,S,D');
    }

    this.keyBindings.length = 0;
  }

  private moveDirection(dx: number, dy: number): void {
    const blankRow = Math.floor(this.blankIndex / this.size);
    const blankCol = this.blankIndex % this.size;
    const tileRow = blankRow - dy;
    const tileCol = blankCol - dx;

    if (
      tileRow < 0 ||
      tileRow >= this.size ||
      tileCol < 0 ||
      tileCol >= this.size
    ) {
      return;
    }

    this.tryMove(tileRow * this.size + tileCol);
  }
}

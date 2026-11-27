import Phaser from 'phaser';
import { render } from 'phaser-jsx';

import {
  Hud,
  type HudHandle,
  WinOverlay,
  type WinOverlayHandle,
} from '../components';
import { DEFAULT_DIFFICULTY, type Difficulty, KEY } from '../constants';
import { PuzzleBoard } from '../gameobjects';
import {
  type BestScore,
  type BestScores,
  createSeed,
  getPicsumUrl,
  getPuzzleTextureKey,
  isBetterScore,
  loadBestScores,
  saveBestScores,
} from '../utils';

export class Game extends Phaser.Scene {
  private board?: PuzzleBoard;
  private hud!: HudHandle;
  private overlay!: WinOverlayHandle;
  private timerEvent?: Phaser.Time.TimerEvent;
  private bestScores: BestScores = {};
  private difficulty: Difficulty = DEFAULT_DIFFICULTY;
  private moves = 0;
  private startedAt: number | null = null;
  private seed = '';
  private textureKey = '';
  private loading = false;

  constructor() {
    super(KEY.SCENE.GAME);
  }

  create() {
    this.bestScores = loadBestScores();
    this.difficulty = DEFAULT_DIFFICULTY;
    this.moves = 0;
    this.startedAt = null;
    this.loading = false;

    const storedSeed = this.registry.get(KEY.DATA.SEED) as unknown;

    this.seed =
      typeof storedSeed === 'string' && storedSeed.length > 0
        ? storedSeed
        : createSeed();
    this.textureKey = getPuzzleTextureKey(this.seed);

    render(
      <Hud
        onReady={(handle) => {
          this.hud = handle;
        }}
        onNewGame={() => {
          this.startNewGame();
        }}
        onNewImage={() => {
          this.loadNewImage();
        }}
        onSelectDifficulty={(size) => {
          this.changeDifficulty(size);
        }}
      />,
      this,
    );

    render(
      <WinOverlay
        onReady={(handle) => {
          this.overlay = handle;
        }}
        onPlayAgain={() => {
          this.startNewGame();
        }}
        onNewImage={() => {
          this.loadNewImage();
        }}
      />,
      this,
    );

    this.hud.setDifficulty(this.difficulty);
    this.hud.setBest(this.bestScores[this.difficulty] ?? null);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      paused: true,
      callback: () => {
        this.updateTimer();
      },
    });

    if (this.textures.exists(this.textureKey)) {
      this.createBoard();
    } else {
      this.hud.setStatus("Couldn't load a photo. Try New Image.");
    }
  }

  private createBoard(): void {
    this.board?.destroy();
    this.board = undefined;
    this.resetRun();

    this.board = new PuzzleBoard(
      this,
      this.difficulty,
      this.textureKey,
      () => {
        this.handleMove();
      },
      () => {
        this.handleSolve();
      },
    );

    this.hud.setStatus('');
    this.hud.setDifficulty(this.difficulty);
    this.hud.setBest(this.bestScores[this.difficulty] ?? null);
  }

  private resetRun(): void {
    this.moves = 0;
    this.startedAt = null;

    if (this.timerEvent) {
      this.timerEvent.paused = true;
    }

    this.hud.setMoves(0);
    this.hud.setElapsed(0);
    this.overlay.hide();
  }

  private handleMove(): void {
    this.moves += 1;
    this.hud.setMoves(this.moves);

    if (this.startedAt === null) {
      this.startedAt = this.time.now;

      if (this.timerEvent) {
        this.timerEvent.paused = false;
      }
    }
  }

  private updateTimer(): void {
    if (this.startedAt === null) {
      return;
    }

    this.hud.setElapsed(this.getElapsedSeconds());
  }

  private getElapsedSeconds(): number {
    if (this.startedAt === null) {
      return 0;
    }

    return Math.floor((this.time.now - this.startedAt) / 1000);
  }

  private handleSolve(): void {
    const elapsed = this.getElapsedSeconds();

    if (this.timerEvent) {
      this.timerEvent.paused = true;
    }

    this.hud.setElapsed(elapsed);

    const previousBest = this.bestScores[this.difficulty] ?? null;
    const score: BestScore = { time: elapsed, moves: this.moves };
    const isNewBest = isBetterScore(score, previousBest);
    let best = previousBest;

    if (isNewBest) {
      best = score;
      this.bestScores = { ...this.bestScores, [this.difficulty]: score };
      saveBestScores(this.bestScores);
      this.hud.setBest(score);
    }

    this.overlay.show({
      moves: this.moves,
      elapsed,
      best,
      isNewBest,
    });
  }

  private startNewGame(): void {
    if (this.loading) {
      return;
    }

    if (!this.textures.exists(this.textureKey)) {
      this.hud.setStatus("Couldn't load a photo. Try New Image.");
      return;
    }

    this.hud.setStatus('');
    this.resetRun();

    if (this.board) {
      this.board.reset();
    } else {
      this.createBoard();
    }
  }

  private changeDifficulty(size: Difficulty): void {
    if (this.loading || size === this.difficulty) {
      return;
    }

    this.difficulty = size;
    this.hud.setDifficulty(size);
    this.hud.setBest(this.bestScores[size] ?? null);

    if (!this.textures.exists(this.textureKey)) {
      this.hud.setStatus("Couldn't load a photo. Try New Image.");
      return;
    }

    this.createBoard();
  }

  private loadNewImage(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.overlay.hide();
    this.board?.setLocked(true);
    this.hud.setStatus('Loading a new photo...');

    const wasTimerRunning = this.timerEvent?.paused === false;
    const pausedAt = this.time.now;

    if (this.timerEvent) {
      this.timerEvent.paused = true;
    }

    const seed = createSeed();
    const textureKey = getPuzzleTextureKey(seed);
    const previousTextureKey = this.textureKey;

    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.loading = false;

      if (!this.textures.exists(textureKey)) {
        if (this.board?.isSolved()) {
          this.startNewGame();
        } else {
          this.board?.setLocked(false);

          if (wasTimerRunning && this.startedAt !== null) {
            this.startedAt += this.time.now - pausedAt;

            if (this.timerEvent) {
              this.timerEvent.paused = false;
            }
          }
        }

        this.hud.setStatus("Couldn't load a photo. Try again.");

        return;
      }

      this.seed = seed;
      this.textureKey = textureKey;
      this.registry.set(KEY.DATA.SEED, seed);

      this.board?.destroy();
      this.board = undefined;

      if (
        this.textures.exists(previousTextureKey) &&
        previousTextureKey !== textureKey
      ) {
        this.textures.remove(previousTextureKey);
      }

      this.createBoard();
    });

    this.load.image(textureKey, getPicsumUrl(seed));
    this.load.start();
  }
}

import { DIFFICULTIES, type Difficulty } from '../constants';

export const STORAGE_KEY = 'org.remarkablegames.sliding-tiles';

export interface BestScore {
  time: number;
  moves: number;
}

export type BestScores = Partial<Record<Difficulty, BestScore>>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDifficulty(value: number): value is Difficulty {
  return DIFFICULTIES.some((difficulty) => difficulty === value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    Number.isInteger(value) &&
    value >= 0
  );
}

function isBestScore(value: unknown): value is BestScore {
  if (!isRecord(value)) {
    return false;
  }

  return isNonNegativeInteger(value.time) && isNonNegativeInteger(value.moves);
}

export function loadBestScores(): BestScores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === null) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!isRecord(parsed)) {
      return {};
    }

    const scores: BestScores = {};

    for (const [key, value] of Object.entries(parsed)) {
      const size = Number(key);

      if (!isDifficulty(size) || !isBestScore(value)) {
        continue;
      }

      scores[size] = value;
    }

    return scores;
  } catch {
    return {};
  }
}

export function saveBestScores(scores: BestScores): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    // Storage can be unavailable in private browsing or when the quota is full.
  }
}

export function isBetterScore(
  next: BestScore,
  current: BestScore | null,
): boolean {
  if (current === null) {
    return true;
  }

  return (
    next.time < current.time ||
    (next.time === current.time && next.moves < current.moves)
  );
}

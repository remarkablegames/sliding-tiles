import { configure } from 'websfx';

import { STORAGE_KEY } from './storage';

interface SoundConfig {
  enabled: boolean;
  volume: number;
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function loadSoundConfig(): SoundConfig {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw === null) {
    return { enabled: true, volume: 1 };
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      const record = parsed as Record<string, unknown>;
      const enabled = isBoolean(record.enabled) ? record.enabled : true;
      const volume = isFiniteNumber(record.volume) ? record.volume : 1;

      return { enabled, volume };
    }
  } catch {
    return { enabled: true, volume: 1 };
  }

  return { enabled: true, volume: 1 };
}

export function configureSound(next?: Partial<SoundConfig>): SoundConfig {
  const current = loadSoundConfig();
  const enabled = next?.enabled ?? current.enabled;
  const volume = next?.volume ?? current.volume;

  configure({ volume: enabled ? volume : 0 });

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let existing: Record<string, unknown> = {};

    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          !Array.isArray(parsed)
        ) {
          existing = parsed as Record<string, unknown>;
        }
      } catch {
        existing = {};
      }
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...existing, enabled, volume }),
    );
  } catch {
    // Storage can be unavailable in private browsing or when the quota is full.
  }

  return { enabled, volume };
}

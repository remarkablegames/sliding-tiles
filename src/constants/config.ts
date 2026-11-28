export const DIFFICULTIES = [3, 4, 5] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export const DEFAULT_DIFFICULTY: Difficulty = 3;

export const PUZZLE = {
  IMAGE_SIZE: 1024,
  GAP: 4,
  TWEEN_DURATION: 120, // ms
  SHUFFLE_MOVES_PER_CELL: 50,
} as const;

export const HINT = {
  ALPHA: 0.92,
  FADE_DURATION: 180, // ms
} as const;

export const LAYOUT = {
  WIDTH: 800,
  HEIGHT: 600,
  BOARD: {
    X: 160,
    Y: 84,
    SIZE: 480,
  },
  HUD: {
    PADDING: 24,
  },
} as const;

export const FONT_FAMILY = '"Lucida Grande", Helvetica, Arial, sans-serif';

export const COLOR = {
  BACKGROUND: '#0b1220',
  BOARD: 0x111827,
  BOARD_BORDER: 0x334155,
  PANEL: 0x1e293b,
  PANEL_BORDER: 0x475569,
  TEXT: '#e2e8f0',
  MUTED: '#94a3b8',
  ACCENT: '#38bdf8',
  BUTTON_BG: '#1e293b',
  BUTTON_ACTIVE_TEXT: '#082f49',
  BUTTON_HOVER_BG: '#334155',
  BUTTON_HOVER_TEXT: '#ffffff',
  OVERLAY: 0x020617,
} as const;

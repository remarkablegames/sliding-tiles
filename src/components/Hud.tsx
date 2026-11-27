import { Fragment, Text, useState } from 'phaser-jsx';
import type { Dispatch, SetStateAction } from 'react';

import {
  COLOR,
  DEFAULT_DIFFICULTY,
  DIFFICULTIES,
  type Difficulty,
  FONT_FAMILY,
  LAYOUT,
} from '../constants';
import { type BestScore, formatTime } from '../utils';

export interface HudHandle {
  setMoves: Dispatch<SetStateAction<number>>;
  setElapsed: Dispatch<SetStateAction<number>>;
  setBest: Dispatch<SetStateAction<BestScore | null>>;
  setDifficulty: Dispatch<SetStateAction<Difficulty>>;
  setStatus: Dispatch<SetStateAction<string>>;
}

interface HudProps {
  onReady: (handle: HudHandle) => void;
  onNewGame: () => void;
  onNewImage: () => void;
  onSelectDifficulty: (size: Difficulty) => void;
}

const TEXT_STYLE = {
  fontFamily: FONT_FAMILY,
  color: COLOR.TEXT,
};

const BUTTON_Y = 568;

function getButtonStyle(active: boolean) {
  return {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    color: active ? COLOR.BUTTON_ACTIVE_TEXT : COLOR.TEXT,
    backgroundColor: active ? COLOR.ACCENT : COLOR.BUTTON_BG,
    padding: { x: 10, y: 5 },
  };
}

export function Hud({
  onReady,
  onNewGame,
  onNewImage,
  onSelectDifficulty,
}: HudProps) {
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<BestScore | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  const [status, setStatus] = useState('');

  onReady({ setMoves, setElapsed, setBest, setDifficulty, setStatus });

  const statsX = LAYOUT.WIDTH - LAYOUT.HUD.PADDING;

  return (
    <Fragment>
      <Text
        x={LAYOUT.HUD.PADDING}
        y={14}
        text="Sliding Tiles"
        style={{ ...TEXT_STYLE, fontSize: 28, fontStyle: 'bold' }}
        originX={0}
        originY={0}
      />

      <Text
        x={LAYOUT.HUD.PADDING}
        y={52}
        text="Click a tile beside a gap, or use arrow keys / WASD."
        style={{ ...TEXT_STYLE, fontSize: 13, color: COLOR.MUTED }}
        originX={0}
        originY={0}
      />

      <Text
        x={statsX}
        y={14}
        text={`Moves: ${String(moves)}`}
        style={{ ...TEXT_STYLE, fontSize: 20 }}
        originX={1}
        originY={0}
      />

      <Text
        x={statsX}
        y={40}
        text={`Time: ${formatTime(elapsed)}`}
        style={{ ...TEXT_STYLE, fontSize: 20 }}
        originX={1}
        originY={0}
      />

      <Text
        x={statsX}
        y={64}
        text={
          best
            ? `Best: ${formatTime(best.time)} · ${String(best.moves)} moves`
            : 'Best: N/A'
        }
        style={{ ...TEXT_STYLE, fontSize: 13, color: COLOR.MUTED }}
        originX={1}
        originY={0}
      />

      {status && (
        <Text
          x={LAYOUT.WIDTH / 2}
          y={14}
          text={status}
          style={{ ...TEXT_STYLE, fontSize: 13, color: COLOR.MUTED }}
          originX={0.5}
          originY={0}
        />
      )}

      {DIFFICULTIES.map((size, index) => (
        <Text
          x={LAYOUT.BOARD.X + index * 68}
          y={BUTTON_Y}
          text={`${String(size)}×${String(size)}`}
          style={getButtonStyle(size === difficulty)}
          originX={0}
          originY={0}
          input={{ useHandCursor: true }}
          onPointerDown={() => {
            onSelectDifficulty(size);
          }}
        />
      ))}

      <Text
        x={LAYOUT.BOARD.X + LAYOUT.BOARD.SIZE - 120}
        y={BUTTON_Y}
        text="New Game"
        style={getButtonStyle(false)}
        originX={1}
        originY={0}
        input={{ useHandCursor: true }}
        onPointerDown={onNewGame}
      />

      <Text
        x={LAYOUT.BOARD.X + LAYOUT.BOARD.SIZE}
        y={BUTTON_Y}
        text="New Image"
        style={getButtonStyle(false)}
        originX={1}
        originY={0}
        input={{ useHandCursor: true }}
        onPointerDown={onNewImage}
      />
    </Fragment>
  );
}

import { Container, Fragment, Text, useState } from 'phaser-jsx';
import type { Dispatch, SetStateAction } from 'react';

import {
  COLOR,
  DEFAULT_DIFFICULTY,
  DIFFICULTIES,
  type Difficulty,
  FONT_FAMILY,
} from '../constants';
import { type BestScore, formatTime } from '../utils';

export interface HudHandle {
  setMoves: Dispatch<SetStateAction<number>>;
  setElapsed: Dispatch<SetStateAction<number>>;
  setBest: Dispatch<SetStateAction<BestScore | null>>;
  setDifficulty: Dispatch<SetStateAction<Difficulty>>;
  setStatus: Dispatch<SetStateAction<string>>;
  resize: (
    width: number,
    boardX: number,
    boardY: number,
    boardSize: number,
  ) => void;
}

interface HudProps {
  onReady: (handle: HudHandle) => void;
  onNewGame: () => void;
  onNewImage: () => void;
  onSelectDifficulty: (size: Difficulty) => void;
  width: number;
  boardX: number;
  boardY: number;
  boardSize: number;
}

const TEXT_STYLE = {
  fontFamily: FONT_FAMILY,
  color: COLOR.TEXT,
  padding: { bottom: 4 },
};

const HEADER_TOP = 85;
const FOOTER_GAP = 15;

function getButtonStyle(active: boolean) {
  return {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    color: active ? COLOR.BUTTON_ACTIVE_TEXT : COLOR.TEXT,
    backgroundColor: active ? COLOR.ACCENT : COLOR.BUTTON_BG,
    padding: { x: 14, y: 8 },
  };
}

export function Hud({
  onReady,
  onNewGame,
  onNewImage,
  onSelectDifficulty,
  width,
  boardX,
  boardY,
  boardSize,
}: HudProps) {
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<BestScore | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  const [status, setStatus] = useState('');
  const [layout, setLayout] = useState({ width, boardX, boardY, boardSize });

  onReady({
    setMoves,
    setElapsed,
    setBest,
    setDifficulty,
    setStatus,
    resize: (nextWidth, nextBoardX, nextBoardY, nextBoardSize) => {
      setLayout({
        width: nextWidth,
        boardX: nextBoardX,
        boardY: nextBoardY,
        boardSize: nextBoardSize,
      });
    },
  });

  const bestText = best
    ? `Best: ${formatTime(best.time)} · ${String(best.moves)} moves`
    : 'Best: N/A';

  return (
    <Fragment>
      <Container x={layout.width / 2} y={HEADER_TOP}>
        <Text
          x={0}
          y={0}
          text="Sliding Tiles"
          style={{ ...TEXT_STYLE, fontSize: 40, fontStyle: 'bold' }}
          originX={0.5}
          originY={0}
        />

        <Text
          x={0}
          y={58}
          text="Click a tile beside a gap, or use arrow keys / WASD"
          style={{ ...TEXT_STYLE, fontSize: 17, color: COLOR.MUTED }}
          originX={0.5}
          originY={0}
        />

        <Text
          x={0}
          y={86}
          text={[
            `Moves: ${String(moves)}`,
            `Time: ${formatTime(elapsed)}`,
            bestText,
          ].join('   |   ')}
          style={{ ...TEXT_STYLE, fontSize: 19 }}
          originX={0.5}
          originY={0}
        />

        {status && (
          <Text
            x={0}
            y={120}
            text={status}
            style={{ ...TEXT_STYLE, fontSize: 16, color: COLOR.MUTED }}
            originX={0.5}
            originY={0}
          />
        )}
      </Container>

      <Container
        x={layout.boardX + layout.boardSize / 2}
        y={layout.boardY + layout.boardSize + FOOTER_GAP}
      >
        {DIFFICULTIES.slice()
          .reverse()
          .map((size, index) => ({
            label: `${String(size)}×${String(size)}`,
            active: size === difficulty,
            onPress: () => {
              onSelectDifficulty(size);
            },
            x: (index + 1) * -70 + 30,
          }))
          .concat(
            { label: 'Shuffle', active: false, onPress: onNewGame, x: 41 },
            { label: 'New Puzzle', active: false, onPress: onNewImage, x: 153 },
          )
          .map((item) => (
            <Text
              x={item.x}
              y={0}
              text={item.label}
              style={getButtonStyle(item.active)}
              originX={0.5}
              originY={0}
              input={{ useHandCursor: true }}
              onPointerDown={item.onPress}
            />
          ))}
      </Container>
    </Fragment>
  );
}

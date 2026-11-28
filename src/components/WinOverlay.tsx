import { Container, Rectangle, Text, useState } from 'phaser-jsx';

import { COLOR, FONT_FAMILY } from '../constants';
import { type BestScore, formatTime } from '../utils';
import { Button } from './Button';

export interface WinStats {
  moves: number;
  elapsed: number;
  best: BestScore | null;
  isNewBest: boolean;
}

export interface WinOverlayHandle {
  show: (stats: WinStats) => void;
  hide: () => void;
  resize: (width: number, height: number) => void;
}

interface WinOverlayProps {
  onReady: (handle: WinOverlayHandle) => void;
  onPlayAgain: () => void;
  onNewImage: () => void;
  width: number;
  height: number;
}

export function WinOverlay({
  onReady,
  onPlayAgain,
  onNewImage,
  width,
  height,
}: WinOverlayProps) {
  const [stats, setStats] = useState<WinStats | null>(null);
  const [layout, setLayout] = useState({ width, height });

  const centerX = layout.width / 2;
  const centerY = layout.height / 2;

  onReady({
    show: setStats,
    hide: () => {
      setStats(null);
    },
    resize: (nextWidth: number, nextHeight: number) => {
      setLayout({ width: nextWidth, height: nextHeight });
    },
  });

  if (!stats) {
    return null;
  }

  const bestText = stats.isNewBest
    ? 'New best!'
    : stats.best
      ? `Best ${formatTime(stats.best.time)} · ${String(stats.best.moves)} moves`
      : '';

  return (
    <Container x={centerX} y={centerY}>
      <Rectangle
        x={0}
        y={0}
        width={layout.width}
        height={layout.height}
        fillColor={COLOR.OVERLAY}
        fillAlpha={0.65}
        originX={0.5}
        originY={0.5}
      />

      <Rectangle
        x={0}
        y={0}
        width={450}
        height={250}
        fillColor={COLOR.PANEL}
        fillAlpha={0.98}
        originX={0.5}
        originY={0.5}
        isStroked={false}
        lineWidth={1}
        strokeColor={COLOR.PANEL_BORDER}
        strokeAlpha={0.8}
      />

      <Text
        x={0}
        y={-70}
        text="🎉 Solved!"
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 44,
          fontStyle: 'bold',
          color: COLOR.ACCENT,
        }}
        originX={0.5}
      />

      <Text
        x={0}
        y={-16}
        text={`Time ${formatTime(stats.elapsed)} · ${String(stats.moves)} moves`}
        style={{ fontFamily: FONT_FAMILY, fontSize: 20, color: COLOR.TEXT }}
        originX={0.5}
      />

      <Text
        x={0}
        y={22}
        text={bestText}
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 17,
          color: stats.isNewBest ? COLOR.ACCENT : COLOR.MUTED,
        }}
        originX={0.5}
      />

      <Button
        x={-70}
        y={70}
        variant="secondary"
        originX={0.5}
        onClick={onPlayAgain}
      >
        Play Again
      </Button>

      <Button
        x={70}
        y={70}
        variant="primary"
        originX={0.5}
        onClick={onNewImage}
      >
        New Puzzle
      </Button>
    </Container>
  );
}

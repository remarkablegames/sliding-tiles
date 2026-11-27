import { Container, Rectangle, Text, useState } from 'phaser-jsx';

import { COLOR, FONT_FAMILY } from '../constants';
import { type BestScore, formatTime } from '../utils';

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

const BUTTON_STYLE = {
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  color: COLOR.TEXT,
  backgroundColor: COLOR.BUTTON_BG,
  padding: { x: 14, y: 8 },
};

const PRIMARY_BUTTON_STYLE = {
  ...BUTTON_STYLE,
  color: COLOR.BUTTON_ACTIVE_TEXT,
  backgroundColor: COLOR.ACCENT,
};

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
        ref={(rectangle) => {
          rectangle.setStrokeStyle(1, COLOR.PANEL_BORDER, 0.8);
        }}
        x={0}
        y={0}
        width={460}
        height={280}
        fillColor={COLOR.PANEL}
        fillAlpha={0.98}
        originX={0.5}
        originY={0.5}
      />

      <Text
        x={0}
        y={-84}
        text="Solved!"
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
        style={{ fontFamily: FONT_FAMILY, fontSize: 22, color: COLOR.TEXT }}
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

      <Text
        x={-115}
        y={88}
        text="Play Again"
        style={PRIMARY_BUTTON_STYLE}
        originX={0.5}
        input={{ useHandCursor: true }}
        onPointerDown={onPlayAgain}
      />

      <Text
        x={115}
        y={88}
        text="New Image"
        style={BUTTON_STYLE}
        originX={0.5}
        input={{ useHandCursor: true }}
        onPointerDown={onNewImage}
      />
    </Container>
  );
}

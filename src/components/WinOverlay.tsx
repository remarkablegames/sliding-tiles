import { Fragment, Rectangle, Text, useState } from 'phaser-jsx';

import { COLOR, FONT_FAMILY, LAYOUT } from '../constants';
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
}

interface WinOverlayProps {
  onReady: (handle: WinOverlayHandle) => void;
  onPlayAgain: () => void;
  onNewImage: () => void;
}

const CENTER_X = LAYOUT.WIDTH / 2;
const CENTER_Y = LAYOUT.HEIGHT / 2;

const BUTTON_STYLE = {
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  color: COLOR.TEXT,
  backgroundColor: COLOR.BUTTON_BG,
  padding: { x: 12, y: 6 },
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
}: WinOverlayProps) {
  const [stats, setStats] = useState<WinStats | null>(null);

  onReady({
    show: setStats,
    hide: () => {
      setStats(null);
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
    <Fragment>
      <Rectangle
        x={CENTER_X}
        y={CENTER_Y}
        width={LAYOUT.WIDTH}
        height={LAYOUT.HEIGHT}
        fillColor={COLOR.OVERLAY}
        fillAlpha={0.65}
        originX={0.5}
      />

      <Rectangle
        ref={(rectangle) => {
          rectangle.setStrokeStyle(1, COLOR.PANEL_BORDER, 0.8);
        }}
        x={CENTER_X}
        y={CENTER_Y}
        width={420}
        height={260}
        fillColor={COLOR.PANEL}
        fillAlpha={0.98}
        originX={0.5}
      />

      <Text
        x={CENTER_X}
        y={CENTER_Y - 78}
        text="Solved!"
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 40,
          fontStyle: 'bold',
          color: COLOR.ACCENT,
        }}
        originX={0.5}
      />

      <Text
        x={CENTER_X}
        y={CENTER_Y - 18}
        text={`Time ${formatTime(stats.elapsed)} · ${String(stats.moves)} moves`}
        style={{ fontFamily: FONT_FAMILY, fontSize: 20, color: COLOR.TEXT }}
        originX={0.5}
      />

      <Text
        x={CENTER_X}
        y={CENTER_Y + 18}
        text={bestText}
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 15,
          color: stats.isNewBest ? COLOR.ACCENT : COLOR.MUTED,
        }}
        originX={0.5}
      />

      <Text
        x={CENTER_X - 105}
        y={CENTER_Y + 80}
        text="Play Again"
        style={PRIMARY_BUTTON_STYLE}
        originX={0.5}
        input={{ useHandCursor: true }}
        onPointerDown={onPlayAgain}
      />

      <Text
        x={CENTER_X + 105}
        y={CENTER_Y + 80}
        text="New Image"
        style={BUTTON_STYLE}
        originX={0.5}
        input={{ useHandCursor: true }}
        onPointerDown={onNewImage}
      />
    </Fragment>
  );
}

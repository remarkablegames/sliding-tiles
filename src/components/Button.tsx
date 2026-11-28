import { Text, useState } from 'phaser-jsx';

import { COLOR, FONT_FAMILY } from '../constants';

interface ButtonProps {
  children: string;
  onClick: () => void;
  active?: boolean;
  variant?: 'primary' | 'default';
  x?: number;
  y?: number;
  originX?: number;
  originY?: number;
}

export function Button({
  children,
  onClick,
  active = false,
  variant = 'default',
  x,
  y,
  originX,
  originY,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const isPrimary = active || variant === 'primary';
  const backgroundColor = hovered
    ? COLOR.BUTTON_HOVER_BG
    : isPrimary
      ? COLOR.ACCENT
      : COLOR.BUTTON_BG;
  const color = hovered
    ? COLOR.BUTTON_HOVER_TEXT
    : isPrimary
      ? COLOR.BUTTON_ACTIVE_TEXT
      : COLOR.TEXT;

  return (
    <Text
      x={x}
      y={y}
      text={children}
      style={{
        fontFamily: FONT_FAMILY,
        fontSize: 18,
        color,
        backgroundColor,
        padding: { x: 14, y: 8 },
      }}
      originX={originX}
      originY={originY}
      input={{ useHandCursor: true }}
      onPointerDown={onClick}
      onPointerOver={() => {
        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
    />
  );
}

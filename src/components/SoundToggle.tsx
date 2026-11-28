import { Text, useState } from 'phaser-jsx';

import { COLOR, FONT_FAMILY } from '../constants';
import { configureSound, loadSoundConfig } from '../utils';

export function SoundToggle({ x, y }: { x?: number; y?: number }) {
  const { enabled } = loadSoundConfig();
  const [soundEnabled, setSoundEnabled] = useState(enabled);

  const toggle = () => {
    const next = configureSound({ enabled: !soundEnabled });
    setSoundEnabled(next.enabled);
  };

  return (
    <Text
      x={x}
      y={y}
      text={soundEnabled ? '🔊' : '🔇'}
      style={{
        fontFamily: FONT_FAMILY,
        fontSize: 20,
        color: COLOR.TEXT,
      }}
      input={{ useHandCursor: true }}
      onPointerDown={toggle}
    />
  );
}

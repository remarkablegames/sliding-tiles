export function formatTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);

  return `${String(minutes)}:${String(seconds % 60).padStart(2, '0')}`;
}

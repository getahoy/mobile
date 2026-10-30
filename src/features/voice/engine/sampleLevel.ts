const LOUD_RMS = 0.35;

export function sampleLevel(frames: readonly number[]): number {
  if (frames.length === 0) return 0;
  const power = frames.reduce((sum, frame) => sum + frame * frame, 0);
  const rms = Math.sqrt(power / frames.length);
  return Math.min(1, rms / LOUD_RMS);
}

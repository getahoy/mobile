const ROOM_NOISE_DB = -45;
const LOUD_SPEECH_DB = -10;

export function voiceLevel(decibels: number | undefined): number {
  if (decibels === undefined) return 0;
  const level = (decibels - ROOM_NOISE_DB) / (LOUD_SPEECH_DB - ROOM_NOISE_DB);
  return Math.min(1, Math.max(0, level));
}

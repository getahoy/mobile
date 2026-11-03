const LAUNCH_HOLD_MS = 1000;
export const LAUNCH_REVEAL_MS = 500;
export const LAUNCH_LIFT = 24;

const appStartedAt = Date.now();

// Measured from JS start, so a slow boot that is already past the hold reveals at once.
function holdUntil(startedAt: number, readyAt: number): number {
  return Math.max(startedAt + LAUNCH_HOLD_MS, readyAt);
}

export function holdLeftMs(now: number): number {
  return holdUntil(appStartedAt, now) - now;
}

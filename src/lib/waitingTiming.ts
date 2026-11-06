export const spinnerTiming = {
  showAfterMs: 300,
  minimumVisibleMs: 500,
} as const;

export const SLOW_AFTER_MS = 6000;

// Work that ends before this never shows a spinner at all.
export function showsSpinner(busyForMs: number): boolean {
  return busyForMs >= spinnerTiming.showAfterMs;
}

// A spinner that appeared stays long enough to be read, never a flicker.
export function hideAfterMs(shownForMs: number): number {
  return Math.max(0, spinnerTiming.minimumVisibleMs - shownForMs);
}

export function isSlow(busyForMs: number, slowAfterMs: number): boolean {
  return busyForMs >= slowAfterMs;
}

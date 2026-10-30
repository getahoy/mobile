import {
  Easing,
  useReducedMotion as useReanimatedReducedMotion,
} from "react-native-reanimated";

export const duration = {
  fast: 150,
  base: 240,
  slow: 480,
} as const;

export const easing = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  spring: Easing.bezier(0.34, 1.56, 0.64, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
} as const;

export const WORD_STAGGER_MS = 60;
export const REDUCED_FADE_MS = duration.fast;

export const spinnerTiming = {
  showAfterMs: 300,
  minimumVisibleMs: 500,
} as const;

export function useReducedMotion(): boolean {
  return useReanimatedReducedMotion();
}

import { motionDurationMs, motionEasing } from "@getahoy/lib";
import {
  Easing,
  useReducedMotion as useReanimatedReducedMotion,
} from "react-native-reanimated";

export const duration = motionDurationMs;

export const easing = {
  out: Easing.bezier(...motionEasing.out),
  spring: Easing.bezier(...motionEasing.spring),
  inOut: Easing.bezier(...motionEasing.inOut),
} as const;

const easeOutCurve = Easing.bezierFn(...motionEasing.out);

export function timelinePhase(
  timeMs: number,
  delayMs: number,
  durationMs: number,
): number {
  "worklet";
  const linear = Math.min(1, Math.max(0, (timeMs - delayMs) / durationMs));
  return easeOutCurve(linear);
}

export const REDUCED_FADE_MS = duration.fast;

export function useReducedMotion(): boolean {
  return useReanimatedReducedMotion();
}

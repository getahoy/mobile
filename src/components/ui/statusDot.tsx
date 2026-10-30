import { useEffect } from "react";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/cn";
import { easing, useReducedMotion } from "@/lib/motion";

const PULSE_HALF_CYCLE_MS = 600;
const PULSE_LOW_OPACITY = 0.4;
const FOREVER = -1;

export type DotTone = "kelp" | "signal" | "fog";

const tones = {
  kelp: "bg-kelp",
  signal: "bg-signal",
  fog: "bg-fog",
} as const satisfies Record<DotTone, string>;

type StatusDotProps = { tone: DotTone; pulsing?: boolean };

export function StatusDot({ tone, pulsing = false }: StatusDotProps) {
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(opacity);
    opacity.value = 1;
    if (!pulsing || reducedMotion) return;
    const fade = withTiming(PULSE_LOW_OPACITY, {
      duration: PULSE_HALF_CYCLE_MS,
      easing: easing.inOut,
    });
    opacity.value = withRepeat(fade, FOREVER, true);
  }, [pulsing, reducedMotion, opacity]);

  const fading = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={fading}
      className={cn("size-1.5 rounded-full", tones[tone])}
    />
  );
}

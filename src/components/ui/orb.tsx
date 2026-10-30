import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/cn";
import { duration, easing, useReducedMotion } from "@/lib/motion";
import { type OrbTone, useOrbGradient } from "./orbGradient";

const BREATH_HALF_CYCLE_MS = 1600;
const BREATH_LOW_SCALE = 0.94;
const LEVEL_GROWTH = 0.25;
const LEVEL_EASE_MS = 120;
const FOREVER = -1;

export type OrbMotion = "still" | "breathe" | "level";

type OrbProps = {
  tone?: OrbTone;
  motion?: OrbMotion;
  level?: number;
  className?: string;
};

export function Orb({
  tone = "listen",
  motion = "still",
  level = 0,
  className,
}: OrbProps) {
  const reducedMotion = useReducedMotion();
  const gradient = useOrbGradient(tone);
  const scale = useSharedValue(1);
  const moving = !reducedMotion && motion !== "still";

  useEffect(() => {
    if (!moving || motion !== "breathe") return;
    scale.value = BREATH_LOW_SCALE;
    const inhale = withTiming(1, {
      duration: BREATH_HALF_CYCLE_MS,
      easing: easing.inOut,
    });
    scale.value = withRepeat(inhale, FOREVER, true);
    return () => cancelAnimation(scale);
  }, [moving, motion, scale]);

  useEffect(() => {
    if (moving && motion === "level") {
      const target = 1 + level * LEVEL_GROWTH;
      scale.value = withTiming(target, { duration: LEVEL_EASE_MS });
      return;
    }
    if (!moving) scale.value = withTiming(1, { duration: duration.fast });
  }, [moving, motion, level, scale]);

  const grow = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={grow}
      aria-hidden
      pointerEvents="none"
      className={cn("size-orb", className)}
    >
      {/* Uniwind compiles radial-gradient() to an empty string, so the orb passes it to React Native directly. */}
      <View
        className="size-full rounded-full"
        style={{ backgroundImage: gradient }}
      />
    </Animated.View>
  );
}

import { type ComponentProps, useEffect } from "react";
import type { View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/motion";

const HALF_PULSE_MS = 800;
const DIMMEST = 0.5;

function Skeleton({ className, ...props }: ComponentProps<typeof View>) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (reduced) return;
    const half = { duration: HALF_PULSE_MS, easing: Easing.inOut(Easing.ease) };
    opacity.value = withRepeat(withTiming(DIMMEST, half), -1, true);
    return () => {
      cancelAnimation(opacity);
      opacity.value = 1;
    };
  }, [opacity, reduced]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      aria-hidden
      style={style}
      className={cn("rounded-tag bg-linen", className)}
      {...props}
    />
  );
}

export { Skeleton };

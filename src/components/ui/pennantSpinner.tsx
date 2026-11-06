import { useEffect } from "react";
import { View } from "react-native";
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
import { Pennant } from "./pennant";

const TURN_MS = 900;
const PULSE_HALF_MS = 900;
const PULSE_LOW = 0.45;
const FULL_TURN = 360;
const FOREVER = -1;

const sizes = {
  md: { ring: "size-10", pennant: "sm" },
  sm: { ring: "size-7", pennant: null },
} as const;

type PennantSpinnerProps = { size?: keyof typeof sizes };

export function PennantSpinner({ size = "md" }: PennantSpinnerProps) {
  const reducedMotion = useReducedMotion();
  const turn = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(turn);
    cancelAnimation(pulse);
    if (reducedMotion) {
      const dim = withTiming(PULSE_LOW, { duration: PULSE_HALF_MS });
      pulse.value = withRepeat(dim, FOREVER, true);
      return;
    }
    const spin = withTiming(FULL_TURN, {
      duration: TURN_MS,
      easing: Easing.linear,
    });
    turn.value = withRepeat(spin, FOREVER, false);
  }, [reducedMotion, turn, pulse]);

  const motion = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ rotate: `${turn.value}deg` }],
  }));

  const { ring, pennant } = sizes[size];
  const circle = cn("absolute rounded-full border-[1.5px]", ring);
  return (
    <View aria-hidden className={cn("items-center justify-center", ring)}>
      <View className={cn(circle, "border-rope")} />
      <Animated.View
        style={motion}
        className={cn(circle, "border-transparent border-t-ink")}
      />
      {pennant ? <Pennant size={pennant} /> : null}
    </View>
  );
}

import { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const TURN_MS = 900;
const FULL_TURN_DEGREES = 360;
const FOREVER = -1;

type ThinkingRingProps = { active: boolean };

export function ThinkingRing({ active }: ThinkingRingProps) {
  const reducedMotion = useReducedMotion();
  const turn = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(turn);
    turn.value = 0;
    if (!active || reducedMotion) return;
    const once = withTiming(1, { duration: TURN_MS, easing: Easing.linear });
    turn.value = withRepeat(once, FOREVER);
  }, [active, reducedMotion, turn]);

  const spin = useAnimatedStyle(() => ({
    transform: [{ rotate: `${turn.value * FULL_TURN_DEGREES}deg` }],
  }));

  if (!active) return null;
  return (
    <Animated.View
      style={spin}
      className="absolute inset-0 m-auto size-talk-ring rounded-full border-4 border-primary border-t-transparent"
    />
  );
}

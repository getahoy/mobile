import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const LEVEL_EASE_MS = 120;
const INNER_SPREAD = 0.35;
const OUTER_SPREAD = 0.7;

type VoiceRingsProps = { level: number; active: boolean };

const ring = "absolute inset-0 m-auto size-talk-button rounded-full";
const glow = "absolute inset-0 m-auto size-talk-ring rounded-full";

export function VoiceRings({ level, active }: VoiceRingsProps) {
  const reducedMotion = useReducedMotion();
  const shown = useSharedValue(0);

  useEffect(() => {
    shown.value = withTiming(active ? level : 0, { duration: LEVEL_EASE_MS });
  }, [active, level, shown]);

  const inner = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + shown.value * INNER_SPREAD }],
  }));
  const outer = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + shown.value * OUTER_SPREAD }],
  }));

  if (!active) return null;
  if (reducedMotion) {
    return <Animated.View className={`${glow} bg-destructive/20`} />;
  }
  return (
    <>
      <Animated.View style={outer} className={`${ring} bg-destructive/15`} />
      <Animated.View style={inner} className={`${ring} bg-destructive/25`} />
    </>
  );
}

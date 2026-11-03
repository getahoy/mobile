import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { easing, REDUCED_FADE_MS, useReducedMotion } from "@/lib/motion";
import { holdLeftMs, LAUNCH_LIFT, LAUNCH_REVEAL_MS } from "../launchTiming";
import { Wordmark } from "./wordmark";

type LaunchIntroProps = { onDone: () => void };

// The Stack is already mounted underneath, so anything settled during the hold
// (a server answer, a revoked Mac) is in place before the reveal.
export function LaunchIntro({ onDone }: LaunchIntroProps) {
  const reducedMotion = useReducedMotion();
  const gone = useSharedValue(0);

  useEffect(() => {
    const holdMs = holdLeftMs(Date.now());
    const duration = reducedMotion ? REDUCED_FADE_MS : LAUNCH_REVEAL_MS;
    const reveal = withTiming(1, { duration, easing: easing.inOut });
    gone.value = withDelay(holdMs, reveal);
    const timer = setTimeout(onDone, holdMs + duration);
    return () => clearTimeout(timer);
  }, [gone, onDone, reducedMotion]);

  const fade = useAnimatedStyle(() => ({ opacity: 1 - gone.value }));
  const lift = useAnimatedStyle(() => ({
    transform: [{ translateY: reducedMotion ? 0 : -LAUNCH_LIFT * gone.value }],
  }));

  return (
    <Animated.View
      style={fade}
      pointerEvents="none"
      aria-hidden
      className="absolute inset-0 bg-sailcloth"
    >
      <Wordmark style={lift} />
    </Animated.View>
  );
}

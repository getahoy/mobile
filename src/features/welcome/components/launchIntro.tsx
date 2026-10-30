import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { easing, REDUCED_FADE_MS, useReducedMotion } from "@/lib/motion";
import { Wordmark } from "./wordmark";

const INTRO_MS = 900;
const LIFT_BY = 24;

type LaunchIntroProps = { onDone: () => void };

export function LaunchIntro({ onDone }: LaunchIntroProps) {
  const reducedMotion = useReducedMotion();
  const gone = useSharedValue(0);

  useEffect(() => {
    const duration = reducedMotion ? REDUCED_FADE_MS : INTRO_MS;
    gone.value = withTiming(1, { duration, easing: easing.out });
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [gone, onDone, reducedMotion]);

  const fade = useAnimatedStyle(() => ({ opacity: 1 - gone.value }));
  const lift = useAnimatedStyle(() => ({
    transform: [{ translateY: reducedMotion ? 0 : -LIFT_BY * gone.value }],
  }));

  return (
    <Animated.View
      style={fade}
      pointerEvents="none"
      aria-hidden
      className="absolute inset-0 bg-sailcloth"
    >
      <View className="absolute inset-x-0 top-1/2 -mt-8 h-16 items-center justify-center">
        <Animated.View style={lift}>
          <Wordmark />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

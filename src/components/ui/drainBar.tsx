import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const PERCENT = 100;

type DrainBarProps = { durationMs: number; running: boolean };

export function DrainBar({ durationMs, running }: DrainBarProps) {
  const left = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(left);
    if (!running) {
      left.value = 0;
      return;
    }
    left.value = 1;
    left.value = withTiming(0, { duration: durationMs, easing: Easing.linear });
  }, [durationMs, running, left]);

  const width = useAnimatedStyle(() => ({ width: `${left.value * PERCENT}%` }));

  return (
    <View aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-rope">
      <Animated.View style={width} className="h-full bg-signal" />
    </View>
  );
}

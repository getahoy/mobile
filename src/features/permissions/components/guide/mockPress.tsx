import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { duration } from "@/lib/motion";

type MockPressProps = { pressed: boolean };

export function MockPress({ pressed }: MockPressProps) {
  const highlight = useAnimatedStyle(() => ({
    opacity: withTiming(pressed ? 1 : 0, { duration: duration.fast }),
  }));
  return (
    <Animated.View
      style={highlight}
      className="absolute inset-0 bg-signal-mist"
    />
  );
}

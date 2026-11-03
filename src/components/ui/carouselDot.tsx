import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { duration, easing } from "@/lib/motion";

const ACTIVE_WIDTH = 16;
const RESTING_WIDTH = 4;

type CarouselDotProps = { active: boolean };

export function CarouselDot({ active }: CarouselDotProps) {
  const timing = { duration: duration.base, easing: easing.out };
  const stretch = useAnimatedStyle(() => ({
    width: withTiming(active ? ACTIVE_WIDTH : RESTING_WIDTH, timing),
  }));
  const fill = useAnimatedStyle(() => ({
    opacity: withTiming(active ? 1 : 0, timing),
  }));
  return (
    <Animated.View
      style={stretch}
      className="h-1 overflow-hidden rounded-full bg-rope"
    >
      <Animated.View
        style={fill}
        className="absolute inset-0 rounded-full bg-driftwood"
      />
    </Animated.View>
  );
}

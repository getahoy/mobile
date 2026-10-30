import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const TALLEST_STRETCH = 3.2;

type VoiceDotProps = { level: SharedValue<number>; weight: number };

export function VoiceDot({ level, weight }: VoiceDotProps) {
  const stretch = useAnimatedStyle(() => ({
    transform: [{ scaleY: 1 + level.value * weight * TALLEST_STRETCH }],
  }));
  return (
    <Animated.View
      style={stretch}
      className="size-1.5 rounded-full bg-on-ink"
    />
  );
}

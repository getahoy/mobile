import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { timelinePhase } from "@/lib/motion";
import { welcomeTimeline } from "../welcomeTimeline";
import { Wordmark } from "./wordmark";

const { delayMs, durationMs, riseBy } = welcomeTimeline.wordmarkOut;

type WelcomeWordmarkProps = { time: SharedValue<number> };

export function WelcomeWordmark({ time }: WelcomeWordmarkProps) {
  const leave = useAnimatedStyle(() => {
    const gone = timelinePhase(time.value, delayMs, durationMs);
    return {
      opacity: 1 - gone,
      transform: [{ translateY: -riseBy * gone }],
    };
  });
  return (
    <Animated.View
      style={leave}
      aria-hidden
      pointerEvents="none"
      className="absolute inset-x-0 top-1/2 -mt-8 h-16 items-center justify-center"
    >
      <Wordmark />
    </Animated.View>
  );
}

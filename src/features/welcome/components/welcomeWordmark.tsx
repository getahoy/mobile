import { type SharedValue, useAnimatedStyle } from "react-native-reanimated";
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
  return <Wordmark style={leave} />;
}

import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { timelinePhase } from "@/lib/motion";
import { welcomeTimeline } from "../welcomeTimeline";

const { delayMs, staggerMs, durationMs, riseFrom } = welcomeTimeline.words;

type TimedWordProps = {
  time: SharedValue<number>;
  order: number;
  word: string;
  italic: boolean;
};

export function TimedWord({ time, order, word, italic }: TimedWordProps) {
  const start = delayMs + order * staggerMs;
  const appear = useAnimatedStyle(() => {
    const shown = timelinePhase(time.value, start, durationMs);
    return {
      opacity: shown,
      transform: [{ translateY: riseFrom * (1 - shown) }],
    };
  });
  return (
    <Animated.View style={appear}>
      <Text
        variant="display"
        className={cn(
          "text-welcome",
          italic ? "font-fraunces-light-italic" : "font-fraunces-light",
        )}
      >
        {word}
      </Text>
    </Animated.View>
  );
}

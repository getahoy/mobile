import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { duration, easing } from "@/lib/motion";
import type { WordPhase } from "../tryLoop";

const RISE_FROM = 8;
const LEAVE_TO = -6;
const NO_FONT_SCALING = 1;

const targets: Record<WordPhase, { opacity: number; rise: number }> = {
  hidden: { opacity: 0, rise: RISE_FROM },
  shown: { opacity: 1, rise: 0 },
  leaving: { opacity: 0, rise: LEAVE_TO },
};

type TryWordProps = { word: string; phase: WordPhase };

export function TryWord({ word, phase }: TryWordProps) {
  const opacity = useSharedValue(targets[phase].opacity);
  const rise = useSharedValue(targets[phase].rise);

  useEffect(() => {
    const timing = { duration: duration.slow, easing: easing.out };
    opacity.value = withTiming(targets[phase].opacity, timing);
    rise.value = withTiming(targets[phase].rise, timing);
  }, [phase, opacity, rise]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: rise.value }],
  }));

  return (
    <Animated.Text
      style={style}
      maxFontSizeMultiplier={NO_FONT_SCALING}
      className="font-fraunces-light-italic text-example text-ink"
    >
      {word}
    </Animated.Text>
  );
}

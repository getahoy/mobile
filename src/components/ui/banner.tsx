import Animated, { Keyframe } from "react-native-reanimated";
import {
  duration,
  easing,
  REDUCED_FADE_MS,
  useReducedMotion,
} from "@/lib/motion";
import { StatusDot } from "./statusDot";
import { Text } from "./text";

const DROP_DISTANCE = 8;

const dropIn = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: -DROP_DISTANCE }] },
  100: { opacity: 1, transform: [{ translateY: 0 }], easing: easing.out },
}).duration(duration.base);

const dropOut = new Keyframe({
  0: { opacity: 1, transform: [{ translateY: 0 }] },
  100: {
    opacity: 0,
    transform: [{ translateY: -DROP_DISTANCE }],
    easing: easing.out,
  },
}).duration(duration.base);

const fadeIn = new Keyframe({
  0: { opacity: 0 },
  100: { opacity: 1 },
}).duration(REDUCED_FADE_MS);

const fadeOut = new Keyframe({
  0: { opacity: 1 },
  100: { opacity: 0 },
}).duration(REDUCED_FADE_MS);

type BannerProps = { message: string | null };

export function Banner({ message }: BannerProps) {
  const reducedMotion = useReducedMotion();
  if (!message) return null;
  return (
    <Animated.View
      key={message}
      entering={reducedMotion ? fadeIn : dropIn}
      exiting={reducedMotion ? fadeOut : dropOut}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className="h-7 flex-row items-center gap-1.5 self-center rounded-full bg-ink px-3"
    >
      <StatusDot tone="fog" />
      <Text variant="footnote" className="font-sans-medium text-on-ink">
        {message}
      </Text>
    </Animated.View>
  );
}

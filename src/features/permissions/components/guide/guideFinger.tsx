import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { duration, easing } from "@/lib/motion";
import type { FingerPoint, SettingsLook } from "../../guideTimeline";

const FINGER_RADIUS = 15;
const FINGER_MOVE_MS = 560;
const PRESSED_SCALE = 0.8;

type GuideFingerProps = { point: FingerPoint; look: SettingsLook };

export function GuideFinger({ point, look }: GuideFingerProps) {
  const style = useAnimatedStyle(() => {
    const move = { duration: FINGER_MOVE_MS, easing: easing.out };
    const across = withTiming(point.x - FINGER_RADIUS, move);
    const scale = point.pressed ? PRESSED_SCALE : 1;
    return {
      ...(look === "ios" ? { right: across } : { left: across }),
      top: withTiming(point.y - FINGER_RADIUS, move),
      opacity: withTiming(point.visible ? 1 : 0, { duration: duration.base }),
      transform: [{ scale: withTiming(scale, { duration: duration.fast }) }],
    };
  });
  return (
    <Animated.View
      aria-hidden
      style={style}
      className="absolute size-finger rounded-full border-2 border-signal bg-signal/18"
    />
  );
}

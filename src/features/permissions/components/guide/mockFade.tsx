import type { ReactNode } from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { duration } from "@/lib/motion";

type MockFadeProps = {
  shown: boolean;
  speed: "fast" | "base";
  className: string;
  children?: ReactNode;
};

export function MockFade({ shown, speed, className, children }: MockFadeProps) {
  const fade = useAnimatedStyle(() => ({
    opacity: withTiming(shown ? 1 : 0, { duration: duration[speed] }),
  }));
  return (
    <Animated.View style={fade} className={className}>
      {children}
    </Animated.View>
  );
}

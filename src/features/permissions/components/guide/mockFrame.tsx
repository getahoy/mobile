import type { ReactNode } from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { duration } from "@/lib/motion";

type MockFrameProps = { shown: boolean; children: ReactNode };

export function MockFrame({ shown, children }: MockFrameProps) {
  const fade = useAnimatedStyle(() => ({
    opacity: withTiming(shown ? 1 : 0, { duration: duration.base }),
  }));
  return (
    <Animated.View style={fade} className="absolute inset-0">
      {children}
    </Animated.View>
  );
}

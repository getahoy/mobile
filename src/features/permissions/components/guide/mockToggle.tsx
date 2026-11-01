import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { duration, easing } from "@/lib/motion";

const KNOB_TRAVEL = 16;

type MockToggleProps = { on: boolean };

export function MockToggle({ on }: MockToggleProps) {
  const fill = useAnimatedStyle(() => ({
    opacity: withTiming(on ? 1 : 0, { duration: duration.base }),
  }));
  const knob = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(on ? KNOB_TRAVEL : 0, {
          duration: duration.base,
          easing: easing.out,
        }),
      },
    ],
  }));
  return (
    <View className="h-6 w-10 rounded-full bg-rope p-0.5">
      <Animated.View
        style={fill}
        className="absolute inset-0 rounded-full bg-kelp"
      />
      <Animated.View
        style={knob}
        className="size-5 rounded-full bg-white shadow-knob"
      />
    </View>
  );
}

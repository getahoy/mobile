import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/cn";
import { duration } from "@/lib/motion";

type MockRadioProps = { selected: boolean };

export function MockRadio({ selected }: MockRadioProps) {
  const dot = useAnimatedStyle(() => ({
    opacity: withTiming(selected ? 1 : 0, { duration: duration.fast }),
  }));
  return (
    <View
      className={cn(
        "size-4.5 rounded-full border-2",
        selected ? "border-signal" : "border-fog",
      )}
    >
      <Animated.View
        style={dot}
        className="absolute inset-0.5 rounded-full bg-signal"
      />
    </View>
  );
}

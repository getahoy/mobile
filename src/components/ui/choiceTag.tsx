import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/cn";
import { duration, easing, useReducedMotion } from "@/lib/motion";
import { Text } from "./text";

const SELECTED_SCALE = 1.1;

type ChoiceTagProps = { number: number; selected?: boolean };

export function ChoiceTag({ number, selected = false }: ChoiceTagProps) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  useEffect(() => {
    const target = selected && !reducedMotion ? SELECTED_SCALE : 1;
    scale.value = withTiming(target, {
      duration: duration.base,
      easing: easing.spring,
    });
  }, [selected, reducedMotion, scale]);

  const grow = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={grow} aria-hidden>
      <View
        className={cn(
          "min-h-7 min-w-7 -skew-x-10 items-center justify-center rounded-tag px-2",
          selected ? "bg-signal" : "bg-ink",
        )}
      >
        <Text
          className={cn(
            "skew-x-10 font-mono text-numeral tabular-nums",
            selected ? "text-on-signal" : "text-on-ink",
          )}
        >
          {number}
        </Text>
      </View>
    </Animated.View>
  );
}

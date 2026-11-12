import type { Appearance } from "@getahoy/lib";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { duration, easing, useReducedMotion } from "@/lib/motion";
import { appearanceCopy } from "../copy/appearanceCopy";
import { AppearancePreview } from "./appearancePreview";
import { AppearanceRadio } from "./appearanceRadio";

type AppearanceTileProps = {
  appearance: Appearance;
  selected: boolean;
  onChoose: (appearance: Appearance) => void;
};

export function AppearanceTile({
  appearance,
  selected,
  onChoose,
}: AppearanceTileProps) {
  const reducedMotion = useReducedMotion();
  const ring = useSharedValue(selected ? 1 : 0);
  useEffect(() => {
    const target = selected ? 1 : 0;
    ring.value = reducedMotion
      ? target
      : withTiming(target, { duration: duration.fast, easing: easing.out });
  }, [ring, selected, reducedMotion]);
  const ringStyle = useAnimatedStyle(() => ({ opacity: ring.value }));
  const label = appearanceCopy.options[appearance];
  return (
    <Pressable
      role="radio"
      accessibilityLabel={`${appearanceCopy.title}, ${label}`}
      accessibilityState={{ selected }}
      onPress={() => onChoose(appearance)}
      className="w-25 items-center gap-2.5"
    >
      <View>
        <Animated.View
          style={ringStyle}
          className="absolute -inset-1 rounded-tile-ring border-2 border-ink"
        />
        <AppearancePreview appearance={appearance} />
      </View>
      <View className="items-center gap-1.5">
        <Text variant="bodySmall" className="font-sans-medium">
          {label}
        </Text>
        <AppearanceRadio selected={selected} />
      </View>
    </Pressable>
  );
}

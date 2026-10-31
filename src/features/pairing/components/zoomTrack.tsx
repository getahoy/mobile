import {
  type AccessibilityActionEvent,
  type LayoutChangeEvent,
  View,
} from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { pairingCopy } from "../copy/pairingCopy";
import { type ZoomDirection, zoomPercent } from "../zoomScale";

const PERCENT = 100;
const accessibilityActions = [{ name: "increment" }, { name: "decrement" }];

type ZoomTrackProps = {
  level: number;
  liveLevel: SharedValue<number>;
  onAdjust: (direction: ZoomDirection) => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

export function ZoomTrack({
  level,
  liveLevel,
  onAdjust,
  onLayout,
}: ZoomTrackProps) {
  const fill = useAnimatedStyle(() => ({
    height: `${liveLevel.value * PERCENT}%`,
  }));
  const dot = useAnimatedStyle(() => ({
    bottom: `${liveLevel.value * PERCENT}%`,
  }));
  const adjust = (event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === "increment") onAdjust("in");
    if (event.nativeEvent.actionName === "decrement") onAdjust("out");
  };
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={pairingCopy["scanner.zoom"]}
      accessibilityValue={{ min: 0, max: PERCENT, now: zoomPercent(level) }}
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={adjust}
      onLayout={onLayout}
      className="my-1 h-24 w-2 items-center"
    >
      <View className="absolute inset-y-0 w-0.5 rounded-full bg-on-scrim/30" />
      <Animated.View
        style={fill}
        className="absolute bottom-0 w-0.5 rounded-full bg-on-scrim"
      />
      <Animated.View
        style={dot}
        className="absolute left-0 -mb-1 size-2 rounded-full bg-on-scrim"
      />
    </View>
  );
}

import { useEffect } from "react";
import { useManualGesture } from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { duration, easing, useReducedMotion } from "@/lib/motion";

const HELD_SCALE = 1.02;

type TalkBarHoldOptions = {
  enabled: boolean;
  held: boolean;
  onStart: () => void;
  onStop: () => void;
  onInterrupted: () => void;
};

export function useTalkBarHold(options: TalkBarHoldOptions) {
  const { enabled, held, onStart, onStop, onInterrupted } = options;
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const hold = useManualGesture({
    enabled,
    runOnJS: true,
    onTouchesDown: () => onStart(),
    onTouchesUp: () => onStop(),
    onTouchesCancel: () => onInterrupted(),
  });

  useEffect(() => {
    const target = held && !reducedMotion ? HELD_SCALE : 1;
    scale.value = withTiming(target, {
      duration: duration.base,
      easing: easing.spring,
    });
  }, [held, reducedMotion, scale]);

  const grow = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return { hold, grow };
}

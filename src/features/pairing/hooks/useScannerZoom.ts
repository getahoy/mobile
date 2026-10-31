import { useState } from "react";
import { Platform } from "react-native";
import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { haptics } from "@/lib/haptics";
import { duration, easing, useReducedMotion } from "@/lib/motion";
import {
  type CameraZoomCurve,
  clampZoomLevel,
  MIN_ZOOM_LEVEL,
  nextZoomLevel,
  toCameraZoom,
  type ZoomDirection,
  zoomLimitReached,
} from "../zoomScale";
import { useZoomGestures } from "./useZoomGestures";

// expo-camera maps its zoom prop exponentially on iOS and linearly on Android.
const ZOOM_CURVE: CameraZoomCurve =
  Platform.OS === "android" ? "linear" : "exponential";

export type ZoomMotion = "ease" | "jump";

export type ScannerZoomState = ReturnType<typeof useScannerZoom>;

export function useScannerZoom() {
  const reducedMotion = useReducedMotion();
  const [level, setLevel] = useState(MIN_ZOOM_LEVEL);
  const liveLevel = useSharedValue(MIN_ZOOM_LEVEL);
  const targetLevel = useSharedValue(MIN_ZOOM_LEVEL);
  const gestures = useZoomGestures({
    liveLevel,
    targetLevel,
    curve: ZOOM_CURVE,
  });

  useAnimatedReaction(
    () => liveLevel.value,
    (current, previous) => {
      if (current !== previous) scheduleOnRN(setLevel, clampZoomLevel(current));
    },
  );

  const step = (direction: ZoomDirection, motion: ZoomMotion): boolean => {
    const current = targetLevel.value;
    if (zoomLimitReached(current, direction)) return false;
    const target = nextZoomLevel(current, direction);
    targetLevel.value = target;
    liveLevel.value =
      reducedMotion || motion === "jump"
        ? target
        : withTiming(target, { duration: duration.base, easing: easing.out });
    if (zoomLimitReached(target, direction)) {
      haptics.zoomLimit();
      return false;
    }
    haptics.zoomStep();
    return true;
  };

  const reset = () => {
    targetLevel.value = MIN_ZOOM_LEVEL;
    liveLevel.value = MIN_ZOOM_LEVEL;
  };

  return {
    cameraZoom: toCameraZoom(level, ZOOM_CURVE),
    level,
    liveLevel,
    ...gestures,
    step,
    reset,
  };
}

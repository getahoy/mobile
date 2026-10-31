import { useEffect } from "react";
import { Platform } from "react-native";
import { withTiming } from "react-native-reanimated";
import { haptics } from "@/lib/haptics";
import { duration, easing, useReducedMotion } from "@/lib/motion";
import {
  type CameraZoomCurve,
  MIN_ZOOM_LEVEL,
  nextZoomLevel,
  toCameraZoom,
  type ZoomDirection,
  zoomLimitReached,
} from "../zoomScale";
import type { ClaimState } from "./useClaimMac";
import { useZoomDrag } from "./useZoomDrag";
import { useZoomPinch } from "./useZoomPinch";

// expo-camera maps its zoom prop exponentially on iOS and linearly on Android.
const ZOOM_CURVE: CameraZoomCurve =
  Platform.OS === "android" ? "linear" : "exponential";

export type ScannerZoomState = ReturnType<typeof useScannerZoom>;

export function useScannerZoom(claimKind: ClaimState["kind"]) {
  const reducedMotion = useReducedMotion();
  const { level, liveLevel, targetLevel, pinch } = useZoomPinch(ZOOM_CURVE);
  const { drag, onTrackLayout } = useZoomDrag(liveLevel, targetLevel);

  useEffect(() => {
    if (claimKind !== "scanning") return;
    targetLevel.value = MIN_ZOOM_LEVEL;
    liveLevel.value = MIN_ZOOM_LEVEL;
  }, [claimKind, liveLevel, targetLevel]);

  const step = (direction: ZoomDirection): boolean => {
    const current = targetLevel.value;
    if (zoomLimitReached(current, direction)) return false;
    const target = nextZoomLevel(current, direction);
    targetLevel.value = target;
    liveLevel.value = reducedMotion
      ? target
      : withTiming(target, { duration: duration.base, easing: easing.out });
    if (zoomLimitReached(target, direction)) {
      haptics.zoomLimit();
      return false;
    }
    haptics.zoomStep();
    return true;
  };

  return {
    cameraZoom: toCameraZoom(level, ZOOM_CURVE),
    level,
    liveLevel,
    pinch,
    drag,
    onTrackLayout,
    step,
  };
}

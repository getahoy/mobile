import { useState } from "react";
import { usePinchGesture } from "react-native-gesture-handler";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import {
  type CameraZoomCurve,
  clampZoomLevel,
  MIN_ZOOM_LEVEL,
  pinchZoomLevel,
} from "../zoomScale";

export function useZoomPinch(curve: CameraZoomCurve) {
  const [level, setLevel] = useState(MIN_ZOOM_LEVEL);
  const liveLevel = useSharedValue(MIN_ZOOM_LEVEL);
  const targetLevel = useSharedValue(MIN_ZOOM_LEVEL);
  const pinchStartLevel = useSharedValue(MIN_ZOOM_LEVEL);

  useAnimatedReaction(
    () => liveLevel.value,
    (current, previous) => {
      if (current !== previous) scheduleOnRN(setLevel, clampZoomLevel(current));
    },
  );

  const pinch = usePinchGesture({
    onActivate: () => {
      pinchStartLevel.value = liveLevel.value;
    },
    onUpdate: (event) => {
      const next = pinchZoomLevel(pinchStartLevel.value, event.scale, curve);
      liveLevel.value = next;
      targetLevel.value = next;
    },
  });

  return { level, liveLevel, targetLevel, pinch };
}

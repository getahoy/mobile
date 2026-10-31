import type { LayoutChangeEvent } from "react-native";
import { usePanGesture, usePinchGesture } from "react-native-gesture-handler";
import { type SharedValue, useSharedValue } from "react-native-reanimated";
import {
  type CameraZoomCurve,
  dragZoomLevel,
  MIN_ZOOM_LEVEL,
  pinchZoomLevel,
} from "../zoomScale";

const DRAG_SLOP = 10;

type ZoomGesturesOptions = {
  liveLevel: SharedValue<number>;
  targetLevel: SharedValue<number>;
  curve: CameraZoomCurve;
};

export function useZoomGestures(options: ZoomGesturesOptions) {
  const { liveLevel, targetLevel, curve } = options;
  const pinchStartLevel = useSharedValue(MIN_ZOOM_LEVEL);
  const dragStartLevel = useSharedValue(MIN_ZOOM_LEVEL);
  const trackHeight = useSharedValue(0);

  const follow = (next: number) => {
    "worklet";
    liveLevel.value = next;
    targetLevel.value = next;
  };

  const pinch = usePinchGesture({
    onActivate: () => {
      pinchStartLevel.value = liveLevel.value;
    },
    onUpdate: (event) => {
      follow(pinchZoomLevel(pinchStartLevel.value, event.scale, curve));
    },
  });

  const drag = usePanGesture({
    activeOffsetY: [-DRAG_SLOP, DRAG_SLOP],
    failOffsetX: [-DRAG_SLOP, DRAG_SLOP],
    onActivate: () => {
      dragStartLevel.value = liveLevel.value;
    },
    onUpdate: (event) => {
      follow(
        dragZoomLevel(
          dragStartLevel.value,
          event.translationY,
          trackHeight.value,
        ),
      );
    },
  });

  const onTrackLayout = (event: LayoutChangeEvent) => {
    trackHeight.value = event.nativeEvent.layout.height;
  };

  return { pinch, drag, onTrackLayout };
}

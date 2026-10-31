import type { LayoutChangeEvent } from "react-native";
import { usePanGesture } from "react-native-gesture-handler";
import { type SharedValue, useSharedValue } from "react-native-reanimated";
import { dragZoomLevel, MIN_ZOOM_LEVEL } from "../zoomScale";

export function useZoomDrag(
  liveLevel: SharedValue<number>,
  targetLevel: SharedValue<number>,
) {
  const trackHeight = useSharedValue(0);
  const dragStartLevel = useSharedValue(MIN_ZOOM_LEVEL);

  const drag = usePanGesture({
    onActivate: () => {
      dragStartLevel.value = liveLevel.value;
    },
    onUpdate: (event) => {
      const next = dragZoomLevel(
        dragStartLevel.value,
        event.translationY,
        trackHeight.value,
      );
      liveLevel.value = next;
      targetLevel.value = next;
    },
  });

  const onTrackLayout = (event: LayoutChangeEvent) => {
    trackHeight.value = event.nativeEvent.layout.height;
  };

  return { drag, onTrackLayout };
}

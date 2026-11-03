import { usePanGesture } from "react-native-gesture-handler";
import { cancelAnimation, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import type { CarouselState } from "./carouselContext";
import { pageAt, releasePage } from "./carouselMotion";

// A swipe must win clearly over a vertical drag, so the screen and the talk button keep theirs.
const SWIPE_START_PX = 10;

export function useCarouselDrag(carousel: CarouselState, spacing: number) {
  const { offset, pageWidth, dragging, glideTo } = carousel;
  const { touchStarted, touchEnded } = carousel;
  const startOffset = useSharedValue(0);
  const released = useSharedValue(false);

  return usePanGesture({
    activeOffsetX: [-SWIPE_START_PX, SWIPE_START_PX],
    failOffsetY: [-SWIPE_START_PX, SWIPE_START_PX],
    onBegin: () => {
      cancelAnimation(offset);
      startOffset.value = offset.value;
      released.value = false;
      scheduleOnRN(touchStarted);
    },
    onActivate: () => {
      dragging.value = true;
    },
    onUpdate: (event) => {
      const perPixel = pageWidth.value / spacing;
      offset.value = startOffset.value + event.translationX * perPixel;
    },
    onDeactivate: (event) => {
      released.value = true;
      glideTo(
        releasePage({
          startPage: pageAt(startOffset.value, pageWidth.value),
          currentPage: pageAt(offset.value, pageWidth.value),
          translation: event.translationX,
          velocity: event.velocityX,
        }),
      );
    },
    onFinalize: () => {
      if (!released.value) {
        glideTo(Math.round(pageAt(offset.value, pageWidth.value)));
      }
      dragging.value = false;
      scheduleOnRN(touchEnded);
    },
  });
}

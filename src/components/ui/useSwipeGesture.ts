import { useCallback } from "react";
import type { CarouselPanGesture } from "react-native-reanimated-carousel";
import { scheduleOnRN } from "react-native-worklets";

// A swipe must win clearly over a vertical drag, so the screen and the talk button keep theirs.
const SWIPE_START_PX = 10;

type SwipeCallbacks = { onTouchStart: () => void; onTouchEnd: () => void };

export function useSwipeGesture({ onTouchStart, onTouchEnd }: SwipeCallbacks) {
  return useCallback(
    (gesture: CarouselPanGesture) => {
      gesture
        .activeOffsetX([-SWIPE_START_PX, SWIPE_START_PX])
        .failOffsetY([-SWIPE_START_PX, SWIPE_START_PX])
        .onBegin(() => {
          "worklet";
          scheduleOnRN(onTouchStart);
        })
        .onFinalize(() => {
          "worklet";
          scheduleOnRN(onTouchEnd);
        });
    },
    [onTouchStart, onTouchEnd],
  );
}

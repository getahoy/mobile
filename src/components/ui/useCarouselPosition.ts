import { useCallback, useState } from "react";
import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import {
  type CarouselMotion,
  clampPage,
  glideTiming,
  nearestIndex,
} from "./carouselMotion";

type PositionOptions = {
  loop: boolean;
  count: number;
  motion: CarouselMotion;
  onIndexChange: ((index: number) => void) | undefined;
};

export function useCarouselPosition(options: PositionOptions) {
  const { loop, count, motion, onIndexChange } = options;
  const offset = useSharedValue(0);
  const pageWidth = useSharedValue(0);
  const dragging = useSharedValue(false);
  const [index, setIndex] = useState(0);

  const settle = (next: number) => {
    setIndex(next);
    onIndexChange?.(next);
  };
  useAnimatedReaction(
    () => nearestIndex(-offset.value / Math.max(pageWidth.value, 1), count),
    (now, before) => {
      if (before !== null && now !== before) scheduleOnRN(settle, now);
    },
  );

  const step = useCallback(
    (delta: 1 | -1) => {
      const width = pageWidth.value;
      const page = Math.round(-offset.value / Math.max(width, 1)) + delta;
      const target = loop ? page : clampPage(page, count);
      offset.value = withTiming(-target * width, glideTiming(motion));
    },
    [loop, count, motion, offset, pageWidth],
  );

  return { offset, pageWidth, dragging, index, step };
}

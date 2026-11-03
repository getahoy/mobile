import { useCallback, useState } from "react";
import {
  useAnimatedReaction,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { duration, easing } from "@/lib/motion";
import {
  type CarouselMotion,
  clampPage,
  glideTiming,
  nearestIndex,
  pageAt,
} from "./carouselMotion";

const PEEK_OUT = { duration: duration.base, easing: easing.out };
const PEEK_BACK = { duration: duration.slow, easing: easing.spring };

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
    () => nearestIndex(pageAt(offset.value, pageWidth.value), count),
    (now, before) => {
      if (before !== null && now !== before) scheduleOnRN(settle, now);
    },
  );

  const glideTo = useCallback(
    (page: number) => {
      "worklet";
      const target = loop ? page : clampPage(page, count);
      offset.value = withTiming(-target * pageWidth.value, glideTiming(motion));
    },
    [loop, count, motion, offset, pageWidth],
  );

  const step = useCallback(
    (delta: 1 | -1) =>
      glideTo(Math.round(pageAt(offset.value, pageWidth.value)) + delta),
    [glideTo, offset, pageWidth],
  );

  const peek = useCallback(
    (pages: number) => {
      const width = pageWidth.value;
      const rest = -Math.round(pageAt(offset.value, width)) * width;
      offset.value = withSequence(
        withTiming(rest - pages * width, PEEK_OUT),
        withTiming(rest, PEEK_BACK),
      );
    },
    [offset, pageWidth],
  );

  return { offset, pageWidth, dragging, index, glideTo, step, peek };
}

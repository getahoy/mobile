import { useCallback } from "react";
import type { CarouselState } from "./carouselContext";
import { slideStyle, travelFromRest } from "./carouselMotion";

export function useSlideStyle(carousel: CarouselState, spacing: number) {
  const { offset, pageWidth, dragging, motion } = carousel;
  return useCallback(
    (distance: number) => {
      "worklet";
      const page = -offset.value / Math.max(pageWidth.value, 1);
      return slideStyle({
        distance,
        travel: travelFromRest(page),
        spacing,
        motion,
        dragging: dragging.value,
      });
    },
    [spacing, motion, dragging, offset, pageWidth],
  );
}

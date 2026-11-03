import { useCallback } from "react";
import type { CarouselState } from "./carouselContext";
import { pageAt, slideStyle } from "./carouselMotion";

export function useSlideStyle(carousel: CarouselState, spacing: number) {
  const { offset, pageWidth, dragging, motion } = carousel;
  return useCallback(
    (distance: number) => {
      "worklet";
      return slideStyle({
        distance,
        page: pageAt(offset.value, pageWidth.value),
        spacing,
        motion,
        dragging: dragging.value,
      });
    },
    [spacing, motion, dragging, offset, pageWidth],
  );
}

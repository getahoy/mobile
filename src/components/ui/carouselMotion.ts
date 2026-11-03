import { Easing, type WithTimingConfig } from "react-native-reanimated";
import { duration, easing, REDUCED_FADE_MS } from "@/lib/motion";

export type CarouselMotion = "full" | "reduced";

const NEIGHBOUR_SHRINK = 0.3;
const NEIGHBOUR_PEAK_OPACITY = 0.32;
const REVEAL_GAIN = 2;
const VANISH_SPAN = 0.6;
const SWIPE_PX = 40;
const FLICK_PX_PER_S = 400;

type SlideLook = {
  distance: number;
  travel: number;
  spacing: number;
  motion: CarouselMotion;
  dragging: boolean;
};

export function travelFromRest(page: number) {
  "worklet";
  return Math.abs(page - Math.round(page));
}

// Neighbours stay invisible at rest and only appear while the strip is moving.
export function slideStyle(look: SlideLook) {
  "worklet";
  const { distance, travel, spacing, motion, dragging } = look;
  const near = Math.min(1, Math.abs(distance));
  const beyond = Math.max(0, Math.abs(distance) - 1);
  const settledOnly = motion === "reduced" && !dragging;
  const placed = settledOnly ? Math.round(distance) : distance;
  const reveal = Math.min(travel * REVEAL_GAIN, 1);
  const neighbourOpacity = NEIGHBOUR_PEAK_OPACITY * reveal;
  return {
    opacity: Math.max(
      0,
      (1 - near * (1 - neighbourOpacity)) * (1 - beyond / VANISH_SPAN),
    ),
    transform: [
      { translateX: placed * spacing },
      { scale: motion === "full" ? 1 - NEIGHBOUR_SHRINK * near : 1 },
    ],
  };
}

type Release = {
  startPage: number;
  currentPage: number;
  translation: number;
  velocity: number;
};

export function releasePage({
  startPage,
  currentPage,
  translation,
  velocity,
}: Release) {
  "worklet";
  const moved =
    Math.abs(translation) > SWIPE_PX || Math.abs(velocity) > FLICK_PX_PER_S;
  if (!moved) return Math.round(currentPage);
  return Math.round(startPage + (translation < 0 ? 1 : -1));
}

export function clampPage(page: number, count: number) {
  "worklet";
  return Math.min(Math.max(page, 0), Math.max(count - 1, 0));
}

export function nearestIndex(page: number, count: number) {
  "worklet";
  if (count <= 0) return 0;
  return ((Math.round(page) % count) + count) % count;
}

export function glideTiming(motion: CarouselMotion): WithTimingConfig {
  "worklet";
  if (motion === "reduced") {
    return { duration: REDUCED_FADE_MS, easing: Easing.linear };
  }
  return { duration: duration.slow, easing: easing.out };
}

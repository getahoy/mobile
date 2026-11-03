import { createContext, useContext } from "react";
import type { SharedValue } from "react-native-reanimated";
import type { CarouselMotion } from "./carouselMotion";

export type CarouselState = {
  index: number;
  count: number;
  label: string;
  loop: boolean;
  motion: CarouselMotion;
  offset: SharedValue<number>;
  pageWidth: SharedValue<number>;
  dragging: SharedValue<boolean>;
  setCount: (count: number) => void;
  touchStarted: () => void;
  touchEnded: () => void;
  step: (delta: 1 | -1) => void;
  peek: (pages: number) => void;
};

export const CarouselContext = createContext<CarouselState | null>(null);

export function useCarousel(): CarouselState {
  const carousel = useContext(CarouselContext);
  if (!carousel) throw new Error("Carousel parts must sit inside <Carousel>");
  return carousel;
}

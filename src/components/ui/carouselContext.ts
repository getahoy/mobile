import { createContext, type RefObject, useContext } from "react";
import type { CarouselRef } from "react-native-reanimated-carousel";

export type CarouselCause = "user" | "auto";

export type CarouselApi = {
  index: number;
  count: number;
  cause: CarouselCause;
  autoAdvance: boolean;
  jumpTo: (index: number) => void;
};

export type CarouselInternals = CarouselApi & {
  ref: RefObject<CarouselRef | null>;
  loop: boolean;
  autoPlayInterval: number | null;
  label: string;
  setCount: (count: number) => void;
  touchStarted: () => void;
  touchEnded: () => void;
  movingStarted: () => void;
  settled: (index: number) => void;
  stepByUser: (step: 1 | -1) => void;
};

export const CarouselContext = createContext<CarouselInternals | null>(null);

export function useCarouselInternals(): CarouselInternals {
  const carousel = useContext(CarouselContext);
  if (!carousel) throw new Error("Carousel parts must sit inside <Carousel>");
  return carousel;
}

export function useCarousel(): CarouselApi {
  return useCarouselInternals();
}

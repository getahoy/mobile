import { type ReactNode, useCallback, useRef, useState } from "react";
import { View } from "react-native";
import type { CarouselRef } from "react-native-reanimated-carousel";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/motion";
import { useAppActive } from "@/lib/useAppActive";
import { type CarouselCause, CarouselContext } from "./carouselContext";
import { useCarouselTouch } from "./useCarouselTouch";

type CarouselPosition = { index: number; cause: CarouselCause };

const START: CarouselPosition = { index: 0, cause: "auto" };

type CarouselProps = {
  accessibilityLabel: string;
  loop?: boolean;
  autoPlayInterval?: number;
  paused?: boolean;
  onIndexChange?: (index: number, cause: CarouselCause) => void;
  className?: string;
  children: ReactNode;
};

export function Carousel({
  accessibilityLabel,
  loop = false,
  autoPlayInterval,
  paused = false,
  onIndexChange,
  className,
  children,
}: CarouselProps) {
  const ref = useRef<CarouselRef>(null);
  const [position, setPosition] = useState<CarouselPosition>(START);
  const [count, setCount] = useState(0);
  const touch = useCarouselTouch();
  const appActive = useAppActive();
  const reduced = useReducedMotion();

  const jumpTo = useCallback((index: number) => {
    if (ref.current?.getCurrentIndex() === index) return;
    ref.current?.scrollTo({ index, animated: false });
  }, []);
  const stepByUser = (step: 1 | -1) => {
    touch.movedByAction();
    if (step === 1) ref.current?.next();
    if (step === -1) ref.current?.prev();
  };
  const settled = (index: number) => {
    const cause: CarouselCause = touch.takeMovedByUser() ? "user" : "auto";
    setPosition({ index, cause });
    onIndexChange?.(index, cause);
  };

  const internals = {
    ...position,
    ...touch,
    count,
    autoAdvance: !paused && appActive && touch.untouched && !reduced,
    jumpTo,
    ref,
    loop,
    autoPlayInterval: autoPlayInterval ?? null,
    label: accessibilityLabel,
    setCount,
    settled,
    stepByUser,
  };
  return (
    <CarouselContext value={internals}>
      <View className={cn("w-full", className)}>{children}</View>
    </CarouselContext>
  );
}

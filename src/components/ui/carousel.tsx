import { type ReactNode, useEffect, useState } from "react";
import { View } from "react-native";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/motion";
import { useAppActive } from "@/lib/useAppActive";
import { CarouselContext } from "./carouselContext";
import type { CarouselMotion } from "./carouselMotion";
import { useCarouselPosition } from "./useCarouselPosition";
import { useCarouselTouch } from "./useCarouselTouch";

type CarouselProps = {
  accessibilityLabel: string;
  loop?: boolean;
  autoPlayInterval?: number;
  paused?: boolean;
  onIndexChange?: (index: number) => void;
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
  const [count, setCount] = useState(0);
  const motion: CarouselMotion = useReducedMotion() ? "reduced" : "full";
  const position = useCarouselPosition({ loop, count, motion, onIndexChange });
  const touch = useCarouselTouch();
  const appActive = useAppActive();
  const { step } = position;

  const autoAdvance =
    !paused && appActive && touch.untouched && motion === "full";
  useEffect(() => {
    if (!autoAdvance || autoPlayInterval === undefined) return;
    const timer = setInterval(() => step(1), autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoAdvance, autoPlayInterval, step]);

  const state = {
    ...position,
    count,
    label: accessibilityLabel,
    loop,
    motion,
    setCount,
    touchStarted: touch.touchStarted,
    touchEnded: touch.touchEnded,
  };
  return (
    <CarouselContext value={state}>
      <View className={cn("w-full", className)}>{children}</View>
    </CarouselContext>
  );
}

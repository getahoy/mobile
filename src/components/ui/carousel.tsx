import { type ReactNode, useEffect, useState } from "react";
import { View } from "react-native";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/motion";
import { useAppActive } from "@/lib/useAppActive";
import { useScreenReader } from "@/lib/useScreenReader";
import { CarouselContext } from "./carouselContext";
import type { CarouselMotion } from "./carouselMotion";
import { useCarouselPosition } from "./useCarouselPosition";
import { useCarouselTouch } from "./useCarouselTouch";

const RESUME_AFTER_TOUCH_MS = 1500;

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
  const screenReader = useScreenReader();
  const { step } = position;
  const { touching, released, resumed } = touch;

  const autoAdvance =
    !paused && appActive && !screenReader && !touching && motion === "full";
  useEffect(() => {
    if (!autoAdvance || autoPlayInterval === undefined) return;
    if (released) {
      const timer = setTimeout(() => {
        step(1);
        resumed();
      }, RESUME_AFTER_TOUCH_MS);
      return () => clearTimeout(timer);
    }
    const timer = setInterval(() => step(1), autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoAdvance, autoPlayInterval, step, released, resumed]);

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

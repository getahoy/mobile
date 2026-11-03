import { type ReactElement, useEffect } from "react";
import { type AccessibilityActionEvent, View } from "react-native";
import { Carousel as ReanimatedCarousel } from "react-native-reanimated-carousel";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/lib/cn";
import { useCarouselInternals } from "./carouselContext";
import type { CarouselItemProps } from "./carouselItem";
import { useSwipeGesture } from "./useSwipeGesture";

const ADJUST_ACTIONS = [{ name: "increment" }, { name: "decrement" }];

type CarouselContentProps = {
  className?: string;
  children: ReactElement<CarouselItemProps>[];
};

export function CarouselContent({ className, children }: CarouselContentProps) {
  const carousel = useCarouselInternals();
  const { setCount, autoPlayInterval } = carousel;
  const trackStyle = useResolveClassNames(cn("w-full", className));
  const configure = useSwipeGesture({
    onTouchStart: carousel.touchStarted,
    onTouchEnd: carousel.touchEnded,
  });

  useEffect(() => setCount(children.length), [children.length, setCount]);

  const adjust = (event: AccessibilityActionEvent) =>
    carousel.stepByUser(event.nativeEvent.actionName === "increment" ? 1 : -1);
  const current = children[carousel.index]?.props.label;
  const interval =
    autoPlayInterval === null ? {} : { autoplayInterval: autoPlayInterval };

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={carousel.label}
      accessibilityActions={ADJUST_ACTIONS}
      onAccessibilityAction={adjust}
      {...(current ? { accessibilityValue: { text: current } } : {})}
    >
      <ReanimatedCarousel
        ref={carousel.ref}
        style={trackStyle}
        data={children}
        renderItem={({ item }) => item}
        keyExtractor={(item, index) => String(item.key ?? index)}
        loop={carousel.loop}
        autoplay={autoPlayInterval !== null && carousel.autoAdvance}
        {...interval}
        onConfigurePanGesture={configure}
        onScrollStart={carousel.movingStarted}
        onSnapToItem={carousel.settled}
      />
    </View>
  );
}

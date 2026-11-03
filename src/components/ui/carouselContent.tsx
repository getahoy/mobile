import { type ReactElement, useCallback, useEffect } from "react";
import {
  type AccessibilityActionEvent,
  type LayoutChangeEvent,
  View,
} from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { Carousel as ReanimatedCarousel } from "react-native-reanimated-carousel";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/lib/cn";
import { useCarousel } from "./carouselContext";
import { CarouselEdges } from "./carouselEdges";
import type { CarouselItemProps } from "./carouselItem";
import { slideStyle } from "./carouselMotion";
import { useCarouselDrag } from "./useCarouselDrag";

const ADJUST_ACTIONS = [{ name: "increment" }, { name: "decrement" }];

type CarouselContentProps = {
  spacing: number;
  className?: string;
  children: ReactElement<CarouselItemProps>[];
};

export function CarouselContent({
  spacing,
  className,
  children,
}: CarouselContentProps) {
  const carousel = useCarousel();
  const { setCount, pageWidth, dragging, motion } = carousel;
  const trackStyle = useResolveClassNames(cn("w-full", className));
  const drag = useCarouselDrag(carousel, spacing);

  useEffect(() => setCount(children.length), [children.length, setCount]);

  const animateSlide = useCallback(
    (distance: number) => {
      "worklet";
      return slideStyle({
        distance,
        spacing,
        motion,
        dragging: dragging.value,
      });
    },
    [spacing, motion, dragging],
  );
  const measure = (event: LayoutChangeEvent) => {
    pageWidth.value = event.nativeEvent.layout.width;
  };
  const adjust = (event: AccessibilityActionEvent) =>
    carousel.step(event.nativeEvent.actionName === "increment" ? 1 : -1);
  const current = children[carousel.index]?.props.label;

  return (
    <GestureDetector gesture={drag}>
      <View
        onLayout={measure}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={carousel.label}
        accessibilityActions={ADJUST_ACTIONS}
        onAccessibilityAction={adjust}
        {...(current ? { accessibilityValue: { text: current } } : {})}
        className="w-full overflow-hidden"
      >
        <ReanimatedCarousel
          style={trackStyle}
          data={children}
          renderItem={({ item }) => item}
          keyExtractor={(item, index) => String(item.key ?? index)}
          loop={carousel.loop}
          scrollEnabled={false}
          scrollOffsetValue={carousel.offset}
          itemAnimation={animateSlide}
        />
        <CarouselEdges />
      </View>
    </GestureDetector>
  );
}

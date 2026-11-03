import { View } from "react-native";
import { cn } from "@/lib/cn";
import { useCarousel } from "./carouselContext";
import { CarouselDot } from "./carouselDot";

type CarouselDotsProps = { className?: string };

export function CarouselDots({ className }: CarouselDotsProps) {
  const { index, count } = useCarousel();
  const positions = Array.from({ length: count }, (_, position) => position);
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn("flex-row gap-1.5 self-center", className)}
    >
      {positions.map((position) => (
        <CarouselDot key={position} active={position === index} />
      ))}
    </View>
  );
}

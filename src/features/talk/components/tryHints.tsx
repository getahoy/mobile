import Animated, { FadeIn } from "react-native-reanimated";
import { Carousel } from "@/components/ui/carousel";
import { CarouselDots } from "@/components/ui/carouselDots";
import { Text } from "@/components/ui/text";
import { duration } from "@/lib/motion";
import { talkCopy } from "../copy/talkCopy";
import { TrySlides } from "./trySlides";

const AUTO_ADVANCE_MS = 3400;

type TryHintsProps = { paused: boolean };

export function TryHints({ paused }: TryHintsProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(duration.base)}
      className="-mx-6 items-center gap-4.5 pb-6"
    >
      <Text
        variant="eyebrow"
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        {talkCopy.trySaying}
      </Text>
      <Carousel
        loop
        autoPlayInterval={AUTO_ADVANCE_MS}
        paused={paused}
        accessibilityLabel={talkCopy.trySayingLabel}
        className="gap-4.5"
      >
        <TrySlides />
        <CarouselDots className="mt-1.5" />
      </Carousel>
    </Animated.View>
  );
}

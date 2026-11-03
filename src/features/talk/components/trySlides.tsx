import { useEffect } from "react";
import { CarouselContent } from "@/components/ui/carouselContent";
import { useCarousel } from "@/components/ui/carouselContext";
import { CarouselItem } from "@/components/ui/carouselItem";
import { talkCopy } from "../copy/talkCopy";
import { useTryLoop } from "../hooks/useTryLoop";
import { TrySlide } from "./trySlide";

const quoted = talkCopy.examples.map(talkCopy.heard);

export function TrySlides() {
  const { index, cause, autoAdvance, jumpTo } = useCarousel();
  const { frame, showWhole } = useTryLoop({
    examples: quoted,
    running: autoAdvance,
    onAdvance: jumpTo,
  });

  useEffect(() => {
    if (cause === "user") showWhole(index);
  }, [index, cause, showWhole]);

  const live = frame.index === index ? frame : null;
  return (
    <CarouselContent className="h-35">
      {talkCopy.examples.map((example, slide) => (
        <CarouselItem key={example} label={example}>
          <TrySlide
            example={quoted[slide] ?? example}
            frame={slide === index ? live : null}
          />
        </CarouselItem>
      ))}
    </CarouselContent>
  );
}

import { CarouselContent } from "@/components/ui/carouselContent";
import { CarouselItem } from "@/components/ui/carouselItem";
import { talkCopy } from "../copy/talkCopy";
import { useTryNudge } from "../hooks/useTryNudge";
import { TrySlide } from "./trySlide";

const SLIDE_SPACING = 236;

export function TrySlides() {
  useTryNudge(SLIDE_SPACING);
  return (
    <CarouselContent spacing={SLIDE_SPACING} className="h-signing-orb">
      {talkCopy.tryExamples.map((example) => (
        <CarouselItem key={example} label={example}>
          <TrySlide example={talkCopy.heard(example)} />
        </CarouselItem>
      ))}
    </CarouselContent>
  );
}

import { CarouselContent } from "@/components/ui/carouselContent";
import { CarouselItem } from "@/components/ui/carouselItem";
import { talkCopy } from "../copy/talkCopy";
import { TrySlide } from "./trySlide";

const SLIDE_SPACING = 236;

export function TrySlides() {
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

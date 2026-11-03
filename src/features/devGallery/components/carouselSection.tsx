import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { CarouselContent } from "@/components/ui/carouselContent";
import { CarouselDots } from "@/components/ui/carouselDots";
import { CarouselItem } from "@/components/ui/carouselItem";
import { Text } from "@/components/ui/text";
import { galleryCopy } from "../copy/galleryCopy";
import { GallerySection } from "./gallerySection";

const AUTO_PLAY_MS = 2500;
const SLIDE_SPACING = 200;

export function CarouselSection() {
  const [index, setIndex] = useState(0);
  const slides = galleryCopy.carouselSlides;
  return (
    <GallerySection title={galleryCopy.carousel}>
      <Carousel
        loop
        autoPlayInterval={AUTO_PLAY_MS}
        onIndexChange={setIndex}
        accessibilityLabel={galleryCopy.carousel}
        className="gap-3"
      >
        <CarouselContent spacing={SLIDE_SPACING} className="h-28">
          {slides.map((slide) => (
            <CarouselItem key={slide} label={slide} className="items-center">
              <Card className="w-48 flex-1 items-center justify-center">
                <Text variant="title">{slide}</Text>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>
      <Text variant="footnote" className="text-driftwood">
        {galleryCopy.carouselStatus(index + 1, slides.length)}
      </Text>
    </GallerySection>
  );
}

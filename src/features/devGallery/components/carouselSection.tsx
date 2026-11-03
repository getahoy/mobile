import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { CarouselContent } from "@/components/ui/carouselContent";
import type { CarouselCause } from "@/components/ui/carouselContext";
import { CarouselDots } from "@/components/ui/carouselDots";
import { CarouselItem } from "@/components/ui/carouselItem";
import { Text } from "@/components/ui/text";
import { galleryCopy } from "../copy/galleryCopy";
import { GallerySection } from "./gallerySection";

const AUTO_PLAY_MS = 2500;

export function CarouselSection() {
  const [moved, setMoved] = useState({ index: 0, cause: "auto" });
  const slides = galleryCopy.carouselSlides;
  const keep = (index: number, cause: CarouselCause) =>
    setMoved({ index, cause });
  return (
    <GallerySection title={galleryCopy.carousel}>
      <Carousel
        loop
        autoPlayInterval={AUTO_PLAY_MS}
        onIndexChange={keep}
        accessibilityLabel={galleryCopy.carousel}
        className="gap-3"
      >
        <CarouselContent className="h-28">
          {slides.map((slide) => (
            <CarouselItem key={slide} label={slide} className="px-1">
              <Card className="flex-1 items-center justify-center">
                <Text variant="title">{slide}</Text>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>
      <Text variant="footnote" className="text-driftwood">
        {galleryCopy.carouselStatus(
          moved.index + 1,
          slides.length,
          moved.cause,
        )}
      </Text>
    </GallerySection>
  );
}

import { Text } from "@/components/ui/text";
import { galleryCopy } from "../copy/galleryCopy";
import { GallerySection } from "./gallerySection";

export function TypographySection() {
  return (
    <GallerySection title={galleryCopy.typography}>
      <Text variant="display">
        {galleryCopy.display}{" "}
        <Text variant="display" className="font-fraunces-light-italic">
          {galleryCopy.displayItalic}
        </Text>
      </Text>
      <Text variant="heading">{galleryCopy.heading}</Text>
      <Text variant="title">{galleryCopy.title}</Text>
      <Text variant="heard">{galleryCopy.heard}</Text>
      <Text>{galleryCopy.body}</Text>
      <Text variant="bodySmall" className="text-driftwood">
        {galleryCopy.bodySmall}
      </Text>
      <Text variant="footnote" className="text-driftwood">
        {galleryCopy.footnote}
      </Text>
      <Text variant="caption">{galleryCopy.caption}</Text>
      <Text variant="eyebrow" className="text-kelp">
        {galleryCopy.eyebrow}
      </Text>
    </GallerySection>
  );
}

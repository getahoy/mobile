import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { galleryCopy } from "../copy/galleryCopy";
import { GallerySection } from "./gallerySection";
import type { GallerySheet } from "./gallerySheets";

type SheetsSectionProps = { onOpen: (sheet: GallerySheet) => void };

export function SheetsSection({ onOpen }: SheetsSectionProps) {
  return (
    <GallerySection title={galleryCopy.sheets}>
      <Button variant="secondary" onPress={() => onOpen("choice")}>
        <Text>{galleryCopy.openChoiceSheet}</Text>
      </Button>
      <Button variant="secondary" onPress={() => onOpen("danger")}>
        <Text>{galleryCopy.openDangerSheet}</Text>
      </Button>
    </GallerySection>
  );
}

import { CHOICE_TTL_MS } from "@getahoy/protocol";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { ChoiceTag } from "@/components/ui/choiceTag";
import { Sheet } from "@/components/ui/sheet";
import { Text } from "@/components/ui/text";
import { galleryCopy } from "../copy/galleryCopy";
import { TwoMacsSheet } from "./twoMacsSheet";

export type GallerySheet = "choice" | "danger" | "twoMacs";

const SAMPLE_CHOICES = [galleryCopy.primary, galleryCopy.secondary] as const;

type GallerySheetsProps = {
  open: GallerySheet | null;
  onClose: () => void;
};

export function GallerySheets({ open, onClose }: GallerySheetsProps) {
  return (
    <>
      <TwoMacsSheet open={open === "twoMacs"} onClose={onClose} />
      <Sheet
        open={open === "choice"}
        onClose={onClose}
        title={galleryCopy.sheetTitle}
        description={galleryCopy.sheetDescription}
        drain={{ durationMs: CHOICE_TTL_MS, running: open === "choice" }}
      >
        {SAMPLE_CHOICES.map((label, index) => (
          <View key={label} className="h-16 flex-row items-center gap-4">
            <ChoiceTag number={index + 1} />
            <Text className="flex-1 font-sans-medium">{label}</Text>
          </View>
        ))}
        <Button variant="ghost" onPress={onClose}>
          <Text>{galleryCopy.ghost}</Text>
        </Button>
      </Sheet>
      <Sheet
        open={open === "danger"}
        onClose={onClose}
        tone="danger"
        title={galleryCopy.dangerTitle}
        description={galleryCopy.dangerDescription}
      >
        <Button variant="destructive" onPress={onClose}>
          <Text>{galleryCopy.destructive}</Text>
        </Button>
        <Button variant="ghost" onPress={onClose}>
          <Text>{galleryCopy.cancel}</Text>
        </Button>
      </Sheet>
    </>
  );
}

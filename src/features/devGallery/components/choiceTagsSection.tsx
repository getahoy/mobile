import { useState } from "react";
import { Pressable, View } from "react-native";
import { ChoiceTag } from "@/components/ui/choiceTag";
import { Text } from "@/components/ui/text";
import { haptics } from "@/lib/haptics";
import { galleryCopy } from "../copy/galleryCopy";
import { GallerySection } from "./gallerySection";

const NUMBERS = [1, 2, 3, 9] as const;

export function ChoiceTagsSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const pick = (number: number) => {
    haptics.choicePicked();
    setSelected((current) => (current === number ? null : number));
  };
  return (
    <GallerySection title={galleryCopy.choices}>
      <View className="flex-row gap-4">
        {NUMBERS.map((number) => (
          <Pressable
            key={number}
            role="button"
            accessibilityLabel={String(number)}
            accessibilityState={{ selected: selected === number }}
            onPress={() => pick(number)}
            className="size-11 items-center justify-center"
          >
            <ChoiceTag number={number} selected={selected === number} />
          </Pressable>
        ))}
      </View>
      <Text variant="footnote" className="text-driftwood">
        {galleryCopy.tapToSelect}
      </Text>
    </GallerySection>
  );
}

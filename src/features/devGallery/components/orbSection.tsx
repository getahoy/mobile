import { View } from "react-native";
import { Orb } from "@/components/ui/orb";
import { Text } from "@/components/ui/text";
import { galleryCopy } from "../copy/galleryCopy";
import { useWobblingLevel } from "../hooks/useWobblingLevel";
import { GallerySection } from "./gallerySection";

export function OrbSection() {
  const level = useWobblingLevel();
  const samples = [
    { label: galleryCopy.orbStill, orb: <Orb /> },
    { label: galleryCopy.orbBreathe, orb: <Orb motion="breathe" /> },
    { label: galleryCopy.orbLevel, orb: <Orb motion="level" level={level} /> },
    { label: galleryCopy.orbSpeak, orb: <Orb tone="speak" motion="breathe" /> },
  ];
  return (
    <GallerySection title={galleryCopy.orb}>
      {samples.map((sample) => (
        <View key={sample.label} className="items-center gap-2">
          {sample.orb}
          <Text variant="caption">{sample.label}</Text>
        </View>
      ))}
    </GallerySection>
  );
}

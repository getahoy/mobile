import { View } from "react-native";
import { Card } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { galleryCopy } from "../copy/galleryCopy";
import { GallerySection } from "./gallerySection";

const ICON_NAMES: readonly IconName[] = [
  "mic",
  "settings",
  "more",
  "check",
  "checkCircle",
  "close",
  "torchOn",
  "torchOff",
  "eye",
  "eyeSlash",
  "chevronRight",
  "chevronLeft",
  "chevronDown",
  "mac",
];

export function IconsSection() {
  return (
    <GallerySection title={galleryCopy.icons}>
      <View className="flex-row flex-wrap gap-4">
        {ICON_NAMES.map((name) => (
          <View key={name} className="w-16 items-center gap-1">
            <Icon name={name} size="lg" />
            <Text variant="caption" numberOfLines={1}>
              {name}
            </Text>
          </View>
        ))}
      </View>
      <Card className="gap-1">
        <Text className="font-sans-medium">{galleryCopy.card}</Text>
        <Text variant="bodySmall" className="text-driftwood">
          {galleryCopy.cardBody}
        </Text>
      </Card>
    </GallerySection>
  );
}

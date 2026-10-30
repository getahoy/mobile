import type { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

type GallerySectionProps = { title: string; children: ReactNode };

export function GallerySection({ title, children }: GallerySectionProps) {
  return (
    <View className="gap-4 border-rope border-t pt-6">
      <Text variant="eyebrow" role="heading">
        {title}
      </Text>
      {children}
    </View>
  );
}

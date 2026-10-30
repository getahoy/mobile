import { useState } from "react";
import { View } from "react-native";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { StatusPill, type StatusTone } from "@/components/ui/statusPill";
import { Text } from "@/components/ui/text";
import { galleryCopy } from "../copy/galleryCopy";
import { GallerySection } from "./gallerySection";

const pills: readonly (readonly [StatusTone, string])[] = [
  ["connected", galleryCopy.connected],
  ["connecting", galleryCopy.connecting],
  ["held", galleryCopy.locked],
  ["held", galleryCopy.paused],
  ["unavailable", galleryCopy.unreachable],
  ["unavailable", galleryCopy.offline],
];

const banners = [
  null,
  galleryCopy.bannerOffline,
  galleryCopy.bannerNoInternet,
] as const;

export function StatusSection() {
  const [bannerIndex, setBannerIndex] = useState(0);
  const nextBanner = () =>
    setBannerIndex((index) => (index + 1) % banners.length);
  return (
    <GallerySection title={galleryCopy.status}>
      <View className="flex-row flex-wrap gap-2">
        {pills.map(([tone, label]) => (
          <StatusPill key={label} tone={tone} label={label} />
        ))}
      </View>
      <View className="h-7">
        <Banner message={banners[bannerIndex] ?? null} />
      </View>
      <Button variant="secondary" size="sm" onPress={nextBanner}>
        <Text>{galleryCopy.showBanner}</Text>
      </Button>
    </GallerySection>
  );
}

import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { ListGroup } from "@/components/ui/listGroup";
import { ListRow } from "@/components/ui/listRow";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { haptics } from "@/lib/haptics";
import { BuildStamp } from "../components/buildStamp";
import { ButtonsSection } from "../components/buttonsSection";
import { ChoiceTagsSection } from "../components/choiceTagsSection";
import { type GallerySheet, GallerySheets } from "../components/gallerySheets";
import { IconsSection } from "../components/iconsSection";
import { InputsSection } from "../components/inputsSection";
import { ListSection } from "../components/listSection";
import { OrbSection } from "../components/orbSection";
import { SheetsSection } from "../components/sheetsSection";
import { StatusSection } from "../components/statusSection";
import { TypographySection } from "../components/typographySection";
import { galleryCopy } from "../copy/galleryCopy";
import { useGalleryTheme } from "../hooks/useGalleryTheme";

export function GalleryScreen() {
  const { dark, setDark } = useGalleryTheme();
  const [sheet, setSheet] = useState<GallerySheet | null>(null);
  const openSheet = (next: GallerySheet) => {
    if (next === "danger") haptics.confirmOpen();
    setSheet(next);
  };
  return (
    <View className="flex-1 bg-sailcloth">
      <ScrollView
        contentContainerClassName="gap-6 px-5 pt-safe-offset-4 pb-safe-offset-10"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between">
          <Text variant="title">{galleryCopy.screenTitle}</Text>
          <Pressable
            role="button"
            accessibilityLabel={galleryCopy.close}
            onPress={() => router.back()}
            className="size-11 items-center justify-center rounded-full"
          >
            <Icon name="close" size="lg" />
          </Pressable>
        </View>
        <BuildStamp />
        <ListGroup>
          <ListRow
            label={galleryCopy.darkMode}
            accessory={
              <Switch
                checked={dark}
                onCheckedChange={setDark}
                accessibilityLabel={galleryCopy.darkMode}
              />
            }
          />
        </ListGroup>
        <TypographySection />
        <ButtonsSection />
        <InputsSection />
        <StatusSection />
        <ChoiceTagsSection />
        <ListSection />
        <SheetsSection onOpen={openSheet} />
        <OrbSection />
        <IconsSection />
      </ScrollView>
      <GallerySheets open={sheet} onClose={() => setSheet(null)} />
    </View>
  );
}

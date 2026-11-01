import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { permissionCopy } from "../copy/permissionCopy";
import { settingsMockCopy } from "../copy/settingsMockCopy";
import { androidFrame, iosFrame, type SettingsLook } from "../guideTimeline";
import { useGuideFrame } from "../hooks/useGuideFrame";
import type { PermissionKind } from "../permissionKind";
import { GuideIllustration } from "./guide/guideIllustration";
import { GuideSteps } from "./guide/guideSteps";
import { PermissionLayout } from "./permissionLayout";

type SettingsGuideScreenProps = {
  kind: PermissionKind;
  look: SettingsLook;
  onOpenSettings: () => void;
  onClose: () => void;
};

export function SettingsGuideScreen({
  kind,
  look,
  onOpenSettings,
  onClose,
}: SettingsGuideScreenProps) {
  const copy = permissionCopy.kind(kind);
  const frame = useGuideFrame(look);
  const onIos = look === "ios";
  const steps = onIos
    ? settingsMockCopy.iosSteps(kind)
    : settingsMockCopy.androidSteps(kind);
  const active = onIos
    ? iosFrame(kind, frame).activeStep
    : androidFrame(frame).activeStep;
  return (
    <PermissionLayout onClose={onClose}>
      <ScrollView contentContainerClassName="gap-5 px-5 pt-1">
        <View className="gap-2.5 px-1">
          <Text variant="headline">{copy.guideTitle}</Text>
          <Text className="text-driftwood">{copy.guideBody}</Text>
        </View>
        <GuideIllustration kind={kind} look={look} frame={frame} />
        <GuideSteps steps={steps} active={active} />
      </ScrollView>
      <View className="gap-1.5 px-5 pt-3 pb-safe">
        <Button
          className="active:scale-97 active:opacity-100"
          onPress={onOpenSettings}
        >
          <Text>{permissionCopy.openSettings}</Text>
        </Button>
        <Button variant="ghost" onPress={onClose}>
          <Text>{permissionCopy.notNow}</Text>
        </Button>
      </View>
    </PermissionLayout>
  );
}

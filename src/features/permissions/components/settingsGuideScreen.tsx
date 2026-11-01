import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { permissionCopy } from "../copy/permissionCopy";
import type { GuideTarget } from "../guideTimeline";
import { useGuideFrame } from "../hooks/useGuideFrame";
import { GuideIllustration } from "./guide/guideIllustration";
import { guideScene } from "./guide/guideScene";
import { GuideSteps } from "./guide/guideSteps";
import { PermissionActions } from "./permissionActions";
import { PermissionLayout } from "./permissionLayout";

type SettingsGuideScreenProps = {
  target: GuideTarget;
  onOpenSettings: () => void;
  onClose: () => void;
};

export function SettingsGuideScreen({
  target,
  onOpenSettings,
  onClose,
}: SettingsGuideScreenProps) {
  const copy = permissionCopy.kind(target.kind);
  const scene = guideScene(target, useGuideFrame(target.look));
  return (
    <PermissionLayout onClose={onClose}>
      <ScrollView contentContainerClassName="gap-5 px-5 pt-1">
        <View className="gap-2.5 px-1">
          <Text variant="headline">{copy.guideTitle}</Text>
          <Text className="text-driftwood">{copy.guideBody}</Text>
        </View>
        <GuideIllustration scene={scene} look={target.look} />
        <GuideSteps steps={scene.steps} active={scene.activeStep} />
      </ScrollView>
      <PermissionActions
        label={permissionCopy.openSettings}
        onPress={onOpenSettings}
        onNotNow={onClose}
      />
    </PermissionLayout>
  );
}

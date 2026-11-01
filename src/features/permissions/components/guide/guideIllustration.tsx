import { View } from "react-native";
import type { SettingsLook } from "../../guideTimeline";
import { GuideFinger } from "./guideFinger";
import type { GuideScene } from "./guideScene";

type GuideIllustrationProps = { scene: GuideScene; look: SettingsLook };

export function GuideIllustration({ scene, look }: GuideIllustrationProps) {
  return (
    <View
      accessible
      role="img"
      accessibilityLabel={scene.label}
      className="h-guide overflow-hidden rounded-card bg-linen"
    >
      {scene.mock}
      <GuideFinger look={look} point={scene.finger} />
    </View>
  );
}

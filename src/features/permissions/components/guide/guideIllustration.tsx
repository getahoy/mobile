import { View } from "react-native";
import { settingsMockCopy } from "../../copy/settingsMockCopy";
import { androidFrame, iosFrame, type SettingsLook } from "../../guideTimeline";
import type { PermissionKind } from "../../permissionKind";
import { AndroidSettingsMock } from "./androidSettingsMock";
import { GuideFinger } from "./guideFinger";
import { IosSettingsMock } from "./iosSettingsMock";

type GuideIllustrationProps = {
  kind: PermissionKind;
  look: SettingsLook;
  frame: number;
};

export function GuideIllustration({
  kind,
  look,
  frame,
}: GuideIllustrationProps) {
  const ios = iosFrame(kind, frame);
  const android = androidFrame(frame);
  const label =
    look === "ios"
      ? settingsMockCopy.iosAlt(kind)
      : settingsMockCopy.androidAlt(kind);
  return (
    <View
      accessible
      role="img"
      accessibilityLabel={label}
      className="h-guide overflow-hidden rounded-card bg-linen"
    >
      {look === "ios" ? (
        <IosSettingsMock frame={ios} />
      ) : (
        <AndroidSettingsMock kind={kind} frame={android} />
      )}
      <GuideFinger
        look={look}
        point={look === "ios" ? ios.finger : android.finger}
      />
    </View>
  );
}

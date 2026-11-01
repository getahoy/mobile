import { View } from "react-native";
import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { permissionCopy } from "../../copy/permissionCopy";
import { settingsMockCopy } from "../../copy/settingsMockCopy";
import { IOS_SETTINGS_ROWS, type IosFrame } from "../../guideTimeline";
import type { PermissionKind } from "../../permissionKind";
import { IosSettingsRow } from "./iosSettingsRow";

const rowIcons: Record<PermissionKind, IconName> = {
  net: "wifi",
  camera: "camera",
  mic: "mic",
};

type IosSettingsMockProps = { frame: IosFrame };

export function IosSettingsMock({ frame }: IosSettingsMockProps) {
  return (
    <>
      <View className="absolute top-4 left-3.5 flex-row items-center gap-0.5">
        <Icon name="chevronLeft" size="sm" tintColorClassName="accent-signal" />
        <Text variant="footnote" className="text-signal">
          {settingsMockCopy.iosBack}
        </Text>
      </View>
      <Text className="absolute top-9.5 left-4 font-sans-medium text-mock-title">
        {settingsMockCopy.appName}
      </Text>
      <Text className="absolute top-19 left-7 font-sans-medium text-driftwood text-mock-label uppercase">
        {settingsMockCopy.iosSection}
      </Text>
      <View className="absolute inset-x-3 top-24 overflow-hidden rounded-mock bg-paper">
        {IOS_SETTINGS_ROWS.map((kind, index) => (
          <IosSettingsRow
            key={kind}
            label={permissionCopy.kind(kind).name}
            icon={rowIcons[kind]}
            on={index !== frame.targetRow || frame.targetOn}
            divided={index > 0}
          />
        ))}
      </View>
    </>
  );
}

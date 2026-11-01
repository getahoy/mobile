import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { settingsMockCopy as copy } from "../../copy/settingsMockCopy";
import type { DevicePermission } from "../../permissionKind";
import { AndroidInfoRow } from "./androidInfoRow";
import { AndroidMockHeader } from "./androidMockHeader";

type AndroidAppInfoFrameProps = { kind: DevicePermission; pressed: boolean };

export function AndroidAppInfoFrame({
  kind,
  pressed,
}: AndroidAppInfoFrameProps) {
  return (
    <>
      <AndroidMockHeader title={copy.androidAppInfo} />
      <View className="absolute top-12 left-4 flex-row items-center gap-2.5">
        <View className="size-8.5 items-center justify-center rounded-thumb bg-ink">
          <Text className="font-fraunces text-body-lg text-on-ink">
            {copy.androidAppLetter}
          </Text>
        </View>
        <View className="gap-px">
          <Text className="font-sans-medium text-body-sm">{copy.appName}</Text>
          <Text className="text-driftwood text-mock-caption">
            {copy.androidVersion}
          </Text>
        </View>
      </View>
      <View className="absolute inset-x-3 top-24 overflow-hidden rounded-mock bg-paper">
        <AndroidInfoRow
          title={copy.androidNotifications}
          detail={copy.androidOn}
          pressed={false}
          divided={false}
        />
        <AndroidInfoRow
          title={copy.androidPermissions}
          detail={copy.androidAllowedSummary(kind)}
          pressed={pressed}
          divided
        />
        <AndroidInfoRow
          title={copy.androidStorage}
          detail={copy.androidStorageUsed}
          pressed={false}
          divided
        />
      </View>
    </>
  );
}

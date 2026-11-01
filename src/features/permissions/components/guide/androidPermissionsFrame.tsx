import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { settingsMockCopy as copy } from "../../copy/settingsMockCopy";
import type { PermissionKind } from "../../permissionKind";
import { AndroidMockHeader } from "./androidMockHeader";
import { MockPress } from "./mockPress";

const sectionLabel =
  "absolute left-6.5 font-sans-medium text-driftwood text-mock-label uppercase";
const card = "absolute inset-x-3 overflow-hidden rounded-mock bg-paper";

type AndroidPermissionsFrameProps = { kind: PermissionKind; pressed: boolean };

export function AndroidPermissionsFrame({
  kind,
  pressed,
}: AndroidPermissionsFrameProps) {
  return (
    <>
      <AndroidMockHeader title={copy.androidAppPermissions} />
      <Text className={cn(sectionLabel, "top-11.5")}>
        {copy.androidAllowed}
      </Text>
      <View className={cn(card, "top-15.5")}>
        <View className="h-10 justify-center px-3.5">
          <Text variant="footnote">{copy.androidNearby}</Text>
        </View>
        <View className="h-10 justify-center border-t border-rope px-3.5">
          <Text variant="footnote">{copy.androidOtherAllowed(kind)}</Text>
        </View>
      </View>
      <Text className={cn(sectionLabel, "top-38")}>
        {copy.androidNotAllowed}
      </Text>
      <View className={cn(card, "top-42")}>
        <View className="h-10.5 justify-center px-3.5">
          <MockPress pressed={pressed} />
          <Text variant="footnote" className="font-sans-medium">
            {copy.androidTarget(kind)}
          </Text>
        </View>
      </View>
    </>
  );
}

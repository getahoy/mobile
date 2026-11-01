import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { settingsMockCopy as copy } from "../../copy/settingsMockCopy";
import type { AndroidFrame } from "../../guideTimeline";
import type { DevicePermission } from "../../permissionKind";
import { AndroidMockHeader } from "./androidMockHeader";
import { MockPress } from "./mockPress";
import { MockRadio } from "./mockRadio";

const ALLOW_CHOICE = 0;
const DENY_CHOICE = 2;

type AndroidChoiceFrameProps = { kind: DevicePermission; frame: AndroidFrame };

export function AndroidChoiceFrame({ kind, frame }: AndroidChoiceFrameProps) {
  const selectedChoice = frame.picked ? ALLOW_CHOICE : DENY_CHOICE;
  return (
    <>
      <AndroidMockHeader title={copy.androidPermissionTitle(kind)} />
      <Text className="absolute top-10.5 left-10.5 text-driftwood text-mock-caption">
        {copy.appName}
      </Text>
      <View className="absolute inset-x-3 top-16 overflow-hidden rounded-mock bg-paper">
        {copy.androidChoices.map((label, index) => {
          const selected = index === selectedChoice;
          return (
            <View
              key={label}
              className={cn(
                "h-11 flex-row items-center gap-3 px-3.5",
                index > 0 && "border-t border-rope",
              )}
            >
              <MockPress
                pressed={index === ALLOW_CHOICE && frame.firstChoicePressed}
              />
              <MockRadio selected={selected} />
              <Text
                variant="footnote"
                className={cn(selected && "font-sans-medium")}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </>
  );
}

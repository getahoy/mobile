import { View } from "react-native";
import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { MockToggle } from "./mockToggle";

type IosSettingsRowProps = {
  label: string;
  icon: IconName;
  on: boolean;
  divided: boolean;
};

export function IosSettingsRow({
  label,
  icon,
  on,
  divided,
}: IosSettingsRowProps) {
  return (
    <View
      className={cn(
        "h-10 flex-row items-center gap-2.5 px-3",
        divided && "border-t border-rope",
      )}
    >
      <View className="size-6 items-center justify-center rounded-md bg-ink">
        <Icon name={icon} size="sm" tintColorClassName="accent-on-ink" />
      </View>
      <Text className="flex-1 text-body-sm">{label}</Text>
      <MockToggle on={on} />
    </View>
  );
}

import { Pressable } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { historyCopy } from "../copy/historyCopy";

type MacPickerChipProps = { label: string; onPress: () => void };

export function MacPickerChip({ label, onPress }: MacPickerChipProps) {
  return (
    <Pressable
      role="button"
      aria-haspopup="dialog"
      accessibilityLabel={`${historyCopy.chooseMac}. ${label}`}
      onPress={onPress}
      className="h-9 max-w-44 flex-row items-center gap-1.5 rounded-full bg-paper pr-2.5 pl-3.5 active:bg-linen"
    >
      <Text numberOfLines={1} className="shrink font-sans-medium text-callout">
        {label}
      </Text>
      <Icon name="chevronDown" size="xs" />
    </Pressable>
  );
}

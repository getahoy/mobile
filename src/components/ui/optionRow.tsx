import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { haptic } from "@/lib/haptics";
import { Icon } from "./icon";
import { Text } from "./text";

const ACCESSORY_ACTION = "accessory";

export type RowAccessory = {
  node: ReactNode;
  actionLabel: string;
  onAction: () => void;
};

type OptionRowProps = {
  label: string;
  help?: string;
  selected: boolean;
  accessory?: RowAccessory;
  onPress: () => void;
};

export function OptionRow({
  label,
  help,
  selected,
  accessory,
  onPress,
}: OptionRowProps) {
  return (
    <Pressable
      role="radio"
      accessibilityState={{ checked: selected }}
      accessibilityActions={
        accessory
          ? [{ name: ACCESSORY_ACTION, label: accessory.actionLabel }]
          : []
      }
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === ACCESSORY_ACTION) {
          accessory?.onAction();
        }
      }}
      onPress={() => {
        if (!selected) haptic("optionSelected");
        onPress();
      }}
      className="min-h-14 flex-row items-center gap-3 rounded-thumb px-1 py-2 active:bg-linen"
    >
      <View className="flex-1 gap-0.5">
        <Text className="font-sans-medium">{label}</Text>
        {help ? (
          <Text variant="footnote" className="text-driftwood">
            {help}
          </Text>
        ) : null}
      </View>
      {accessory?.node}
      <View aria-hidden className="size-6 items-center justify-center">
        {selected ? (
          <Icon name="check" tintColorClassName="accent-signal" />
        ) : null}
      </View>
    </Pressable>
  );
}

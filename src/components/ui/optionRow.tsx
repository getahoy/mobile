import { Pressable, View } from "react-native";
import { Icon } from "./icon";
import { Text } from "./text";

type OptionRowProps = {
  label: string;
  help?: string;
  selected: boolean;
  onPress: () => void;
};

export function OptionRow({ label, help, selected, onPress }: OptionRowProps) {
  return (
    <Pressable
      role="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
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
      {selected ? (
        <Icon name="check" tintColorClassName="accent-signal" />
      ) : null}
    </Pressable>
  );
}

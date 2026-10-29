import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

type SettingChoiceProps<Option extends string> = {
  label: string;
  options: Readonly<Record<Option, string>>;
  selected: Option;
  onSelect: (option: Option) => void;
};

function optionsOf<Option extends string>(
  options: Readonly<Record<Option, string>>,
): Option[] {
  return Object.keys(options).filter((key): key is Option => key in options);
}

export function SettingChoice<Option extends string>(
  props: SettingChoiceProps<Option>,
) {
  const { label, options, selected, onSelect } = props;
  return (
    <View className="gap-2" accessibilityRole="radiogroup">
      <Text className="font-medium">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {optionsOf(options).map((option) => (
          <Button
            key={option}
            size="sm"
            variant={option === selected ? "default" : "outline"}
            accessibilityRole="radio"
            accessibilityState={{ checked: option === selected }}
            onPress={() => onSelect(option)}
          >
            <Text>{options[option]}</Text>
          </Button>
        ))}
      </View>
    </View>
  );
}

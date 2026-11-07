import { View } from "react-native";
import { Text } from "@/components/ui/text";

type EntryWhyProps = { label: string; text: string };

export function EntryWhy({ label, text }: EntryWhyProps) {
  return (
    <View className="gap-1.5 rounded-card bg-paper px-4.5 py-4">
      <Text variant="eyebrow">{label}</Text>
      <Text variant="bodySmall">{text}</Text>
    </View>
  );
}

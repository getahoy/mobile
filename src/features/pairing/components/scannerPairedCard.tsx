import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type ScannerPairedCardProps = { text: string };

export function ScannerPairedCard({ text }: ScannerPairedCardProps) {
  return (
    <View className="items-center gap-3 rounded-card bg-paper p-6">
      <Icon name="checkCircle" size="xl" tintColorClassName="accent-kelp" />
      <Text variant="title">{text}</Text>
    </View>
  );
}

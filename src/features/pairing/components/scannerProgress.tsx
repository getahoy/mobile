import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useSpinnerVisible } from "@/lib/useSpinnerVisible";

type ScannerProgressProps = { text: string };

export function ScannerProgress({ text }: ScannerProgressProps) {
  const spinning = useSpinnerVisible(true);
  return (
    <View className="flex-row items-center gap-3 self-center rounded-full bg-night px-5 py-3">
      <ActivityIndicator
        animating={spinning}
        colorClassName="accent-on-scrim"
      />
      <Text className="text-on-scrim">{text}</Text>
    </View>
  );
}

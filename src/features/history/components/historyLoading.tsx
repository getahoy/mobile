import { ActivityIndicator, View } from "react-native";
import { useSpinnerVisible } from "@/lib/useSpinnerVisible";

export function HistoryLoading() {
  const visible = useSpinnerVisible(true);
  return (
    <View className="items-center pt-16">
      {visible ? <ActivityIndicator colorClassName="accent-driftwood" /> : null}
    </View>
  );
}

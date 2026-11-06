import { ActivityIndicator, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { historyCopy } from "../copy/historyCopy";

type HistoryListFooterProps = {
  loadingMore: boolean;
  canClear: boolean;
  onClear: () => void;
};

export function HistoryListFooter({
  loadingMore,
  canClear,
  onClear,
}: HistoryListFooterProps) {
  return (
    <View className="items-center gap-4 pt-6">
      {loadingMore ? (
        <ActivityIndicator colorClassName="accent-driftwood" />
      ) : null}
      {canClear ? (
        <Button variant="ghost" size="sm" onPress={onClear}>
          <Text className="text-driftwood">{historyCopy.clearHistory}</Text>
        </Button>
      ) : null}
    </View>
  );
}

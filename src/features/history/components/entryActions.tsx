import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { historyCopy } from "../copy/historyCopy";

type EntryActionsProps = { onCopy: () => void; onDelete: () => void };

export function EntryActions({ onCopy, onDelete }: EntryActionsProps) {
  return (
    <View className="flex-row flex-wrap gap-2 pt-1">
      <Button variant="outline" size="sm" onPress={onCopy} className="flex-1">
        <Text>{historyCopy.copy}</Text>
      </Button>
      <Button variant="outline" size="sm" onPress={onDelete} className="flex-1">
        <Text className="text-flare">{historyCopy.delete}</Text>
      </Button>
    </View>
  );
}

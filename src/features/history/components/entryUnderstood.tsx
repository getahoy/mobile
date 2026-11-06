import type { UnderstoodBy } from "@getahoy/protocol";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { historyCopy } from "../copy/historyCopy";

const understood: Record<UnderstoodBy, { title: string; note: string }> = {
  ai: { title: historyCopy.viaAi, note: historyCopy.viaAiNote },
  rules: { title: historyCopy.viaRules, note: historyCopy.viaRulesNote },
};

export function EntryUnderstood({ via }: { via: UnderstoodBy }) {
  const { title, note } = understood[via];
  return (
    <View className="gap-1.5">
      <Text variant="eyebrow">{historyCopy.understoodBy}</Text>
      <Text className="font-sans-medium">{title}</Text>
      <Text variant="bodySmall" className="text-driftwood">
        {note}
      </Text>
    </View>
  );
}

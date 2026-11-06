import type { HistoryFollowUp } from "@getahoy/protocol";
import { View } from "react-native";
import { ChoiceTag } from "@/components/ui/choiceTag";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { historyCopy } from "../copy/historyCopy";
import { seconds } from "../historyView";

export function EntryFollowUp({ followUp }: { followUp: HistoryFollowUp }) {
  const { waitedMs, said } = followUp;
  const waited = waitedMs === null ? null : seconds(waitedMs);
  return (
    <View className="gap-2.5 border-rope border-l-2 pl-4">
      <Text variant="eyebrow">{historyCopy.ahoyAsked}</Text>
      <Text className="font-fraunces text-question">{followUp.question}</Text>
      {followUp.options.map((option) => {
        const chosen = option.number === followUp.chosen;
        return (
          <View key={option.number} className="flex-row items-center gap-3">
            <ChoiceTag number={option.number} selected={chosen} />
            <Text
              variant="bodySmall"
              className={cn("flex-1", chosen ? "text-ink" : "text-driftwood")}
            >
              {option.label}
            </Text>
          </View>
        );
      })}
      {said === null ? null : (
        <View className="mt-2 gap-2.5">
          <Text variant="eyebrow">{historyCopy.youSaid(waited)}</Text>
          <Text className="font-fraunces-italic text-question">“{said}”</Text>
        </View>
      )}
    </View>
  );
}

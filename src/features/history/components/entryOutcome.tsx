import { type StatusTone, statusTone, whereLine } from "@getahoy/lib";
import type { HistoryEntry } from "@getahoy/protocol";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { historyCopy } from "../copy/historyCopy";
import { StatusMark } from "./statusMark";

const toneClasses: Record<StatusTone, string> = {
  ink: "text-ink",
  kelp: "text-kelp",
  flare: "text-flare",
  driftwood: "text-driftwood",
};

export function EntryOutcome({ entry }: { entry: HistoryEntry }) {
  const where = whereLine(entry);
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-1.5">
        <StatusMark status={entry.status} />
        <Text
          variant="eyebrow"
          className={cn(toneClasses[statusTone(entry.status)])}
        >
          {historyCopy.status[entry.status]}
        </Text>
      </View>
      {entry.did ? (
        <Text className="font-sans-medium text-outcome">{entry.did}</Text>
      ) : null}
      {where ? (
        <Text variant="bodySmall" className="text-driftwood">
          {where}
        </Text>
      ) : null}
    </View>
  );
}

import type { HistoryEntry, HistoryStatus } from "@getahoy/protocol";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { historyCopy } from "../copy/historyCopy";
import { seconds, totalMs } from "../historyView";
import { StatusMark } from "./statusMark";

const statusTones: Record<HistoryStatus, string> = {
  running: "text-ink",
  done: "text-kelp",
  choice: "text-kelp",
  failed: "text-flare",
  blocked: "text-driftwood",
  cancelled: "text-driftwood",
};

export function EntryOutcome({ entry }: { entry: HistoryEntry }) {
  const total = totalMs(entry.timings);
  const where = historyCopy.where(
    entry.app,
    total === null ? null : seconds(total),
  );
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-1.5">
        <StatusMark status={entry.status} />
        <Text variant="eyebrow" className={cn(statusTones[entry.status])}>
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

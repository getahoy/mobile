import { rowDid } from "@getahoy/lib";
import type { HistoryEntry } from "@getahoy/protocol";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { historyCopy } from "../copy/historyCopy";
import { StatusMark } from "./statusMark";

type HistoryRowProps = {
  entry: HistoryEntry;
  time: string;
  meta: string | null;
  onOpen: (id: string) => void;
};

export function HistoryRow({ entry, time, meta, onOpen }: HistoryRowProps) {
  const running = entry.status === "running";
  const did = rowDid(entry, historyCopy.working(entry.macName));
  const status = historyCopy.status[entry.status];
  const label = historyCopy.entryLabel(entry.heard, `${status}. ${did}`, time);
  return (
    <Pressable
      role="button"
      accessibilityLabel={meta ? `${label}. ${meta}` : label}
      disabled={running}
      onPress={() => onOpen(entry.id)}
      className="gap-0.75 rounded-entry px-3 py-2.5 active:bg-linen"
    >
      <View className="flex-row items-baseline gap-3">
        <Text
          numberOfLines={2}
          className="flex-1 font-fraunces-italic text-entry"
        >
          “{entry.heard}”
        </Text>
        <Text className="font-mono text-eyebrow text-driftwood">{time}</Text>
      </View>
      <View className="flex-row items-start gap-2">
        <StatusMark status={entry.status} />
        <Text className="flex-1 text-body-sm text-driftwood">{did}</Text>
      </View>
      {meta ? (
        <Text variant="eyebrow" className="pl-6.5">
          {meta}
        </Text>
      ) : null}
    </Pressable>
  );
}

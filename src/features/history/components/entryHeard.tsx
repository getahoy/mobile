import { dayLabel, timeLabel } from "@getahoy/lib";
import type { HistoryEntry } from "@getahoy/protocol";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";

const LONG_HEARD_CHARS = 60;

export function EntryHeard({ entry }: { entry: HistoryEntry }) {
  const startedAt = new Date(entry.startedAt);
  const day = dayLabel(startedAt, new Date());
  const eyebrow = [day, timeLabel(startedAt), entry.macName].join(" · ");
  const long = entry.heard.length > LONG_HEARD_CHARS;
  const size = long ? "text-entry-heard-long" : "text-entry-heard";
  return (
    <View className="gap-3">
      <Text variant="eyebrow">{eyebrow}</Text>
      <Text className={cn("font-fraunces-italic", size)}>“{entry.heard}”</Text>
    </View>
  );
}

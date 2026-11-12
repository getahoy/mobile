import { seconds, timingSegments } from "@getahoy/lib";
import type { HistoryTimings } from "@getahoy/protocol";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { historyCopy } from "../copy/historyCopy";
import { EntryTimingLegend, timingSwatches } from "./entryTimingLegend";

// Class names must be written out whole for the style compiler to find them.
const SHARES = [
  "flex-[1]",
  "flex-[2]",
  "flex-[3]",
  "flex-[4]",
  "flex-[5]",
  "flex-[6]",
  "flex-[7]",
  "flex-[8]",
  "flex-[9]",
  "flex-[10]",
  "flex-[11]",
  "flex-[12]",
] as const;

function shareOf(ms: number, total: number): string {
  const step = Math.max(1, Math.round((ms / total) * SHARES.length));
  return SHARES[step - 1] ?? "flex-[1]";
}

export function EntryTimings({ timings }: { timings: HistoryTimings }) {
  const segments = timingSegments(timings);
  const total = segments.reduce((sum, segment) => sum + segment.ms, 0);
  if (segments.length === 0 || total === 0) return null;
  const { waitedMs } = timings;
  return (
    <View className="gap-3">
      <View className="flex-row items-baseline justify-between">
        <Text variant="eyebrow">{historyCopy.timeWent}</Text>
        <Text className="font-mono text-footnote">{seconds(total)}s</Text>
      </View>
      <View aria-hidden className="h-2 flex-row gap-0.75">
        {segments.map(({ label, tone, ms }) => (
          <View
            key={label}
            className={cn(
              "rounded-full",
              timingSwatches[tone],
              shareOf(ms, total),
            )}
          />
        ))}
      </View>
      <View className="gap-1.5">
        {segments.map((segment) => (
          <EntryTimingLegend key={segment.label} segment={segment} />
        ))}
      </View>
      {waitedMs ? (
        <Text variant="footnote" className="text-driftwood">
          {historyCopy.waitedNote(seconds(waitedMs))}
        </Text>
      ) : null}
    </View>
  );
}

import { seconds, type TimingSegment } from "@getahoy/lib";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";

export const timingSwatches: Record<TimingSegment["tone"], string> = {
  ink: "bg-ink",
  driftwood: "bg-driftwood",
  fog: "bg-fog",
};

export function EntryTimingLegend({ segment }: { segment: TimingSegment }) {
  return (
    <View className="flex-row items-center gap-2.5">
      <View
        className={cn("size-2.5 rounded-xs", timingSwatches[segment.tone])}
      />
      <Text variant="bodySmall" className="flex-1">
        {segment.label}
      </Text>
      <Text className="font-mono text-footnote text-driftwood">
        {seconds(segment.ms)}s
      </Text>
    </View>
  );
}

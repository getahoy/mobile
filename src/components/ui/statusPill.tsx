import { View } from "react-native";
import { cn } from "@/lib/cn";
import { type DotTone, StatusDot } from "./statusDot";
import { Text } from "./text";

export type StatusTone = "connected" | "connecting" | "held" | "unavailable";

const looks = {
  connected: { dot: "kelp", label: "text-ink" },
  connecting: { dot: "signal", label: "text-ink" },
  held: { dot: "fog", label: "text-ink" },
  unavailable: { dot: "fog", label: "text-driftwood" },
} as const satisfies Record<StatusTone, { dot: DotTone; label: string }>;

type StatusPillProps = { tone: StatusTone; label: string; className?: string };

export function StatusPill({ tone, label, className }: StatusPillProps) {
  const look = looks[tone];
  return (
    <View
      className={cn(
        "h-7 flex-row items-center gap-1.5 self-start rounded-full border border-rope bg-paper px-3",
        className,
      )}
    >
      <StatusDot tone={look.dot} pulsing={tone === "connecting"} />
      <Text
        variant="footnote"
        numberOfLines={1}
        className={cn("font-sans-medium", look.label)}
      >
        {label}
      </Text>
    </View>
  );
}

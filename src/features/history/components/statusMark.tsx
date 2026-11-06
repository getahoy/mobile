import type { HistoryStatus } from "@getahoy/protocol";
import { View } from "react-native";
import { Icon, type IconName } from "@/components/ui/icon";
import { StatusDot } from "@/components/ui/statusDot";
import { historyCopy } from "../copy/historyCopy";

type Finished = Exclude<HistoryStatus, "running">;

const marks: Record<Finished, { icon: IconName; tint: string }> = {
  done: { icon: "check", tint: "accent-kelp" },
  choice: { icon: "askedMark", tint: "accent-kelp" },
  failed: { icon: "failedMark", tint: "accent-flare" },
  blocked: { icon: "blockedMark", tint: "accent-driftwood" },
  cancelled: { icon: "minus", tint: "accent-driftwood" },
};

export function StatusMark({ status }: { status: HistoryStatus }) {
  const label = historyCopy.status[status];
  return (
    <View
      accessible
      accessibilityLabel={label}
      className="h-5 w-4.5 items-center justify-center"
    >
      {status === "running" ? (
        <StatusDot tone="ink" pulsing />
      ) : (
        <Icon
          name={marks[status].icon}
          size="sm"
          tintColorClassName={marks[status].tint}
        />
      )}
    </View>
  );
}

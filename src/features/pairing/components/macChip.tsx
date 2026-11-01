import { Pressable } from "react-native";
import { Icon } from "@/components/ui/icon";
import { type DotTone, StatusDot } from "@/components/ui/statusDot";
import { Text } from "@/components/ui/text";
import { macCopy } from "../copy/macCopy";
import type { MacStatus, MacTone } from "../macStatus";

const dotTones = {
  connected: "kelp",
  connecting: "signal",
  quiet: "fog",
} as const satisfies Record<MacTone, DotTone>;

type MacChipProps = {
  name: string;
  status: MacStatus;
  onPress: () => void;
};

export function MacChip({ name, status, onPress }: MacChipProps) {
  return (
    <Pressable
      role="button"
      accessibilityLabel={macCopy.moreOptions(name)}
      aria-haspopup="dialog"
      onPress={onPress}
      className="h-9 shrink flex-row items-center gap-2 rounded-full border border-rope bg-paper pr-3 pl-2.5 active:bg-linen"
    >
      <StatusDot
        tone={dotTones[status.tone]}
        pulsing={status.tone === "connecting"}
      />
      <Text
        variant="bodySmall"
        numberOfLines={1}
        className="shrink font-sans-medium"
      >
        {name}
      </Text>
      {status.chip ? (
        <Text variant="footnote" numberOfLines={1} className="text-driftwood">
          {status.chip}
        </Text>
      ) : null}
      <Icon
        name="chevronDown"
        size="sm"
        tintColorClassName="accent-driftwood"
      />
    </Pressable>
  );
}

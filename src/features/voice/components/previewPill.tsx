import { ActivityIndicator, Pressable } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useSpinnerVisible } from "@/lib/useSpinnerVisible";
import { voiceCopy } from "../copy/voiceCopy";
import type { SamplePhase } from "../previewState";

const TOUCH_SLOP = { top: 6, bottom: 6, left: 4, right: 4 } as const;

type PreviewPillProps = {
  voiceLabel: string;
  phase: SamplePhase;
  onPress: () => void;
};

export function previewActionLabel(voiceLabel: string, phase: SamplePhase) {
  return phase === "playing"
    ? voiceCopy.pauseSampleLabel(voiceLabel)
    : voiceCopy.playSampleLabel(voiceLabel);
}

export function PreviewPill({ voiceLabel, phase, onPress }: PreviewPillProps) {
  const spinning = useSpinnerVisible(phase === "loading");
  const playing = phase === "playing";
  return (
    <Pressable
      role="button"
      accessibilityLabel={previewActionLabel(voiceLabel, phase)}
      hitSlop={TOUCH_SLOP}
      onPress={onPress}
      className="h-8 shrink-0 flex-row items-center gap-1.5 rounded-full border border-rope pr-3 pl-2.5 active:bg-linen"
    >
      {spinning ? (
        <ActivityIndicator
          size="small"
          colorClassName="accent-ink"
          className="size-3 scale-60"
        />
      ) : (
        <Icon name={playing ? "pause" : "play"} size="xs" />
      )}
      <Text variant="footnote" className="font-sans-medium">
        {playing ? voiceCopy.pauseSample : voiceCopy.playSample}
      </Text>
    </Pressable>
  );
}

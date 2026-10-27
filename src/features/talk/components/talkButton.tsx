import { Pressable } from "react-native";
import { Icon } from "@/features/pairing/components/icon";
import { talkCopy } from "../copy/talkCopy";

const MIC_ICON_SIZE = 40;

type TalkButtonProps = {
  macName: string;
  disabled: boolean;
  listening: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
};

export function TalkButton({
  macName,
  disabled,
  listening,
  onPressIn,
  onPressOut,
}: TalkButtonProps) {
  const tone = listening ? "bg-destructive" : "bg-primary";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={talkCopy.buttonLabel(macName)}
      accessibilityHint={talkCopy.buttonHint}
      accessibilityState={{ disabled, busy: listening }}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      className={`size-talk-button items-center justify-center self-center rounded-full ${tone} disabled:opacity-40`}
    >
      <Icon
        name={listening ? "mic" : "mic-outline"}
        size={MIC_ICON_SIZE}
        colorClassName="accent-primary-foreground"
      />
    </Pressable>
  );
}

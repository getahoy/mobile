import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Orb } from "@/components/ui/orb";
import { cn } from "@/lib/cn";
import { talkCopy } from "../copy/talkCopy";
import { useTalkBarHold } from "../hooks/useTalkBarHold";
import type { VoiceActivity } from "../voiceActivity";
import { TalkBarContent } from "./talkBarContent";

type TalkBarProps = {
  macName: string;
  label: string;
  labelStyle: "text" | "timer";
  disabled: boolean;
  activity: VoiceActivity;
  onStart: () => void;
  onStop: () => void;
  onInterrupted: () => void;
};

export function TalkBar(props: TalkBarProps) {
  const { macName, label, labelStyle, disabled, activity } = props;
  const { hold, grow } = useTalkBarHold({
    enabled: !disabled,
    held: activity.tone === "listen" && activity.dots === "level",
    onStart: props.onStart,
    onStop: props.onStop,
    onInterrupted: props.onInterrupted,
  });
  return (
    <View className="h-19 items-center justify-center">
      {activity.orb ? (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
        >
          <Orb
            tone={activity.tone}
            motion={activity.orb}
            level={activity.level}
            className="h-55 w-75"
          />
        </View>
      ) : null}
      <GestureDetector gesture={hold}>
        <Animated.View
          style={grow}
          accessible
          role="button"
          accessibilityLabel={talkCopy.buttonLabel(macName)}
          accessibilityHint={talkCopy.buttonHint}
          accessibilityState={{ disabled, busy: activity.orb !== null }}
          className={cn(
            "h-19 w-full flex-row items-center justify-center gap-3 rounded-full",
            disabled ? "bg-linen" : "bg-ink",
          )}
        >
          <TalkBarContent
            label={label}
            labelStyle={labelStyle}
            disabled={disabled}
            activity={activity}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

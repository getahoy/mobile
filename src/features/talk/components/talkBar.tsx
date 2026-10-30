import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Icon } from "@/components/ui/icon";
import { Orb, type OrbMotion } from "@/components/ui/orb";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { talkCopy } from "../copy/talkCopy";
import { useTalkBarHold } from "../hooks/useTalkBarHold";

type TalkBarProps = {
  macName: string;
  label: string;
  labelStyle: "text" | "timer";
  disabled: boolean;
  orb: OrbMotion | null;
  level: number;
  onStart: () => void;
  onStop: () => void;
  onInterrupted: () => void;
};

export function TalkBar(props: TalkBarProps) {
  const { macName, label, labelStyle, disabled, orb, level } = props;
  const { hold, grow } = useTalkBarHold({
    enabled: !disabled,
    held: orb === "level",
    onStart: props.onStart,
    onStop: props.onStop,
    onInterrupted: props.onInterrupted,
  });
  return (
    <View className="h-19 items-center justify-center">
      {orb ? (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
        >
          <Orb motion={orb} level={level} className="h-55 w-75" />
        </View>
      ) : null}
      <GestureDetector gesture={hold}>
        <Animated.View
          style={grow}
          accessible
          role="button"
          accessibilityLabel={talkCopy.buttonLabel(macName)}
          accessibilityHint={talkCopy.buttonHint}
          accessibilityState={{ disabled, busy: orb !== null }}
          className={cn(
            "h-19 w-full flex-row items-center justify-center gap-3 rounded-full",
            disabled ? "bg-linen" : "bg-ink",
          )}
        >
          <Icon
            name="mic"
            size="lg"
            tintColorClassName={disabled ? "accent-fog" : "accent-on-ink"}
          />
          <Text
            className={cn(
              labelStyle === "timer"
                ? "font-mono text-callout tabular-nums"
                : "font-sans-medium",
              disabled ? "text-fog" : "text-on-ink",
            )}
          >
            {label}
          </Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

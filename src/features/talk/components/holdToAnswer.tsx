import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { useTalkBarHold } from "../hooks/useTalkBarHold";

export type HoldControls = {
  label: string;
  labelStyle: "text" | "timer";
  held: boolean;
  onStart: () => void;
  onStop: () => void;
  onInterrupted: () => void;
};

type HoldToAnswerProps = { controls: HoldControls };

export function HoldToAnswer({ controls }: HoldToAnswerProps) {
  const { label, labelStyle, held } = controls;
  const { hold, grow } = useTalkBarHold({ enabled: true, ...controls });
  return (
    <GestureDetector gesture={hold}>
      <Animated.View
        style={grow}
        accessible
        role="button"
        accessibilityLabel={label}
        accessibilityState={{ busy: held }}
        className="h-13 flex-row items-center justify-center gap-2 rounded-full bg-ink"
      >
        <Icon name="mic" tintColorClassName="accent-on-ink" />
        <Text
          className={cn(
            "text-on-ink",
            labelStyle === "timer"
              ? "font-mono text-callout tabular-nums"
              : "font-sans-medium",
          )}
        >
          {label}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

import { SLOW_AFTER_MS, useElapsedOver, useSpinnerVisible } from "@getahoy/lib";
import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { duration } from "@/lib/motion";
import { PennantSpinner } from "./pennantSpinner";
import { Text } from "./text";

type WaitingStateProps = {
  busy: boolean;
  message: string;
  slowMessage?: string;
  slowHint?: string;
  slowAfterMs?: number;
};

export function WaitingState({
  busy,
  message,
  slowMessage,
  slowHint,
  slowAfterMs = SLOW_AFTER_MS,
}: WaitingStateProps) {
  const visible = useSpinnerVisible(busy);
  const slow = useElapsedOver(busy, slowAfterMs) ? slowMessage : undefined;
  if (!visible) return null;
  const line = slow ?? message;
  return (
    <Animated.View
      entering={FadeIn.duration(duration.base)}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={line}
      accessibilityLiveRegion="polite"
      className="flex-1 items-center justify-center gap-4 px-8 pb-30"
    >
      <PennantSpinner />
      <View className="max-w-viewfinder items-center gap-1.5">
        <Text variant="bodySmall" className="text-center text-driftwood">
          {line}
        </Text>
        {slow && slowHint ? (
          <Animated.View entering={FadeIn.duration(duration.slow)}>
            <Text variant="footnote" className="text-center text-driftwood">
              {slowHint}
            </Text>
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
}

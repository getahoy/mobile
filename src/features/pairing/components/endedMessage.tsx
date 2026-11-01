import Animated from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useReducedMotion } from "@/lib/motion";
import { macCopy } from "../copy/macCopy";
import { endedMotion } from "../endedMotion";
import { type EndedNotice, endedWhen } from "../endedPairing";

type EndedMessageProps = { notice: EndedNotice };

export function EndedMessage({ notice }: EndedMessageProps) {
  const { entering } = endedMotion(useReducedMotion());
  const copy = macCopy.ended[notice.reason];
  return (
    <Animated.View
      role="status"
      accessibilityLiveRegion="polite"
      entering={entering}
      className="gap-3.5"
    >
      <Text variant="eyebrow">{endedWhen(notice, Date.now())}</Text>
      <Text variant="headline">{copy.title}</Text>
      <Text className="text-driftwood">
        {copy.before}
        <Text className="font-sans-medium">{notice.deviceName}</Text>
        {copy.after}
      </Text>
    </Animated.View>
  );
}

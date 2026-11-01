import Animated from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useReducedMotion } from "@/lib/motion";
import { macCopy } from "../copy/macCopy";
import { endedMotion } from "../endedMotion";
import { type EndedNotice, endedWhen } from "../endedPairing";

type EndedNoteProps = {
  notice: EndedNotice;
  stillPairedWith: string;
  onDismiss: () => void;
};

export function EndedNote({
  notice,
  stillPairedWith,
  onDismiss,
}: EndedNoteProps) {
  const motion = endedMotion(useReducedMotion());
  return (
    <Animated.View
      role="status"
      accessibilityLiveRegion="polite"
      entering={motion.entering}
      exiting={motion.exiting}
      className="gap-2.5"
    >
      <Text variant="eyebrow">{endedWhen(notice, Date.now())}</Text>
      <Text className="font-fraunces text-note">
        {macCopy.ended[notice.reason].short(notice.deviceName)}
      </Text>
      <Text className="text-driftwood">
        {macCopy.stillPairedBefore}
        <Text className="font-sans-medium">{stillPairedWith}</Text>
        {macCopy.stillPairedAfter}
      </Text>
      <Button
        variant="outline"
        size="sm"
        className="mt-1.5 h-11 self-start"
        onPress={onDismiss}
      >
        <Text>{macCopy.dismiss}</Text>
      </Button>
    </Animated.View>
  );
}

import { Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { duration, easing } from "@/lib/motion";
import { macCopy } from "../copy/macCopy";
import type { EndedNotice } from "../endedPairing";

const rise = FadeInDown.duration(duration.base).easing(easing.out);

type EndedNoticeCardProps = { notice: EndedNotice; onDismiss: () => void };

export function EndedNoticeCard({ notice, onDismiss }: EndedNoticeCardProps) {
  return (
    <Animated.View
      entering={rise}
      className="flex-row items-start gap-1 rounded-card bg-paper py-1.5 pr-1.5 pl-5"
    >
      <Text
        variant="bodySmall"
        role="alert"
        accessibilityLiveRegion="polite"
        className="flex-1 py-2.5 text-driftwood"
      >
        {macCopy.ended[notice.reason](notice.macName)}
      </Text>
      <Pressable
        role="button"
        accessibilityLabel={macCopy.dismiss}
        onPress={onDismiss}
        className="size-11 items-center justify-center rounded-full active:bg-linen"
      >
        <Icon name="close" size="sm" tintColorClassName="accent-driftwood" />
      </Pressable>
    </Animated.View>
  );
}

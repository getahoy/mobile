import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { duration, easing } from "@/lib/motion";
import { talkCopy } from "../copy/talkCopy";
import type { Reply, ReplyTone } from "../talkView";

const eyebrowTones = {
  done: "text-kelp",
  asking: "text-signal",
  quiet: "text-driftwood",
  failed: "text-flare",
} as const satisfies Record<ReplyTone, string>;

const rise = FadeInDown.duration(duration.base).easing(easing.out);

type ReplyCardProps = { reply: Reply; onRetry: () => void };

export function ReplyCard({ reply, onRetry }: ReplyCardProps) {
  return (
    <Animated.View
      key={reply.message}
      entering={rise}
      accessibilityLiveRegion="polite"
      className="flex-row items-center gap-3 rounded-card bg-paper px-5 py-4"
    >
      <View className="flex-1 gap-1.5">
        <Text variant="eyebrow" className={eyebrowTones[reply.tone]}>
          {reply.label}
        </Text>
        <Text>{reply.message}</Text>
        {reply.followUp ? (
          <Text variant="footnote" className="text-driftwood">
            {reply.followUp}
          </Text>
        ) : null}
      </View>
      {reply.retry ? (
        <Button
          variant="secondary"
          size="sm"
          className="h-9 bg-transparent px-3.5"
          onPress={onRetry}
        >
          <Text className="text-body-sm">{talkCopy.tryAgain}</Text>
        </Button>
      ) : null}
    </Animated.View>
  );
}

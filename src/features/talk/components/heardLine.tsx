import Animated, { FadeIn } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { duration } from "@/lib/motion";
import { talkCopy } from "../copy/talkCopy";

type HeardLineProps = { text: string };

export function HeardLine({ text }: HeardLineProps) {
  return (
    <Animated.View key={text} entering={FadeIn.duration(duration.base)}>
      <Text variant="heard" className="text-center">
        {talkCopy.heard(text)}
      </Text>
    </Animated.View>
  );
}

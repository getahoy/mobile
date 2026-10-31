import Animated, { FadeIn } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { duration } from "@/lib/motion";
import { talkCopy } from "../copy/talkCopy";

export function TryHints() {
  return (
    <Animated.View
      entering={FadeIn.duration(duration.base)}
      className="items-center gap-1.5"
    >
      {talkCopy.examples.map((example) => (
        <Text
          key={example}
          className="rounded-full px-3 py-0.5 font-fraunces-italic text-body-lg text-fog"
        >
          {talkCopy.heard(example)}
        </Text>
      ))}
    </Animated.View>
  );
}

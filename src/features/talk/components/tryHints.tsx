import Animated, { FadeIn } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { duration } from "@/lib/motion";
import { talkCopy } from "../copy/talkCopy";

export function TryHints() {
  return (
    <Animated.View
      entering={FadeIn.duration(duration.base)}
      className="items-center gap-2.5 pb-6.5"
    >
      {talkCopy.examples.map((example) => (
        <Text
          key={example}
          numberOfLines={1}
          className="text-center font-fraunces-italic text-example text-fog"
        >
          {talkCopy.heard(example)}
        </Text>
      ))}
    </Animated.View>
  );
}

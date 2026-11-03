import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { duration } from "@/lib/motion";
import { talkCopy } from "../copy/talkCopy";
import { useTryLoop } from "../hooks/useTryLoop";
import { tryWords, wordPhase } from "../tryLoop";
import { TryDot } from "./tryDot";
import { TryWord } from "./tryWord";

const examples = talkCopy.examples.map(talkCopy.heard);
const firstExample = talkCopy.examples[0] ?? "";

type TryHintsProps = { paused: boolean };

export function TryHints({ paused }: TryHintsProps) {
  const frame = useTryLoop(examples, paused);
  const words = tryWords(examples[frame.index] ?? "");
  return (
    <Animated.View
      entering={FadeIn.duration(duration.base)}
      accessible
      accessibilityLabel={talkCopy.trySayingLabel(firstExample)}
      className="items-center gap-4.5 px-1 pb-6"
    >
      <Text variant="eyebrow">{talkCopy.trySaying}</Text>
      <View
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
        accessibilityLiveRegion="none"
        className="h-35 flex-row flex-wrap content-center justify-center gap-x-2.75"
      >
        {words.map((word, wordIndex) => (
          <TryWord
            key={`${frame.index}-${word}`}
            word={word}
            phase={wordPhase(frame, wordIndex, words.length)}
          />
        ))}
      </View>
      <View className="mt-1.5 flex-row gap-1.5">
        {examples.map((example, index) => (
          <TryDot key={example} active={index === frame.index} />
        ))}
      </View>
    </Animated.View>
  );
}

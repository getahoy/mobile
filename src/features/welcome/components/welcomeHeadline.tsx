import { View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import { welcomeCopy } from "../copy/welcomeCopy";
import { TimedWord } from "./timedWord";

type WelcomeHeadlineProps = { time: SharedValue<number> };

const lines = welcomeCopy.headline.map((line, lineIndex) => {
  const before = welcomeCopy.headline
    .slice(0, lineIndex)
    .reduce((count, earlier) => count + earlier.words.length, 0);
  const words = line.words.map((word, index) => ({
    word,
    order: before + index,
  }));
  return { italic: line.italic, words };
});

export function WelcomeHeadline({ time }: WelcomeHeadlineProps) {
  return (
    <View
      accessible
      role="heading"
      accessibilityLabel={welcomeCopy.headlineLabel}
      className="absolute inset-x-6 top-30"
    >
      {lines.map((line) => (
        <View
          key={line.words[0]?.word}
          className="flex-row flex-wrap gap-x-3.5"
        >
          {line.words.map(({ word, order }) => (
            <TimedWord
              key={word}
              time={time}
              order={order}
              word={word}
              italic={line.italic}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

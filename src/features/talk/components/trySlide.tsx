import { View } from "react-native";
import { type TryFrame, tryWords, wordPhase } from "../tryLoop";
import { TryWord } from "./tryWord";

type TrySlideProps = { example: string; frame: TryFrame | null };

export function TrySlide({ example, frame }: TrySlideProps) {
  const words = tryWords(example);
  return (
    <View className="flex-1 flex-row flex-wrap content-center justify-center gap-x-2.75 px-1">
      {words.map((word, wordIndex) => (
        <TryWord
          key={word}
          word={word}
          phase={frame ? wordPhase(frame, wordIndex, words.length) : "shown"}
        />
      ))}
    </View>
  );
}

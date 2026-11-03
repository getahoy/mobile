import { View } from "react-native";
import { Text } from "@/components/ui/text";

const NO_FONT_SCALING = 1;

type TrySlideProps = { example: string };

export function TrySlide({ example }: TrySlideProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text
        maxFontSizeMultiplier={NO_FONT_SCALING}
        textBreakStrategy="balanced"
        className="w-68 text-center font-fraunces-light-italic text-example text-ink"
      >
        {example}
      </Text>
    </View>
  );
}

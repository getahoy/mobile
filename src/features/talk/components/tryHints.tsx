import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { talkCopy } from "../copy/talkCopy";

export function TryHints() {
  return (
    <View className="items-center gap-3">
      <Text variant="eyebrow">{talkCopy.trySaying}</Text>
      {talkCopy.examples.map((example) => (
        <Text key={example} variant="heard" className="text-center text-fog">
          {talkCopy.heard(example)}
        </Text>
      ))}
    </View>
  );
}

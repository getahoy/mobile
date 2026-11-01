import { View } from "react-native";
import { Text } from "@/components/ui/text";

type TalkReasonProps = { reason: string };

export function TalkReason({ reason }: TalkReasonProps) {
  return (
    <View className="items-center px-4">
      <Text variant="footnote" className="text-center text-driftwood">
        {reason}
      </Text>
    </View>
  );
}

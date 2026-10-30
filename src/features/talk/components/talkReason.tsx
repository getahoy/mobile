import { Linking, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { talkCopy } from "../copy/talkCopy";

type TalkReasonProps = { reason: string; micBlocked: boolean };

export function TalkReason({ reason, micBlocked }: TalkReasonProps) {
  return (
    <View className="items-center gap-2 px-4">
      <Text variant="footnote" className="text-center text-driftwood">
        {reason}
      </Text>
      {micBlocked ? (
        <Button
          variant="outline"
          size="sm"
          onPress={() => void Linking.openSettings()}
        >
          <Text>{talkCopy.openSettings}</Text>
        </Button>
      ) : null}
    </View>
  );
}

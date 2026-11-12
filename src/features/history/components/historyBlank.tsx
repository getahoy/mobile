import type { ReactNode } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

type BlankAction = { label: string; onPress: () => void };

type HistoryBlankProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  action?: BlankAction;
  accessory?: ReactNode;
};

export function HistoryBlank({
  eyebrow,
  title,
  body,
  action,
  accessory,
}: HistoryBlankProps) {
  return (
    <View role="status" className="gap-3 px-8 pt-16 pb-20">
      {eyebrow ? <Text variant="eyebrow">{eyebrow}</Text> : null}
      <Text variant="title">{title}</Text>
      {body ? <Text className="text-driftwood">{body}</Text> : null}
      {action ? (
        <Button
          variant="outline"
          size="sm"
          onPress={action.onPress}
          className="mt-1.5 self-start"
        >
          <Text>{action.label}</Text>
        </Button>
      ) : null}
      {accessory}
    </View>
  );
}

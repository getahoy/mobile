import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { talkCopy } from "../copy/talkCopy";
import type { Thread } from "../threads/threadStore";

type ThreadViewProps = {
  thread: Thread;
  expanded: boolean;
  onToggle: () => void;
};

export function ThreadView({ thread, expanded, onToggle }: ThreadViewProps) {
  const open = thread.status === "open";
  const summary = talkCopy.threadSummary(thread.status, thread.lines.length);
  return (
    <View className="w-full gap-1 rounded-2xl bg-muted px-4 py-3">
      {open ? null : (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={summary}
          onPress={onToggle}
        >
          <Text className="text-xs font-semibold text-muted-foreground">
            {summary} {expanded ? "⌃" : "⌄"}
          </Text>
        </Pressable>
      )}
      {open || expanded
        ? thread.lines.map((line) => (
            <Text
              key={line.id}
              className={line.speaker === "you" ? "text-muted-foreground" : ""}
            >
              {talkCopy.threadLine(line.speaker, line.text)}
            </Text>
          ))
        : null}
    </View>
  );
}

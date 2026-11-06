import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { historyCopy } from "../copy/historyCopy";

export type RunAgainAction = {
  label: string;
  ready: boolean;
  onPress: () => void;
};

type EntryActionsProps = {
  runAgain: RunAgainAction | null;
  onCopy: () => void;
  onReport: () => void;
  onDelete: () => void;
};

export function EntryActions(props: EntryActionsProps) {
  const { runAgain } = props;
  return (
    <View className="gap-2.5 pt-1">
      {runAgain ? (
        <Button
          variant="secondary"
          disabled={!runAgain.ready}
          onPress={runAgain.onPress}
          className={cn(!runAgain.ready && "opacity-40")}
        >
          <Text>{runAgain.label}</Text>
        </Button>
      ) : null}
      {runAgain && !runAgain.ready ? (
        <Text variant="footnote" className="text-center text-driftwood">
          {historyCopy.runAgainOff}
        </Text>
      ) : null}
      <Button variant="outline" size="sm" onPress={props.onReport}>
        <Text numberOfLines={1}>{historyCopy.report}</Text>
      </Button>
      <View className="flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          onPress={props.onCopy}
          className="flex-1"
        >
          <Text>{historyCopy.copy}</Text>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onPress={props.onDelete}
          className="flex-1"
        >
          <Text className="text-flare">{historyCopy.delete}</Text>
        </Button>
      </View>
    </View>
  );
}

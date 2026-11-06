import { View } from "react-native";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { historyCopy } from "../copy/historyCopy";
import { HistoryBlank } from "./historyBlank";

type HistoryOffProps = { changing: boolean; onTurnOn: () => void };

export function HistoryOff({ changing, onTurnOn }: HistoryOffProps) {
  const toggle = (
    <View className="mt-3 flex-row items-center gap-3">
      <Text className="flex-1 font-sans-medium">{historyCopy.keepHistory}</Text>
      <Switch
        checked={false}
        disabled={changing}
        onCheckedChange={onTurnOn}
        accessibilityLabel={historyCopy.keepHistory}
      />
    </View>
  );
  return (
    <HistoryBlank
      title={historyCopy.offTitle}
      body={historyCopy.offBody}
      accessory={toggle}
    />
  );
}

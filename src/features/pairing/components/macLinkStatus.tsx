import { ActivityIndicator, Pressable, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { MacLinkState } from "../connection/macLinkState";
import { macCopy } from "../copy/macCopy";
import { Icon } from "./icon";

const MENU_ICON_SIZE = 20;

export type MacCardAction = { label: string; onPress: () => void };

type MacLinkStatusProps = {
  macName: string;
  state: MacLinkState;
  action: MacCardAction | null;
  onMore: () => void;
};

function statusLine(state: MacLinkState, mac: string): string {
  switch (state.kind) {
    case "connecting":
      return macCopy.connecting;
    case "connected":
      return state.locked ? macCopy.locked(mac) : macCopy.connected;
    case "paused":
      return macCopy.paused;
    case "macOff":
      return macCopy.macOff(mac);
    case "macQuit":
      return macCopy.macQuit(mac);
    case "macAsleep":
      return macCopy.macAsleep(mac);
    case "unreachable":
      return state.onCellular ? macCopy.cellular(mac) : macCopy.notFound(mac);
    case "macTooOld":
      return macCopy.macTooOld;
    case "macTooNew":
      return macCopy.macTooNew;
    case "unrecognised":
      return macCopy.unrecognised(mac);
    case "ended":
      return macCopy.endedRemoved(mac);
    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}

export function MacLinkStatus({
  macName,
  state,
  action,
  onMore,
}: MacLinkStatusProps) {
  return (
    <View className="gap-3 rounded-xl border border-border p-4">
      <View className="flex-row items-center gap-3">
        <Text className="flex-1 font-medium">{macName}</Text>
        {state.kind === "connecting" ? (
          <ActivityIndicator colorClassName="accent-muted-foreground" />
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={macCopy.moreOptions(macName)}
          onPress={onMore}
          className="size-9 items-center justify-center rounded-full"
        >
          <Icon
            name="ellipsis-horizontal"
            size={MENU_ICON_SIZE}
            colorClassName="accent-muted-foreground"
          />
        </Pressable>
      </View>
      <Text
        accessibilityLiveRegion="polite"
        className="text-muted-foreground text-sm"
      >
        {statusLine(state, macName)}
      </Text>
      {action ? (
        <Button variant="outline" onPress={action.onPress}>
          <Text>{action.label}</Text>
        </Button>
      ) : null}
    </View>
  );
}

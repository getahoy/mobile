import { ActivityIndicator, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { pairingCopy } from "../copy/pairingCopy";
import type { MacLinkState } from "../hooks/useMacConnection";

type MacLinkStatusProps = {
  macName: string;
  state: MacLinkState;
  onRetry: () => void;
  onPairAgain: () => void;
  onRemove: () => void;
};

type LinkAction = { label: string; onPress: () => void } | null;

function statusLine(state: MacLinkState): string {
  switch (state.kind) {
    case "connecting":
      return pairingCopy["link.connecting"];
    case "connected":
      return pairingCopy["link.connected"];
    case "unreachable":
      return pairingCopy[state.onCellular ? "link.cellular" : "link.notFound"];
    case "macTooOld":
      return pairingCopy["link.macTooOld"];
    case "macTooNew":
      return pairingCopy["link.macTooNew"];
    case "rejected":
      return pairingCopy["link.rejected"];
    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}

function linkAction(props: MacLinkStatusProps): LinkAction {
  const { kind } = props.state;
  if (kind === "unreachable") {
    return { label: pairingCopy["link.retry"], onPress: props.onRetry };
  }
  if (kind === "rejected") {
    return { label: pairingCopy["link.pairAgain"], onPress: props.onPairAgain };
  }
  return null;
}

export function MacLinkStatus(props: MacLinkStatusProps) {
  const action = linkAction(props);
  return (
    <View className="gap-3 rounded-xl border border-border p-4">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="flex-1 font-medium">{props.macName}</Text>
        {props.state.kind === "connecting" ? (
          <ActivityIndicator colorClassName="accent-muted-foreground" />
        ) : null}
      </View>
      <Text
        accessibilityLiveRegion="polite"
        className="text-muted-foreground text-sm"
      >
        {statusLine(props.state)}
      </Text>
      {action ? (
        <Button variant="outline" onPress={action.onPress}>
          <Text>{action.label}</Text>
        </Button>
      ) : null}
      <Button
        variant="ghost"
        size="sm"
        className="self-end"
        accessibilityLabel={`${pairingCopy["link.remove"]} ${props.macName}`}
        onPress={props.onRemove}
      >
        <Text className="text-destructive">{pairingCopy["link.remove"]}</Text>
      </Button>
    </View>
  );
}

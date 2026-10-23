import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { pairingCopy } from "../copy/pairingCopy";
import type { MacLinkState } from "../hooks/useMacConnection";

type MacLinkStatusProps = {
  macName: string;
  state: MacLinkState;
  onRetry: () => void;
};

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

export function MacLinkStatus({ macName, state, onRetry }: MacLinkStatusProps) {
  const settled = state.kind !== "connecting" && state.kind !== "connected";
  return (
    <View className="gap-2 rounded-lg border border-border p-4">
      <Text className="font-medium">{macName}</Text>
      <Text
        accessibilityLiveRegion="polite"
        className="text-muted-foreground text-sm"
      >
        {statusLine(state)}
      </Text>
      {settled ? (
        <Button variant="outline" onPress={onRetry}>
          <Text>{pairingCopy["link.retry"]}</Text>
        </Button>
      ) : null}
    </View>
  );
}

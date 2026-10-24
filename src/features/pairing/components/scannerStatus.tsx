import { ActivityIndicator, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { pairingCopy } from "../copy/pairingCopy";
import type { ClaimState } from "../hooks/useClaimMac";

type ScannerStatusProps = {
  state: ClaimState;
  onScanAgain: () => void;
};

const card = "gap-3 rounded-2xl bg-background p-5";

export function ScannerStatus({ state, onScanAgain }: ScannerStatusProps) {
  switch (state.kind) {
    case "scanning":
      return null;
    case "claiming":
      return (
        <View className="absolute inset-x-0 bottom-0 px-5 pb-safe-offset-5">
          <View className={`${card} flex-row items-center`}>
            <ActivityIndicator colorClassName="accent-muted-foreground" />
            <Text>{pairingCopy["pair.claiming"]}</Text>
          </View>
        </View>
      );
    case "failed":
      return (
        <View className="absolute inset-x-0 bottom-0 px-5 pb-safe-offset-5">
          <View className={card}>
            <Text accessibilityRole="alert">{state.message}</Text>
            <Button onPress={onScanAgain}>
              <Text>{pairingCopy["pair.scanAgain"]}</Text>
            </Button>
          </View>
        </View>
      );
    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}

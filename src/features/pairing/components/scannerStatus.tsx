import { ActivityIndicator, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { macCopy } from "../copy/macCopy";
import { pairingCopy } from "../copy/pairingCopy";
import type { ClaimState } from "../hooks/useClaimMac";

const progressCopy = {
  claiming: "pair.claiming",
  finishing: "pair.finishing",
} as const;

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
    case "finishing":
      return (
        <View className="absolute inset-x-0 bottom-0 px-5 pb-safe-offset-5">
          <View className={`${card} flex-row items-center`}>
            <ActivityIndicator colorClassName="accent-muted-foreground" />
            <Text accessibilityLiveRegion="polite">
              {pairingCopy[progressCopy[state.kind]]}
            </Text>
          </View>
        </View>
      );
    case "paired":
      return (
        <View className="absolute inset-x-0 bottom-0 px-5 pb-safe-offset-5">
          <View className={`${card} flex-row items-center`}>
            <Icon
              name="checkCircle"
              size="lg"
              tintColorClassName="accent-kelp"
            />
            <Text accessibilityLiveRegion="polite">
              {macCopy.pairedWith(state.macName)}
            </Text>
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

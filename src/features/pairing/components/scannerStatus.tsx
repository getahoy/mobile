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

type ScannerStatusProps = { state: ClaimState; onScanAgain: () => void };

const dock = "absolute inset-x-0 bottom-0 px-5 pb-safe-offset-5";

export function ScannerStatus({ state, onScanAgain }: ScannerStatusProps) {
  switch (state.kind) {
    case "scanning":
      return null;
    case "claiming":
    case "finishing":
      return (
        <View className={dock}>
          <View className="flex-row items-center gap-3 self-center rounded-full bg-night px-5 py-3">
            <ActivityIndicator colorClassName="accent-on-scrim" />
            <Text accessibilityLiveRegion="polite" className="text-on-scrim">
              {pairingCopy[progressCopy[state.kind]]}
            </Text>
          </View>
        </View>
      );
    case "paired":
      return (
        <View className={dock}>
          <View className="items-center gap-3 rounded-card bg-paper p-6">
            <Icon
              name="checkCircle"
              size="xl"
              tintColorClassName="accent-kelp"
            />
            <Text variant="title" accessibilityLiveRegion="polite">
              {macCopy.pairedWith(state.macName)}
            </Text>
          </View>
        </View>
      );
    case "failed":
      return (
        <View className={dock}>
          <View className="gap-4 rounded-card bg-paper p-5">
            <Text role="alert">{state.message}</Text>
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

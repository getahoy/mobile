import type { EndReason } from "@getahoy/protocol";
import { router } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { macCopy } from "../copy/macCopy";
import { type PairedMac, removePairedMac } from "../storage/pairedMacs";

type EndedMacCardProps = {
  mac: PairedMac;
  reason: EndReason;
  onDismissed: () => void;
};

const endedMessage: Record<EndReason, (mac: string) => string> = {
  removed: macCopy.endedRemoved,
  replaced: macCopy.endedReplaced,
  signed_out: macCopy.endedSignedOut,
};

export function EndedMacCard({ mac, reason, onDismissed }: EndedMacCardProps) {
  const pairAgain = () =>
    router.push({ pathname: "/pair", params: { mac: mac.displayName } });
  const dismiss = () =>
    void removePairedMac(mac.publicKey)
      .catch(() => undefined)
      .finally(onDismissed);
  return (
    <View className="gap-3 rounded-xl border border-border p-4">
      <Text className="font-medium">{mac.displayName}</Text>
      <Text accessibilityRole="alert" className="text-sm">
        {endedMessage[reason](mac.displayName)}
      </Text>
      <View className="flex-row gap-3">
        <Button className="flex-1" onPress={pairAgain}>
          <Text>{macCopy.pairAgain}</Text>
        </Button>
        <Button className="flex-1" variant="outline" onPress={dismiss}>
          <Text>{macCopy.dismiss}</Text>
        </Button>
      </View>
    </View>
  );
}

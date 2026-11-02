import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { pairingCopy } from "../copy/pairingCopy";
import type { FailureAction } from "../scannerMessage";

const actionCopy = {
  tryAgain: "pair.tryAgain",
  scanAgain: "pair.scanAgain",
  signIn: "pair.signInAction",
} as const satisfies Record<FailureAction, keyof typeof pairingCopy>;

type ScannerFailureCardProps = {
  text: string;
  action: FailureAction;
  pending: boolean;
  onAction: () => void;
};

export function ScannerFailureCard({
  text,
  action,
  pending,
  onAction,
}: ScannerFailureCardProps) {
  return (
    <View className="items-center gap-4 rounded-card bg-paper p-6">
      <Text role="alert" className="text-center">
        {text}
      </Text>
      <Button size="sm" loading={pending} onPress={onAction}>
        <Text>{pairingCopy[actionCopy[action]]}</Text>
      </Button>
    </View>
  );
}

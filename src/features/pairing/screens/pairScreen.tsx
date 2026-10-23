import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { QrScanner } from "../components/qrScanner";
import { pairingCopy } from "../copy/pairingCopy";
import { useClaimMac } from "../hooks/useClaimMac";

export function PairScreen() {
  const { state, claim, scanAgain } = useClaimMac(() => router.back());

  return (
    <View className="flex-1 gap-6 bg-background p-6 pt-16">
      <Text variant="h3">{pairingCopy["pair.title"]}</Text>
      <Text className="text-muted-foreground">
        {pairingCopy["pair.instructions"]}
      </Text>
      <QrScanner
        active={state.kind === "scanning"}
        onScanned={(scanned) => void claim(scanned)}
      />
      {state.kind === "claiming" ? (
        <View className="flex-row items-center gap-3">
          <ActivityIndicator colorClassName="accent-muted-foreground" />
          <Text>{pairingCopy["pair.claiming"]}</Text>
        </View>
      ) : null}
      {state.kind === "failed" ? (
        <View className="gap-3">
          <Text accessibilityRole="alert" className="text-destructive">
            {state.message}
          </Text>
          <Button onPress={scanAgain}>
            <Text>{pairingCopy["pair.scanAgain"]}</Text>
          </Button>
        </View>
      ) : null}
      <Button variant="ghost" onPress={() => router.back()}>
        <Text>{pairingCopy["pair.cancel"]}</Text>
      </Button>
    </View>
  );
}

import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { pairingCopy } from "../copy/pairingCopy";
import { usePairedMacs } from "../hooks/usePairedMacs";
import { PairedMacItem } from "./pairedMacItem";

export function PairedMacsSection() {
  const macs = usePairedMacs();

  return (
    <View className="gap-3">
      <Text variant="large">{pairingCopy["home.title"]}</Text>
      {macs === null ? (
        <ActivityIndicator
          accessibilityLabel={pairingCopy["home.loading"]}
          colorClassName="accent-muted-foreground"
        />
      ) : null}
      {macs?.length === 0 ? (
        <Text className="text-muted-foreground">
          {pairingCopy["home.empty"]}
        </Text>
      ) : null}
      {macs?.map((mac) => (
        <PairedMacItem key={mac.publicKey} mac={mac} />
      ))}
      <Button variant="outline" onPress={() => router.push("/pair")}>
        <Text>{pairingCopy["home.pair"]}</Text>
      </Button>
    </View>
  );
}

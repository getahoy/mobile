import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { pairingCopy } from "../copy/pairingCopy";
import { usePairedMacs } from "../hooks/usePairedMacs";
import { PairedMacItem } from "./pairedMacItem";

export function PairedMacsSection() {
  const { macs, reload } = usePairedMacs();
  const openScanner = () => router.push("/pair");

  if (macs === null) {
    return (
      <ActivityIndicator
        accessibilityLabel={pairingCopy["home.loading"]}
        colorClassName="accent-muted-foreground"
      />
    );
  }
  return (
    <View className="gap-3">
      <Text variant="large">{pairingCopy["home.title"]}</Text>
      {macs.length === 0 ? (
        <>
          <Text className="text-muted-foreground">
            {pairingCopy["home.empty"]}
          </Text>
          <Button onPress={openScanner}>
            <Text>{pairingCopy["home.pair"]}</Text>
          </Button>
        </>
      ) : (
        <>
          {macs.map((mac) => (
            <PairedMacItem key={mac.publicKey} mac={mac} onRemoved={reload} />
          ))}
          <Button variant="link" onPress={openScanner}>
            <Text>{pairingCopy["home.pairAnother"]}</Text>
          </Button>
        </>
      )}
    </View>
  );
}

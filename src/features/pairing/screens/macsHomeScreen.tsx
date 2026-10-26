import { router } from "expo-router";
import { ActivityIndicator, ScrollView } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { HomeHeader } from "../components/homeHeader";
import { NoMacsYet } from "../components/noMacsYet";
import { PairedMacItem } from "../components/pairedMacItem";
import { homeCopy } from "../copy/homeCopy";
import { useLinkSync } from "../hooks/useLinkSync";
import { usePairedMacs } from "../hooks/usePairedMacs";

export function MacsHomeScreen() {
  const { macs, reload } = usePairedMacs();
  useLinkSync(reload);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="flex-grow gap-4 px-6 pt-safe-offset-4 pb-safe-offset-6"
    >
      <HomeHeader />
      {macs === null ? (
        <ActivityIndicator
          accessibilityLabel={homeCopy.loading}
          colorClassName="accent-muted-foreground"
        />
      ) : null}
      {macs?.length === 0 ? <NoMacsYet /> : null}
      {macs?.map((mac) => (
        <PairedMacItem key={mac.publicKey} mac={mac} onChanged={reload} />
      ))}
      {macs && macs.length > 0 ? (
        <Button variant="link" onPress={() => router.push("/pair")}>
          <Text>{homeCopy.addAnother}</Text>
        </Button>
      ) : null}
    </ScrollView>
  );
}

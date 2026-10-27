import { router } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TalkButton } from "@/features/talk/components/talkButton";
import { TalkStatus } from "@/features/talk/components/talkStatus";
import { useTalk } from "@/features/talk/hooks/useTalk";
import { useTalkTarget } from "@/features/talk/hooks/useTalkTarget";
import { HomeHeader } from "../components/homeHeader";
import { NoMacsYet } from "../components/noMacsYet";
import { PairedMacItem } from "../components/pairedMacItem";
import { homeCopy } from "../copy/homeCopy";
import { useLinkSync } from "../hooks/useLinkSync";
import { usePairedMacs } from "../hooks/usePairedMacs";

export function MacsHomeScreen() {
  const { macs, reload } = usePairedMacs();
  useLinkSync(reload);
  const target = useTalkTarget(macs ?? []);
  const talk = useTalk(target.block ? null : target.mac);
  const macName = target.mac?.displayName ?? "";
  const { kind } = talk.state;
  const working = kind === "understanding" || kind === "sending";
  const blocked = target.block !== null || talk.access === "blocked";

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
      {target.mac ? (
        <View className="gap-4 py-4">
          <TalkButton
            macName={macName}
            disabled={blocked || working}
            listening={kind === "listening"}
            onPressIn={() => void talk.flow.press()}
            onPressOut={talk.flow.release}
          />
          <TalkStatus
            state={talk.state}
            block={target.block}
            access={talk.access}
            macName={macName}
            durationMs={talk.durationMs}
            onTryAgain={talk.flow.tryAgain}
          />
        </View>
      ) : null}
      {macs && macs.length > 0 ? (
        <Button variant="link" onPress={() => router.push("/pair")}>
          <Text>{homeCopy.addAnother}</Text>
        </Button>
      ) : null}
    </ScrollView>
  );
}

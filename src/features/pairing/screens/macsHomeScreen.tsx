import { View } from "react-native";
import { TalkPanel } from "@/features/talk/components/talkPanel";
import { useTalkTarget } from "@/features/talk/hooks/useTalkTarget";
import { HomeHeader } from "../components/homeHeader";
import { HomeMac } from "../components/homeMac";
import { NoMacsYet } from "../components/noMacsYet";
import { useKeepMacsConnected } from "../hooks/useKeepMacsConnected";
import { useLinkSync } from "../hooks/useLinkSync";
import { usePairedMacs } from "../hooks/usePairedMacs";

export function MacsHomeScreen() {
  const { macs, reload } = usePairedMacs();
  useLinkSync(reload);
  useKeepMacsConnected(macs, reload);
  const target = useTalkTarget(macs ?? []);
  const shown = target.mac ?? macs?.[0] ?? null;
  const { mac: talkMac } = target;

  return (
    <View className="flex-1 bg-sailcloth pt-safe">
      {macs?.length === 0 ? (
        <>
          <HomeHeader chip={<View />} />
          <NoMacsYet />
        </>
      ) : null}
      {shown ? (
        <HomeMac
          key={shown.publicKey}
          mac={shown}
          macs={macs ?? []}
          onChanged={reload}
        />
      ) : null}
      {talkMac ? (
        <TalkPanel target={{ ...target, mac: talkMac }} />
      ) : (
        <View className="flex-1" />
      )}
    </View>
  );
}

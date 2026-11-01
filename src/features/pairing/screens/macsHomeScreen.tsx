import { View } from "react-native";
import { useLocalNetworkIntro } from "@/features/permissions/hooks/useLocalNetworkIntro";
import { useTurnedOnNotice } from "@/features/permissions/hooks/useTurnedOnNotice";
import { TalkPanel } from "@/features/talk/components/talkPanel";
import { useTalkTarget } from "@/features/talk/hooks/useTalkTarget";
import { HomeMac } from "../components/homeMac";
import { HomeNotices } from "../components/homeNotices";
import { NoMacsYet } from "../components/noMacsYet";
import { useKeepMacsConnected } from "../hooks/useKeepMacsConnected";
import { useLinkSync } from "../hooks/useLinkSync";
import { usePairedMacs } from "../hooks/usePairedMacs";
import { useEndedNotice } from "../storage/endedNotice";

export function MacsHomeScreen() {
  const { macs, reload } = usePairedMacs();
  useLinkSync(reload);
  const introPending = useLocalNetworkIntro((macs?.length ?? 0) > 0);
  useKeepMacsConnected(introPending ? null : macs, reload);
  const ended = useEndedNotice();
  const turnedOn = useTurnedOnNotice();
  const target = useTalkTarget(macs ?? []);
  const { mac } = target;

  if (macs?.length === 0) return <NoMacsYet ended={ended.notice} />;

  return (
    <View className="flex-1 bg-sailcloth pt-safe">
      {mac ? (
        <HomeMac
          key={mac.publicKey}
          mac={mac}
          macs={macs ?? []}
          onChanged={reload}
        />
      ) : null}
      {mac ? (
        <TalkPanel
          key={`${mac.publicKey}:talk`}
          target={{ ...target, mac }}
          notice={<HomeNotices macName={mac.displayName} turnedOn={turnedOn} />}
        />
      ) : (
        <View className="flex-1" />
      )}
    </View>
  );
}

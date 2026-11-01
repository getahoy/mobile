import { View } from "react-native";
import { TurnedOnPill } from "@/features/permissions/components/turnedOnPill";
import { useLocalNetworkIntro } from "@/features/permissions/hooks/useLocalNetworkIntro";
import { useTurnedOnNotice } from "@/features/permissions/hooks/useTurnedOnNotice";
import { TalkPanel } from "@/features/talk/components/talkPanel";
import { useTalkTarget } from "@/features/talk/hooks/useTalkTarget";
import { EndedNoticeCard } from "../components/endedNoticeCard";
import { HomeMac } from "../components/homeMac";
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
  const { notice, clear } = useTurnedOnNotice();
  const ended = useEndedNotice();
  const target = useTalkTarget(macs ?? []);
  const { mac } = target;
  const endedCard = ended.notice ? (
    <EndedNoticeCard notice={ended.notice} onDismiss={ended.dismiss} />
  ) : null;
  const turnedOn = notice ? (
    <TurnedOnPill
      key={notice.key}
      kind={notice.kind}
      look="home"
      onHidden={clear}
    />
  ) : null;

  if (macs?.length === 0) return <NoMacsYet notice={endedCard} />;

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
      {endedCard ? <View className="px-5 pt-2">{endedCard}</View> : null}
      {mac ? (
        <TalkPanel
          key={mac.publicKey}
          target={{ ...target, mac }}
          notice={turnedOn}
        />
      ) : (
        <View className="flex-1" />
      )}
    </View>
  );
}

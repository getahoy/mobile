import { View } from "react-native";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";
import { useTalk } from "../hooks/useTalk";
import { useTalkTarget } from "../hooks/useTalkTarget";
import { useThread } from "../hooks/useThread";
import { ChoiceSheet } from "./choiceSheet";
import { TalkButton } from "./talkButton";
import { TalkStatus } from "./talkStatus";
import { ThreadView } from "./threadView";

type TalkPanelProps = { macs: readonly PairedMac[] };

export function TalkPanel({ macs }: TalkPanelProps) {
  const target = useTalkTarget(macs);
  const talk = useTalk(target.block ? null : target.mac);
  const { thread, expanded, toggle } = useThread(talk.state);
  const macName = target.mac?.displayName ?? "";
  const { kind } = talk.state;
  return (
    <>
      {target.mac ? (
        <View className="items-center gap-2 px-6 pb-safe-offset-4">
          {thread ? (
            <ThreadView thread={thread} expanded={expanded} onToggle={toggle} />
          ) : null}
          <TalkStatus
            state={talk.state}
            block={target.block}
            access={talk.access}
            macName={macName}
            durationMs={talk.durationMs}
            onTryAgain={talk.flow.tryAgain}
          />
          <TalkButton
            macName={macName}
            disabled={target.block !== null || talk.access === "blocked"}
            listening={kind === "listening"}
            thinking={kind === "understanding" || kind === "sending"}
            level={talk.level}
            onStart={() => void talk.flow.press()}
            onStop={talk.flow.release}
            onInterrupted={() => talk.flow.interrupt()}
          />
        </View>
      ) : null}
      <ChoiceSheet
        state={talk.state}
        onChoose={talk.flow.choose}
        onDismiss={talk.flow.dismissChoices}
      />
    </>
  );
}

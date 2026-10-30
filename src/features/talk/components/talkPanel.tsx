import { Linking, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";
import { talkCopy } from "../copy/talkCopy";
import { useTalk } from "../hooks/useTalk";
import type { TalkTarget } from "../hooks/useTalkTarget";
import { useThread } from "../hooks/useThread";
import { talkBarView } from "../talkBarView";
import { talkView } from "../talkView";
import { ChoiceSheet } from "./choiceSheet";
import { HeardLine } from "./heardLine";
import { ReplyCard } from "./replyCard";
import { TalkBar } from "./talkBar";

type TalkPanelProps = { target: TalkTarget & { mac: PairedMac } };

export function TalkPanel({ target }: TalkPanelProps) {
  const talk = useTalk(target.block ? null : target.mac);
  const { thread } = useThread(talk.state);
  const mac = target.mac.displayName;
  const { heard, reply } = talkView(talk.state, thread, mac);
  const bar = talkBarView({
    state: talk.state,
    block: target.block,
    access: talk.access,
    mac,
    durationMs: talk.durationMs,
  });
  return (
    <>
      <View className="flex-1 justify-center gap-5 px-6">
        {heard ? <HeardLine text={heard} /> : null}
        {reply ? (
          <ReplyCard reply={reply} onRetry={talk.flow.tryAgain} />
        ) : null}
      </View>
      <View className="gap-3.5 px-5 pb-safe-offset-2">
        {bar.reason ? (
          <View className="items-center gap-2 px-4">
            <Text variant="footnote" className="text-center text-driftwood">
              {bar.reason}
            </Text>
            {talk.access === "blocked" ? (
              <Button
                variant="outline"
                size="sm"
                onPress={() => void Linking.openSettings()}
              >
                <Text>{talkCopy.openSettings}</Text>
              </Button>
            ) : null}
          </View>
        ) : null}
        <TalkBar
          macName={mac}
          label={bar.label}
          labelStyle={bar.labelStyle}
          disabled={bar.disabled}
          orb={bar.orb}
          level={talk.level}
          onStart={() => void talk.flow.press()}
          onStop={talk.flow.release}
          onInterrupted={() => talk.flow.interrupt()}
        />
      </View>
      <ChoiceSheet
        state={talk.state}
        onChoose={talk.flow.choose}
        onDismiss={talk.flow.dismissChoices}
      />
    </>
  );
}

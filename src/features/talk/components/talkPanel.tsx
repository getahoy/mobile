import { type ReactNode, useState } from "react";
import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";
import { easing } from "@/lib/motion";
import { talkCopy } from "../copy/talkCopy";
import { useTalk } from "../hooks/useTalk";
import { useThread } from "../hooks/useThread";
import { talkBarView } from "../talkBarView";
import type { TalkBlock } from "../talkState";
import { talkView } from "../talkView";
import { voiceActivity } from "../voiceActivity";
import { ChoiceSheet } from "./choiceSheet";
import { HeardLine } from "./heardLine";
import { ReplyCard } from "./replyCard";
import { TalkBar } from "./talkBar";
import { TalkReason } from "./talkReason";
import { TryHints } from "./tryHints";

const LAUNCH_RISE_MS = 900;
const rise = FadeInDown.duration(LAUNCH_RISE_MS).easing(easing.out);

type TalkPanelProps = {
  mac: PairedMac;
  block: TalkBlock | null;
  notice: ReactNode;
};

export function TalkPanel({ mac: target, block, notice }: TalkPanelProps) {
  const [pressed, setPressed] = useState(false);
  const talk = useTalk(block ? null : target);
  const { thread } = useThread(talk.state);
  const mac = target.displayName;
  const { heard, reply } = talkView(talk.state, thread, mac);
  const bar = talkBarView({
    state: talk.state,
    block,
    mac,
    durationMs: talk.durationMs,
  });
  const hold = {
    onStart: () => {
      setPressed(true);
      void talk.flow.press();
    },
    onStop: () => {
      setPressed(false);
      talk.flow.release();
    },
    onInterrupted: () => {
      setPressed(false);
      talk.flow.interrupt();
    },
  };
  const activity = voiceActivity(talk.state, talk.speech, talk.level);
  const idle = !(heard || reply || thread || activity.orb || bar.disabled);
  const answering = activity.tone === "listen" && activity.orb !== null;
  const answer = {
    ...hold,
    label: answering ? bar.label : talkCopy.holdToAnswer,
    labelStyle: bar.labelStyle,
    held: activity.tone === "listen" && activity.dots === "level",
  };
  return (
    <>
      <View className="flex-1 justify-center gap-5 px-6">
        {notice}
        {idle ? (
          <TryHints paused={pressed || talk.state.kind !== "ready"} />
        ) : null}
        {heard ? <HeardLine text={heard} /> : null}
        {reply ? (
          <ReplyCard reply={reply} onRetry={talk.flow.tryAgain} />
        ) : null}
      </View>
      <Animated.View entering={rise} className="gap-3.5 px-5 pb-safe-offset-2">
        {bar.reason ? <TalkReason reason={bar.reason} /> : null}
        <TalkBar macName={mac} {...bar} activity={activity} {...hold} />
      </Animated.View>
      <ChoiceSheet
        state={talk.state}
        answer={answer}
        onChoose={talk.flow.choose}
        onDismiss={talk.flow.dismissChoices}
      />
    </>
  );
}

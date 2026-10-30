import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";
import { easing } from "@/lib/motion";
import { talkCopy } from "../copy/talkCopy";
import { useTalk } from "../hooks/useTalk";
import type { TalkTarget } from "../hooks/useTalkTarget";
import { useThread } from "../hooks/useThread";
import { talkBarView } from "../talkBarView";
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
  const hold = {
    onStart: () => void talk.flow.press(),
    onStop: talk.flow.release,
    onInterrupted: () => talk.flow.interrupt(),
  };
  const activity = voiceActivity(talk.state, talk.speech, talk.level);
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
        {heard ? <HeardLine text={heard} /> : null}
        {heard || reply || thread ? null : <TryHints />}
        {reply ? (
          <ReplyCard reply={reply} onRetry={talk.flow.tryAgain} />
        ) : null}
      </View>
      <Animated.View entering={rise} className="gap-3.5 px-5 pb-safe-offset-2">
        {bar.reason ? (
          <TalkReason
            reason={bar.reason}
            micBlocked={talk.access === "blocked"}
          />
        ) : null}
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

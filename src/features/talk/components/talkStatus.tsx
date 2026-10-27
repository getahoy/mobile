import { Linking, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Icon } from "@/features/pairing/components/icon";
import { talkCopy } from "../copy/talkCopy";
import type { MicAccess } from "../recorder/useFileRecorder";
import {
  RETRYABLE_FAILURES,
  type TalkBlock,
  type TalkFailure,
  type TalkState,
} from "../talkState";

const DONE_ICON_SIZE = 18;

type TalkStatusProps = {
  state: TalkState;
  block: TalkBlock | null;
  access: MicAccess;
  macName: string;
  durationMs: number;
  onTryAgain: () => void;
};

function blockLine(block: TalkBlock, mac: string): string {
  if (block === "locked") return talkCopy.locked(mac);
  if (block === "paused") return talkCopy.paused(mac);
  return talkCopy.noMac;
}

const failureLines: Record<TalkFailure, (mac: string) => string> = {
  offline: () => talkCopy.offline,
  transcribeFailed: () => talkCopy.transcribeFailed,
  nothingHeard: () => talkCopy.nothingHeard,
  macUnreachable: talkCopy.macUnreachable,
  noAnswer: talkCopy.noAnswer,
  rateLimited: () => talkCopy.rateLimited,
  signedOut: () => talkCopy.signedOut,
};

function stateLine(state: TalkState, mac: string, durationMs: number): string {
  switch (state.kind) {
    case "ready":
    case "tooShort":
      return talkCopy.holdToTalk;
    case "listening":
      return talkCopy.listening(durationMs);
    case "understanding":
      return talkCopy.understanding;
    case "sending":
      return state.slow ? talkCopy.checkMac : talkCopy.sending(mac);
    case "answered":
      return state.message;
    case "failed":
      return failureLines[state.failure](mac);
    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}

export function TalkStatus(props: TalkStatusProps) {
  const { state, block, access, macName, durationMs, onTryAgain } = props;
  if (access === "blocked") {
    return (
      <View className="items-center gap-2">
        <Text className="text-center">{talkCopy.micBlocked}</Text>
        <Button variant="outline" onPress={() => void Linking.openSettings()}>
          <Text>{talkCopy.openSettings}</Text>
        </Button>
      </View>
    );
  }
  const idle = state.kind === "ready" || state.kind === "tooShort";
  const line = block && idle ? blockLine(block, macName) : null;
  const heard = "heard" in state ? state.heard : null;
  const done = state.kind === "answered" && state.status === "done";
  const canRetry =
    state.kind === "failed" && RETRYABLE_FAILURES.includes(state.failure);
  return (
    <View
      className="min-h-24 items-center gap-2"
      accessibilityLiveRegion="polite"
    >
      {heard ? (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          key={heard}
          className="rounded-2xl bg-muted px-4 py-2"
        >
          <Text className="text-center">{talkCopy.heard(heard)}</Text>
        </Animated.View>
      ) : null}
      <Animated.View
        entering={FadeIn}
        key={state.kind}
        className="flex-row items-center gap-1"
      >
        {done ? (
          <Icon
            name="checkmark-circle"
            size={DONE_ICON_SIZE}
            colorClassName="accent-success"
          />
        ) : null}
        <Text
          className={`text-center ${done ? "text-success" : "text-muted-foreground"}`}
        >
          {line ?? stateLine(state, macName, durationMs)}
        </Text>
      </Animated.View>
      {canRetry ? (
        <Button variant="outline" onPress={onTryAgain}>
          <Text>{talkCopy.tryAgain}</Text>
        </Button>
      ) : null}
    </View>
  );
}

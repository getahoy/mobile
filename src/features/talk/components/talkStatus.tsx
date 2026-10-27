import { Linking, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { talkCopy } from "../copy/talkCopy";
import type { MicAccess } from "../recorder/useFileRecorder";
import {
  RETRYABLE_FAILURES,
  type TalkBlock,
  type TalkFailure,
  type TalkState,
} from "../talkState";

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

function failureLine(failure: TalkFailure, mac: string): string {
  switch (failure) {
    case "offline":
      return talkCopy.offline;
    case "transcribeFailed":
      return talkCopy.transcribeFailed;
    case "nothingHeard":
      return talkCopy.nothingHeard;
    case "macUnreachable":
      return talkCopy.macUnreachable(mac);
    case "noAnswer":
      return talkCopy.noAnswer(mac);
    case "rateLimited":
      return talkCopy.rateLimited;
    case "signedOut":
      return talkCopy.signedOut;
    default: {
      const unhandled: never = failure;
      return unhandled;
    }
  }
}

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
      return failureLine(state.failure, mac);
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
  if (block && idle) {
    return (
      <Text className="text-center text-muted-foreground">
        {blockLine(block, macName)}
      </Text>
    );
  }
  const heard = "heard" in state && state.heard ? state.heard : null;
  const done = state.kind === "answered" && state.status === "done";
  const tone = done ? "text-success" : "text-foreground";
  const canRetry =
    state.kind === "failed" && RETRYABLE_FAILURES.includes(state.failure);
  return (
    <View className="items-center gap-2" accessibilityLiveRegion="polite">
      {heard ? (
        <Text className="text-center text-muted-foreground">
          {talkCopy.heard(heard)}
        </Text>
      ) : null}
      <Text className={`text-center ${tone}`}>
        {stateLine(state, macName, durationMs)}
      </Text>
      {canRetry ? (
        <Button variant="outline" onPress={onTryAgain}>
          <Text>{talkCopy.tryAgain}</Text>
        </Button>
      ) : null}
    </View>
  );
}

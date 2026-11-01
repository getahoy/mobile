import { talkCopy } from "./copy/talkCopy.ts";
import type { TalkBlock, TalkState } from "./talkState";

type TalkBarView = {
  label: string;
  labelStyle: "text" | "timer";
  reason: string | null;
  disabled: boolean;
};

type TalkBarInput = {
  state: TalkState;
  block: TalkBlock | null;
  mac: string;
  durationMs: number;
};

function blockReason(block: TalkBlock, mac: string): string {
  if (block === "locked") return talkCopy.locked(mac);
  if (block === "paused") return talkCopy.paused(mac);
  return talkCopy.noMac;
}

function labelOf(state: TalkState, mac: string, durationMs: number): string {
  switch (state.kind) {
    case "listening":
      return talkCopy.listening(durationMs);
    case "understanding":
      return talkCopy.understanding;
    case "sending":
      return state.slow ? talkCopy.checkMac : talkCopy.sending(mac);
    case "ready":
    case "tooShort":
    case "answered":
    case "failed":
      return talkCopy.holdToTalk;
    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}

export function talkBarView(input: TalkBarInput): TalkBarView {
  const { state, block, mac, durationMs } = input;
  const reason = block ? blockReason(block, mac) : null;
  return {
    label: labelOf(state, mac, durationMs),
    labelStyle: state.kind === "listening" ? "timer" : "text",
    reason,
    disabled: reason !== null,
  };
}

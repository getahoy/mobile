import type { OrbMotion } from "@/components/ui/orb";
import { talkCopy } from "./copy/talkCopy.ts";
import type { MicAccess } from "./recorder/useFileRecorder";
import type { TalkBlock, TalkState } from "./talkState";

type TalkBarView = {
  label: string;
  labelStyle: "text" | "timer";
  reason: string | null;
  disabled: boolean;
  orb: OrbMotion | null;
};

type TalkBarInput = {
  state: TalkState;
  block: TalkBlock | null;
  access: MicAccess;
  mac: string;
  durationMs: number;
};

function blockReason(block: TalkBlock, mac: string): string {
  if (block === "locked") return talkCopy.locked(mac);
  if (block === "paused") return talkCopy.paused(mac);
  return talkCopy.noMac;
}

function reasonOf(input: TalkBarInput): string | null {
  if (input.access === "blocked") return talkCopy.micBlocked;
  return input.block ? blockReason(input.block, input.mac) : null;
}

export function talkBarView(input: TalkBarInput): TalkBarView {
  const { state, mac, durationMs } = input;
  const reason = reasonOf(input);
  const base = {
    reason,
    disabled: reason !== null,
    labelStyle: "text",
  } as const;
  switch (state.kind) {
    case "listening":
      return {
        ...base,
        label: talkCopy.listening(durationMs),
        labelStyle: "timer",
        orb: "level",
      };
    case "understanding":
      return { ...base, label: talkCopy.understanding, orb: "breathe" };
    case "sending": {
      const label = state.slow ? talkCopy.checkMac : talkCopy.sending(mac);
      return { ...base, label, orb: "breathe" };
    }
    case "ready":
    case "tooShort":
    case "answered":
    case "failed":
      return { ...base, label: talkCopy.holdToTalk, orb: null };
    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}

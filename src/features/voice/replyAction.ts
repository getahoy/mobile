import type { CommandStatus, SpeakTarget } from "@getahoy/protocol";
import type { SpeakPolicy } from "./storage/voiceSettings";

export const STALE_REPLY_MS = 10_000;

export type ReplyAction = "speak" | "announce" | "chime" | "quiet";

export type ReplyFacts = {
  status: CommandStatus;
  asks: boolean;
  playsOn: SpeakTarget;
  policy: SpeakPolicy;
  current: boolean;
  ageMs: number;
  recording: boolean;
  screenReader: boolean;
};

// Speech is a bonus: anything doubtful stays quiet, the text is on screen either way.
export function replyAction(facts: ReplyFacts): ReplyAction {
  const { status, asks, playsOn, policy } = facts;
  if (!facts.current || facts.ageMs > STALE_REPLY_MS || facts.recording) {
    return "quiet";
  }
  if (policy === "off" || (playsOn !== "phone" && playsOn !== "both")) {
    return "quiet";
  }
  if (facts.screenReader) return "announce";
  const problem = asks || status !== "done";
  if (policy === "everything" || problem) return "speak";
  return "chime";
}

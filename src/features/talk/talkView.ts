import { talkCopy } from "./copy/talkCopy.ts";
import {
  RETRYABLE_FAILURES,
  type TalkFailure,
  type TalkState,
} from "./talkState.ts";
import type { Thread, ThreadStatus } from "./threads/threadStore.ts";

export type ReplyTone = "done" | "asking" | "quiet" | "failed";

export type Reply = {
  label: string;
  tone: ReplyTone;
  message: string;
  followUp: string | null;
  retry: boolean;
};

export type TalkView = { heard: string | null; reply: Reply | null };

const toneOf: Record<ThreadStatus, ReplyTone> = {
  done: "done",
  open: "asking",
  needsChoice: "asking",
  refused: "quiet",
  failed: "failed",
  expired: "quiet",
  replaced: "quiet",
};

const failureLines: Record<TalkFailure, (mac: string) => string> = {
  offline: () => talkCopy.offline,
  transcribeFailed: () => talkCopy.transcribeFailed,
  nothingHeard: () => talkCopy.nothingHeard,
  macUnreachable: talkCopy.macUnreachable,
  noAnswer: talkCopy.noAnswer,
  rateLimited: () => talkCopy.rateLimited,
  signedOut: () => talkCopy.signedOut,
};

const FOLLOW_UP_LINES = 4;

function threadReply(thread: Thread): Reply | null {
  const { lines, status } = thread;
  const last = lines[lines.length - 1];
  if (last?.speaker !== "ahoy") return null;
  const asked = lines[lines.length - 3];
  const answer = lines[lines.length - 2];
  const followUp =
    lines.length >= FOLLOW_UP_LINES && asked && answer
      ? talkCopy.followUp(asked.text, answer.text)
      : null;
  const label =
    status === "done"
      ? talkCopy.doneIn(thread.durationMs)
      : talkCopy.statusLabel(status);
  return {
    label,
    tone: toneOf[status],
    message: last.text,
    followUp,
    retry: false,
  };
}

export function talkView(
  state: TalkState,
  thread: Thread | null,
  mac: string,
): TalkView {
  const threadHeard = thread?.lines[0]?.text ?? null;
  if (state.kind === "failed") {
    const reply: Reply = {
      label: talkCopy.statusLabel("failed"),
      tone: "failed",
      message: failureLines[state.failure](mac),
      followUp: null,
      retry: RETRYABLE_FAILURES.includes(state.failure),
    };
    return { heard: state.heard ?? threadHeard, reply };
  }
  if (state.kind === "sending") return { heard: state.heard, reply: null };
  return { heard: threadHeard, reply: thread ? threadReply(thread) : null };
}

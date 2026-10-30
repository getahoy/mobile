import {
  CHOICE_TTL_MS,
  type CommandChoice,
  type CommandStatus,
} from "@getahoy/protocol";

export type TalkFailure =
  | "offline"
  | "transcribeFailed"
  | "nothingHeard"
  | "macUnreachable"
  | "noAnswer"
  | "rateLimited"
  | "signedOut";

export type TalkState =
  | { kind: "ready" }
  | { kind: "tooShort" }
  | { kind: "listening" }
  | { kind: "understanding" }
  | { kind: "sending"; heard: string; slow: boolean }
  | {
      kind: "answered";
      commandId: string;
      threadId: string;
      heard: string;
      status: CommandStatus;
      message: string;
      speech: string | null;
      choices: readonly CommandChoice[];
      confirm: boolean;
      sentAt: number;
      receivedAt: number;
    }
  | { kind: "failed"; failure: TalkFailure; heard: string | null };

export type TalkBlock = "noMac" | "locked" | "paused";

export const RETRYABLE_FAILURES: readonly TalkFailure[] = [
  "offline",
  "transcribeFailed",
  "macUnreachable",
  "noAnswer",
];

export const MIN_HOLD_MS = 500;
export const MAX_RECORDING_MS = 30_000;
const RESULT_SHOWN_MS = 4000;

// Choices stay up exactly as long as the Mac keeps its numbered overlay.
export function shownFor(state: TalkState): number | null {
  if (state.kind === "answered") {
    return state.choices.length > 0 ? CHOICE_TTL_MS : RESULT_SHOWN_MS;
  }
  if (state.kind !== "failed") return null;
  return RETRYABLE_FAILURES.includes(state.failure) ? null : RESULT_SHOWN_MS;
}

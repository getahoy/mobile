import type { CommandStatus } from "@getahoy/protocol";

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
  | { kind: "answered"; heard: string; status: CommandStatus; message: string }
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

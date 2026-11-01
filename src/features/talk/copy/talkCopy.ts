import type { ThreadStatus } from "../threads/threadStore";

const threadStatusLabels: Record<ThreadStatus, string> = {
  open: "Needs your choice",
  done: "Done",
  needsChoice: "Needs your choice",
  refused: "Can’t do that",
  failed: "Failed",
  expired: "Expired",
  replaced: "Replaced",
};

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const SECOND_DIGITS = 2;

function clock(durationMs: number): string {
  const seconds = Math.floor(durationMs / MS_PER_SECOND);
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const rest = seconds % SECONDS_PER_MINUTE;
  return `${minutes}:${String(rest).padStart(SECOND_DIGITS, "0")}`;
}

export const talkCopy = {
  holdToTalk: "Hold to talk",
  listening: (durationMs: number) => `Listening ${clock(durationMs)}`,
  understanding: "Understanding…",
  heard: (text: string) => `“${text}”`,
  sending: (mac: string) => `Sending to ${mac}…`,
  offline: "Speech needs the internet.",
  transcribeFailed: "Speech didn’t work this time.",
  nothingHeard: "Didn’t catch that.",
  macUnreachable: (mac: string) => `Can’t reach ${mac}.`,
  noAnswer: (mac: string) => `No answer from ${mac}.`,
  checkMac: "Check your Mac.",
  rateLimited: "Too many tries, wait a moment.",
  signedOut: "Sign in again.",
  tryAgain: "Try again",
  noMac: "Connect to your Mac to talk.",
  locked: (mac: string) => `${mac} is locked. Unlock it to use Ahoy.`,
  paused: (mac: string) => `${mac} is paused. Tap Connect to talk.`,
  buttonLabel: (mac: string) => `Hold to talk to ${mac}`,
  buttonHint: "Hold, say a command, then let go to send it.",
  cancel: "Cancel",
  choiceTitle: "Which one?",
  expiredTitle: "That screen changed. Ask again.",
  noneOfThese: "None of these",
  holdToAnswer: "Hold to answer",
  examples: ["open YouTube", "email Jake", "make a new note"],
  close: "Close",
  choiceLabel: (number: number, label: string) => `Pick ${number}, ${label}`,
  statusLabel: (status: ThreadStatus) => threadStatusLabels[status],
  doneIn: (durationMs: number) =>
    `${threadStatusLabels.done} · ${(durationMs / MS_PER_SECOND).toFixed(1)}s`,
  followUp: (asked: string, answer: string) => `${asked} · ${answer}`,
};

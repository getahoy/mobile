import {
  type CommandChoice,
  type CommandStatus,
  type FailureReason,
  type HistoryFollowUp,
  type HistoryStatus,
  type HistoryWriteEntry,
  MAX_FOLLOW_UPS,
} from "@getahoy/protocol";
import type { ResultDetails, TalkFailure } from "../talk/talkState.ts";

export type HistoryMac = { key: string; name: string };

type Start = {
  id: string;
  mac: HistoryMac;
  heard: string;
  startedAt: number;
  hearingMs: number | null;
  understandingMs: number | null;
};

type MacAnswer = {
  heard: string;
  status: CommandStatus;
  message: string;
  choices: readonly CommandChoice[];
  details: ResultDetails;
  waitedMs: number | null;
  at: number;
};

const DIGITS = /^\d+$/;

const iso = (at: number) => new Date(at).toISOString();

function measured(timings: Record<string, number | null>) {
  return Object.fromEntries(
    Object.entries(timings).filter(([, ms]) => ms !== null),
  );
}

export function startRecord(start: Start): HistoryWriteEntry {
  const { hearingMs, understandingMs } = start;
  return {
    id: start.id,
    rev: 1,
    macKey: start.mac.key,
    macName: start.mac.name,
    heard: start.heard,
    did: null,
    status: "running",
    app: null,
    via: null,
    reason: null,
    timings: measured({ hearingMs, understandingMs }),
    followUps: [],
    startedAt: iso(start.startedAt),
    finishedAt: null,
  };
}

function historyStatusOf(
  status: CommandStatus,
  followedUp: boolean,
): HistoryStatus {
  switch (status) {
    case "done":
      return followedUp ? "choice" : "done";
    case "needsChoice":
      return "running";
    case "refused":
      return "blocked";
    case "failed":
      return "failed";
    default: {
      const unhandled: never = status;
      return unhandled;
    }
  }
}

function answered(followUp: HistoryFollowUp, answer: MacAnswer) {
  const number = DIGITS.test(answer.heard) ? Number(answer.heard) : null;
  const known = followUp.options.some((option) => option.number === number);
  const chosen = known ? number : null;
  return { ...followUp, chosen, said: answer.heard, waitedMs: answer.waitedMs };
}

function followUpsAfter(entry: HistoryWriteEntry, answer: MacAnswer) {
  const last = entry.followUps.at(-1);
  const open = last && last.said === null ? last : null;
  const kept = open
    ? [...entry.followUps.slice(0, -1), answered(open, answer)]
    : entry.followUps;
  if (answer.status !== "needsChoice") return kept;
  const asked = {
    question: answer.message,
    options: [...answer.choices],
    chosen: null,
    said: null,
    waitedMs: null,
  };
  return [...kept, asked].slice(0, MAX_FOLLOW_UPS);
}

function sum(total: number | undefined, more: number | null | undefined) {
  if (more === null || more === undefined) return total;
  return (total ?? 0) + more;
}

export function applyAnswer(
  entry: HistoryWriteEntry,
  answer: MacAnswer,
): HistoryWriteEntry {
  const followUps = followUpsAfter(entry, answer);
  const status = historyStatusOf(answer.status, followUps.length > 0);
  const { details } = answer;
  const ended = status === "failed" || status === "blocked";
  const onMacMs = sum(entry.timings.onMacMs, details.onMacMs) ?? null;
  const waitedMs = sum(entry.timings.waitedMs, answer.waitedMs) ?? null;
  return {
    ...entry,
    rev: entry.rev + 1,
    did: answer.message,
    status,
    app: details.app ?? entry.app,
    via: details.via ?? entry.via,
    reason: ended ? (details.reason ?? "other") : null,
    timings: { ...entry.timings, ...measured({ onMacMs, waitedMs }) },
    followUps,
    finishedAt: status === "running" ? null : iso(answer.at),
  };
}

const failureReasons: Record<TalkFailure, FailureReason> = {
  offline: "offline",
  transcribeFailed: "transcribeFailed",
  nothingHeard: "nothingHeard",
  macUnreachable: "macUnreachable",
  noAnswer: "noAnswer",
  rateLimited: "other",
  signedOut: "other",
};

export function failRecord(
  entry: HistoryWriteEntry,
  failure: TalkFailure,
  at: number,
): HistoryWriteEntry {
  const reason = failureReasons[failure];
  const finishedAt = iso(at);
  return { ...entry, rev: entry.rev + 1, status: "failed", reason, finishedAt };
}

export function cancelRecord(
  entry: HistoryWriteEntry,
  at: number,
): HistoryWriteEntry {
  const finishedAt = iso(at);
  return { ...entry, rev: entry.rev + 1, status: "cancelled", finishedAt };
}

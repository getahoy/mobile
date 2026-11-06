import type { HistoryWriteEntry } from "@getahoy/protocol";
import type { TalkState } from "../talk/talkState.ts";
import { entryOf, type Outbox } from "./historyOutbox.ts";
import {
  applyAnswer,
  cancelRecord,
  failRecord,
  type HistoryMac,
  startRecord,
} from "./historyRecords.ts";

type Sent = { commandId: string; heard: string; startedAt: number };

export type TalkTracking = {
  startedAt: number | null;
  understandingAt: number | null;
  hearingMs: number | null;
  understandingMs: number | null;
  sent: Sent | null;
  open: { id: string; askedAt: number } | null;
  lastAnswered: string | null;
};

export const freshTracking: TalkTracking = {
  startedAt: null,
  understandingAt: null,
  hearingMs: null,
  understandingMs: null,
  sent: null,
  open: null,
  lastAnswered: null,
};

export type TalkStep = {
  tracking: TalkTracking;
  before: TalkState;
  state: TalkState;
  now: number;
  mac: HistoryMac;
  outbox: Outbox;
};

type Tracked = { tracking: TalkTracking; writes: HistoryWriteEntry[] };

type Answered = Extract<TalkState, { kind: "answered" }>;
type Failed = Extract<TalkState, { kind: "failed" }>;

const only = (tracking: TalkTracking): Tracked => ({ tracking, writes: [] });

const since = (from: number | null, now: number) =>
  from === null ? null : now - from;

function running(outbox: Outbox, id: string | undefined) {
  const entry = id === undefined ? null : entryOf(outbox, id);
  return entry?.status === "running" ? entry : null;
}

function onSending(step: TalkStep, commandId: string, heard: string) {
  const { tracking, now, mac } = step;
  if (tracking.sent?.commandId === commandId) return only(tracking);
  const { hearingMs } = tracking;
  const understandingMs = since(tracking.understandingAt, now);
  const startedAt = tracking.startedAt ?? now;
  const sent = { commandId, heard, startedAt };
  const next = { ...tracking, sent, understandingMs, understandingAt: null };
  if (tracking.open) return only(next);
  const start = { mac, heard, startedAt, hearingMs, understandingMs };
  return { tracking: next, writes: [startRecord({ id: commandId, ...start })] };
}

function baseFor({ tracking, outbox, mac }: TalkStep, state: Answered) {
  const stored = entryOf(outbox, state.threadId);
  if (stored || state.threadId !== state.commandId) return stored;
  const { sent, hearingMs, understandingMs } = tracking;
  const own = sent?.commandId === state.commandId ? sent : null;
  const startedAt = own?.startedAt ?? state.sentAt;
  const { commandId: id, heard } = state;
  return startRecord({ id, mac, heard, startedAt, hearingMs, understandingMs });
}

function onAnswered(step: TalkStep, state: Answered): Tracked {
  const { tracking, outbox, now } = step;
  if (tracking.lastAnswered === state.commandId) return only(tracking);
  const { open } = tracking;
  const sameThread = open?.id === state.threadId;
  const replaced = sameThread ? null : running(outbox, open?.id);
  const writes = replaced ? [cancelRecord(replaced, now)] : [];
  const base = baseFor(step, state);
  const followUp = state.threadId !== state.commandId && open !== null;
  const waitedMs = followUp ? state.sentAt - open.askedAt : null;
  const asks = state.choices.length > 0;
  const asked = { id: state.threadId, askedAt: state.receivedAt };
  const next = {
    ...tracking,
    lastAnswered: state.commandId,
    open: asks ? asked : null,
  };
  if (!base) return { tracking: next, writes };
  const { heard, status, message, choices } = state;
  const details = state.details ?? {};
  const at = state.receivedAt;
  const answer = { heard, status, message, choices, details, waitedMs, at };
  return { tracking: next, writes: [...writes, applyAnswer(base, answer)] };
}

function onFailed({ tracking, outbox, now }: TalkStep, state: Failed) {
  const own = running(outbox, state.commandId);
  const target = own ?? running(outbox, tracking.open?.id);
  const next = { ...tracking, open: own ? tracking.open : null };
  if (!target) return only(next);
  return { tracking: next, writes: [failRecord(target, state.failure, now)] };
}

function onReady({ tracking, before, outbox, now }: TalkStep): Tracked {
  const asked = before.kind === "answered" && before.choices.length > 0;
  if (!asked || !tracking.open) return only(tracking);
  const open = running(outbox, tracking.open.id);
  const next = { ...tracking, open: null };
  return { tracking: next, writes: open ? [cancelRecord(open, now)] : [] };
}

function onUnderstanding({ tracking, now }: TalkStep): Tracked {
  const hearingMs = tracking.hearingMs ?? since(tracking.startedAt, now);
  return only({ ...tracking, hearingMs, understandingAt: now });
}

export function trackTalk(step: TalkStep): Tracked {
  const { tracking, state, now } = step;
  switch (state.kind) {
    case "listening":
      return only({ ...tracking, startedAt: now, hearingMs: null });
    case "understanding":
      return onUnderstanding(step);
    case "sending":
      if (state.commandId === undefined) return only(tracking);
      return onSending(step, state.commandId, state.heard);
    case "answered":
      return onAnswered(step, state);
    case "failed":
      return onFailed(step, state);
    case "ready":
      return onReady(step);
    case "tooShort":
      return only(tracking);
    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}

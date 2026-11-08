import { type HistoryWriteEntry, MAX_HISTORY_WRITES } from "@getahoy/protocol";
import { cancelRecord } from "./historyRecords.ts";

export type OutboxItem = {
  entry: HistoryWriteEntry;
  sentRev: number;
  rejectedRev: number;
  sentAt: number;
};

export type Outbox = Readonly<Record<string, OutboxItem>>;

type SentRevision = { id: string; rev: number };

// Settled entries stay a while: a retried command reuses its id and must write a newer revision.
const KEPT_SETTLED = 50;

const isPending = ({ entry, sentRev }: OutboxItem) => entry.rev > sentRev;

// A refused revision waits as not synced; a newer revision of the entry is tried again.
const isSendable = (item: OutboxItem) =>
  isPending(item) && item.entry.rev > item.rejectedRev;

const byStart = (first: OutboxItem, second: OutboxItem) =>
  first.entry.startedAt.localeCompare(second.entry.startedAt);

function pruned(items: Record<string, OutboxItem>): Outbox {
  const settled = Object.values(items)
    .filter((item) => !isPending(item) && item.entry.status !== "running")
    .sort(byStart);
  const dropped = settled.slice(0, Math.max(0, settled.length - KEPT_SETTLED));
  for (const { entry } of dropped) delete items[entry.id];
  return items;
}

export function putEntry(outbox: Outbox, entry: HistoryWriteEntry): Outbox {
  const { sentRev = 0, rejectedRev = 0, sentAt = 0 } = outbox[entry.id] ?? {};
  return { ...outbox, [entry.id]: { entry, sentRev, rejectedRev, sentAt } };
}

export function markRejected(
  outbox: Outbox,
  refused: readonly SentRevision[],
): Outbox {
  const next: Record<string, OutboxItem> = { ...outbox };
  for (const { id, rev } of refused) {
    const item = next[id];
    const rejectedRev = Math.max(item?.rejectedRev ?? 0, rev);
    if (item) next[id] = { ...item, rejectedRev };
  }
  return next;
}

export function entryOf(outbox: Outbox, id: string) {
  return outbox[id]?.entry ?? null;
}

export function pendingBatch(outbox: Outbox): HistoryWriteEntry[] {
  return Object.values(outbox)
    .filter(isSendable)
    .sort(byStart)
    .map(({ entry }) => entry)
    .slice(0, MAX_HISTORY_WRITES);
}

export function markSent(
  outbox: Outbox,
  sent: readonly SentRevision[],
  at: number,
): Outbox {
  const next: Record<string, OutboxItem> = { ...outbox };
  for (const { id, rev } of sent) {
    const item = next[id];
    const sentRev = Math.max(item?.sentRev ?? 0, rev);
    if (item) next[id] = { ...item, sentRev, sentAt: at };
  }
  return pruned(next);
}

export function lastSentAt(outbox: Outbox): number {
  return Math.max(0, ...Object.values(outbox).map(({ sentAt }) => sentAt));
}

export function cancelRunning(outbox: Outbox, at: number): Outbox {
  const next: Record<string, OutboxItem> = { ...outbox };
  for (const [id, item] of Object.entries(outbox)) {
    if (item.entry.status !== "running") continue;
    next[id] = { ...item, entry: cancelRecord(item.entry, at) };
  }
  return next;
}

export function unsyncedIds(outbox: Outbox): ReadonlySet<string> {
  const pending = Object.values(outbox).filter(isPending);
  return new Set(pending.map(({ entry }) => entry.id));
}

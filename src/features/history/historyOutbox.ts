import { type HistoryWriteEntry, MAX_HISTORY_WRITES } from "@getahoy/protocol";
import { cancelRecord } from "./historyRecords.ts";

export type OutboxItem = { entry: HistoryWriteEntry; sentRev: number };

export type Outbox = Readonly<Record<string, OutboxItem>>;

export type SentRevision = { id: string; rev: number };

// Settled entries stay a while: a retried command reuses its id and must write a newer revision.
const KEPT_SETTLED = 50;

const isPending = ({ entry, sentRev }: OutboxItem) => entry.rev > sentRev;

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
  const sentRev = outbox[entry.id]?.sentRev ?? 0;
  return { ...outbox, [entry.id]: { entry, sentRev } };
}

export function entryOf(outbox: Outbox, id: string) {
  return outbox[id]?.entry ?? null;
}

export function pendingBatch(outbox: Outbox): HistoryWriteEntry[] {
  return Object.values(outbox)
    .filter(isPending)
    .sort(byStart)
    .map(({ entry }) => entry)
    .slice(0, MAX_HISTORY_WRITES);
}

export function markSent(
  outbox: Outbox,
  sent: readonly SentRevision[],
): Outbox {
  const next: Record<string, OutboxItem> = { ...outbox };
  for (const { id, rev } of sent) {
    const item = next[id];
    if (item) next[id] = { ...item, sentRev: Math.max(item.sentRev, rev) };
  }
  return pruned(next);
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

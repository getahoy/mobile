import { type EntryView, entryMatches } from "@getahoy/lib";
import type { HistoryEntry, HistoryWriteEntry } from "@getahoy/protocol";
import type { Outbox, OutboxItem } from "./historyOutbox.ts";

export type HistoryView = Required<EntryView>;

function toEntry({ rev: _, ...entry }: HistoryWriteEntry): HistoryEntry {
  return entry;
}

// The server only has what was sent; entries still waiting show from the outbox, newest first.
// A sent entry keeps showing until the server list comes from a request made after the send.
export function withLocalEntries(
  server: readonly HistoryEntry[],
  outbox: Outbox,
  view: HistoryView,
  serverAt: number,
): HistoryEntry[] {
  const justSent = (sentAt: number) => serverAt > 0 && sentAt >= serverAt;
  const waiting = ({ entry, sentRev, sentAt }: OutboxItem) =>
    entry.rev > sentRev || entry.status === "running" || justSent(sentAt);
  const local = Object.values(outbox)
    .filter(waiting)
    .map(({ entry }) => toEntry(entry))
    .filter((entry) => entryMatches(entry, view));
  const localIds = new Set(local.map((entry) => entry.id));
  const kept = server.filter((entry) => !localIds.has(entry.id));
  return [...local, ...kept].sort((first, second) =>
    second.startedAt.localeCompare(first.startedAt),
  );
}

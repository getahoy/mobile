import type {
  HistoryEntry,
  HistoryFilter,
  HistoryStatus,
  HistoryWriteEntry,
} from "@getahoy/protocol";
import type { Outbox, OutboxItem } from "./historyOutbox.ts";

export type HistoryView = {
  filter: HistoryFilter;
  search: string;
  macKey: string | null;
};

const shownBy: Record<HistoryFilter, readonly HistoryStatus[] | null> = {
  all: null,
  done: ["done", "choice"],
  failed: ["failed", "blocked"],
};

function toEntry({ rev: _, ...entry }: HistoryWriteEntry): HistoryEntry {
  return entry;
}

function matches(entry: HistoryEntry, view: HistoryView): boolean {
  const statuses = shownBy[view.filter];
  if (statuses && !statuses.includes(entry.status)) return false;
  if (view.macKey && entry.macKey !== view.macKey) return false;
  const search = view.search.trim().toLowerCase();
  if (!search) return true;
  const text = [entry.heard, entry.did ?? "", entry.app ?? ""]
    .join(" ")
    .toLowerCase();
  return text.includes(search);
}

// The server only has what was sent; entries still waiting show from the outbox, newest first.
// A sent entry keeps showing until the server list comes from a request made after the send.
export function withLocalEntries(
  server: readonly HistoryEntry[],
  outbox: Outbox,
  view: HistoryView,
  serverAt: number,
): HistoryEntry[] {
  const justSent = (sentAt: number) => sentAt > 0 && sentAt >= serverAt;
  const waiting = ({ entry, sentRev, sentAt }: OutboxItem) =>
    entry.rev > sentRev || entry.status === "running" || justSent(sentAt);
  const local = Object.values(outbox)
    .filter(waiting)
    .map(({ entry }) => toEntry(entry))
    .filter((entry) => matches(entry, view));
  const localIds = new Set(local.map((entry) => entry.id));
  const kept = server.filter((entry) => !localIds.has(entry.id));
  return [...local, ...kept].sort((first, second) =>
    second.startedAt.localeCompare(first.startedAt),
  );
}

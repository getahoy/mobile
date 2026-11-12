import type { HistoryEntry } from "@getahoy/protocol";
import { historyCopy } from "./copy/historyCopy.ts";

type NoticeInput = { offline: boolean; waiting: number; stale: boolean };

export function listNotice({ offline, waiting, stale }: NoticeInput) {
  if (offline) return historyCopy.offline(waiting);
  return stale ? historyCopy.couldNotRefresh : null;
}

type MetaInput = {
  entry: HistoryEntry;
  unsynced: ReadonlySet<string>;
  showMac: boolean;
};

export function entryMeta({ entry, unsynced, showMac }: MetaInput) {
  const waiting = unsynced.has(entry.id) && entry.status !== "running";
  const parts = [
    showMac ? entry.macName : null,
    waiting ? historyCopy.notSynced : null,
  ].filter((part) => part !== null);
  return parts.length > 0 ? parts.join(" · ") : null;
}

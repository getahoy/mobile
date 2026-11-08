import type { HistoryEntry, HistoryPage } from "@getahoy/protocol";
import type { InfiniteData } from "@tanstack/react-query";

export type HistoryPages = InfiniteData<HistoryPage, string | null>;

type SavedCopy = { entries: HistoryEntry[]; summary: HistoryPage["summary"] };

export function keepEntries(
  pages: HistoryPages,
  keep: (entry: HistoryEntry) => boolean,
): HistoryPages {
  const kept = pages.pages.map((page) => ({
    ...page,
    entries: page.entries.filter(keep),
  }));
  return { ...pages, pages: kept };
}

export function savedPages({
  entries,
  summary,
}: SavedCopy): HistoryPages | undefined {
  if (entries.length === 0) return undefined;
  return { pages: [{ entries, summary, cursor: null }], pageParams: [null] };
}

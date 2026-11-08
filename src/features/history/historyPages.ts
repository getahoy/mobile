import type { HistoryEntry, HistoryPage } from "@getahoy/protocol";
import type { InfiniteData } from "@tanstack/react-query";

export type ListedPage = HistoryPage & { fetchedAt: number };

export type HistoryPages = InfiniteData<ListedPage, string | null>;

type SavedCopy = Pick<ListedPage, "entries" | "summary" | "fetchedAt">;

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

export function savedPages(saved: SavedCopy): HistoryPages | undefined {
  if (saved.entries.length === 0) return undefined;
  const page = { ...saved, cursor: null };
  return { pages: [page], pageParams: [null] };
}

import { HISTORY_STALE_MS, historyKey, queryOf } from "@getahoy/lib";
import { useInfiniteQuery } from "@tanstack/react-query";
import { historyApi } from "../client/historyApi";
import { type ListedPage, savedPages } from "../historyPages";
import { isDefaultView } from "../historyQuery";
import type { HistoryView } from "../localEntries";
import { readHistoryCache, writeHistoryCache } from "../storage/historyStore";

const FIRST_PAGE: string | null = null;
const SAVED_COPY_AGE = 0;

// The query library learns of a failure only from a throw.
export class HistoryRequestError extends Error {}

async function loadPage(
  view: HistoryView,
  cursor: string | null,
): Promise<ListedPage> {
  const fetchedAt = Date.now();
  const page = await historyApi.list(queryOf(view, cursor));
  if (page.code === "error") throw new HistoryRequestError(page.error.kind);
  const listed = { ...page.data, fetchedAt };
  if (!cursor && isDefaultView(view)) writeHistoryCache(listed);
  return listed;
}

// The saved copy shows at once after a restart and is refetched straight away.
export function useHistoryQuery(view: HistoryView) {
  return useInfiniteQuery({
    queryKey: historyKey(view),
    queryFn: ({ pageParam }) => loadPage(view, pageParam),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (last) => last.cursor,
    staleTime: HISTORY_STALE_MS,
    initialData: () =>
      isDefaultView(view) ? savedPages(readHistoryCache()) : undefined,
    initialDataUpdatedAt: SAVED_COPY_AGE,
  });
}

import { HISTORY_SEARCH_DELAY_MS } from "@getahoy/lib";
import { useMemo } from "react";
import { useDebounce } from "react-haiku";
import type { ListPhase } from "../historyQuery";
import type { HistoryView } from "../localEntries";
import { useHistoryQuery } from "./useHistoryQuery";

function phaseOf(shown: boolean, failed: boolean): ListPhase {
  if (shown) return "ready";
  return failed ? "failed" : "loading";
}

// Each view has its own cached pages, so a view never shows another view's entries.
export function useHistoryList(view: HistoryView) {
  const search = useDebounce(view.search, HISTORY_SEARCH_DELAY_MS);
  const { filter, macKey } = view;
  const settled = useMemo(
    () => ({ filter, macKey, search }),
    [filter, macKey, search],
  );
  const query = useHistoryQuery(settled);
  const overall = useHistoryQuery({ filter: "all", search: "", macKey });
  const { data, isError, hasNextPage, isFetchingNextPage } = query;
  const entries = useMemo(
    () => data?.pages.flatMap((page) => page.entries) ?? [],
    [data],
  );
  const loadMore = async () => {
    if (hasNextPage && !isFetchingNextPage) await query.fetchNextPage();
  };
  return {
    settled,
    entries,
    phase: phaseOf(data !== undefined, isError),
    stale: isError && data !== undefined,
    errorAt: query.errorUpdatedAt,
    serverAt: data?.pages[0]?.fetchedAt ?? 0,
    summary: overall.data?.pages[0]?.summary ?? null,
    summaryPending: !overall.data && overall.fetchStatus === "fetching",
    loadingMore: isFetchingNextPage,
    loadMore,
    reload: () => query.refetch(),
  };
}

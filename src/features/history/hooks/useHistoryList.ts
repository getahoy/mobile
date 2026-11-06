import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "react-haiku";
import { fetchHistoryPage } from "../client/historyApi";
import {
  failedState,
  isDefaultView,
  type ListPhase,
  type ListState,
  loadedState,
  queryOf,
  viewKeyOf,
} from "../historyQuery";
import type { HistoryView } from "../localEntries";
import { readHistoryCache, writeHistoryCache } from "../storage/historyStore";
import { useHistoryMore } from "./useHistoryMore";

const SEARCH_DELAY_MS = 300;

function initialState(view: HistoryView): ListState {
  const cache = isDefaultView(view) ? readHistoryCache() : null;
  const cached = cache !== null && cache.entries.length > 0;
  const phase: ListPhase = cached ? "ready" : "loading";
  const page = cache ?? { entries: [], summary: null };
  const viewKey = viewKeyOf(view);
  const idle = { stale: false, loadingMore: false };
  return { ...page, ...idle, cursor: null, viewKey, phase };
}

export function useHistoryList(view: HistoryView) {
  const search = useDebounce(view.search, SEARCH_DELAY_MS);
  const { filter, macKey } = view;
  const settled = useMemo(
    () => ({ filter, macKey, search }),
    [filter, macKey, search],
  );
  const [state, setState] = useState(() => initialState(settled));
  const latest = useRef(0);

  const reload = useCallback(async () => {
    const request = ++latest.current;
    const viewKey = viewKeyOf(settled);
    const page = await fetchHistoryPage(queryOf(settled, null));
    if (request !== latest.current) return;
    if (page.code === "error") {
      setState((shown) => failedState(shown, viewKey));
      return;
    }
    if (isDefaultView(settled)) writeHistoryCache(page.data);
    setState(loadedState(page.data, viewKey));
  }, [settled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const loadMore = useHistoryMore({ state, setState, settled, latest });
  return { ...state, settled, reload, loadMore };
}

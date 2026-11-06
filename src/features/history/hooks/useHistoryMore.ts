import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useCallback,
} from "react";
import { fetchHistoryPage } from "../client/historyApi";
import { appendedState, type ListState, queryOf } from "../historyQuery";
import type { HistoryView } from "../localEntries";

type MoreOptions = {
  state: ListState;
  setState: Dispatch<SetStateAction<ListState>>;
  settled: HistoryView;
  latest: RefObject<number>;
};

export function useHistoryMore(options: MoreOptions) {
  const { state, setState, settled, latest } = options;
  const { cursor, loadingMore } = state;
  return useCallback(async () => {
    if (!cursor || loadingMore) return;
    const request = latest.current;
    setState((shown) => ({ ...shown, loadingMore: true }));
    const page = await fetchHistoryPage(queryOf(settled, cursor));
    if (request !== latest.current) return;
    setState((shown) =>
      page.code === "error"
        ? { ...shown, loadingMore: false }
        : appendedState(shown, page.data),
    );
  }, [cursor, loadingMore, settled, setState, latest]);
}

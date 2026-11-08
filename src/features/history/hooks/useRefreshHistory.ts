import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { historyCopy } from "../copy/historyCopy";
import type { ListPhase } from "../historyQuery";
import type { HistoryView } from "../localEntries";
import { flushHistory } from "../sync/flushHistory";
import { HISTORY_KEY, historyKey } from "./useHistoryQuery";
import type { Toast } from "./useToast";

type RefreshOptions = {
  view: HistoryView;
  phase: ListPhase;
  show: (toast: Toast) => void;
};

export function useRefreshHistory({ view, phase, show }: RefreshOptions) {
  const client = useQueryClient();
  const running = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    if (running.current) return;
    running.current = true;
    setRefreshing(true);
    const showing = phase === "ready";
    await flushHistory();
    await client.invalidateQueries({ queryKey: HISTORY_KEY });
    running.current = false;
    setRefreshing(false);
    const failed = client.getQueryState(historyKey(view))?.status === "error";
    if (failed && showing) {
      show({ text: historyCopy.couldNotRefresh, undo: null });
    }
  };
  return { refreshing, refresh };
}

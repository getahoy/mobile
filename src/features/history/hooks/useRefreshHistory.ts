import { HISTORY_KEY, historyKey, type ListPhase } from "@getahoy/lib";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import { historyCopy } from "../copy/historyCopy";
import type { HistoryView } from "../localEntries";
import { flushHistory } from "../sync/flushHistory";

const NO_FAILURE = -1;

type RefreshOptions = { view: HistoryView; phase: ListPhase };

// A failed manual refresh says so in a toast; failedAt lets the screen skip the stale line for it.
export function useRefreshHistory({ view, phase }: RefreshOptions) {
  const client = useQueryClient();
  const running = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [failedAt, setFailedAt] = useState(NO_FAILURE);
  const refresh = async () => {
    if (running.current) return;
    running.current = true;
    setRefreshing(true);
    const showing = phase === "ready";
    await flushHistory();
    await client.invalidateQueries({ queryKey: HISTORY_KEY });
    running.current = false;
    setRefreshing(false);
    const state = client.getQueryState(historyKey(view));
    if (state?.status !== "error") return;
    setFailedAt(state.errorUpdatedAt);
    if (showing) toast(historyCopy.couldNotRefresh);
  };
  return { refreshing, refresh, failedAt };
}

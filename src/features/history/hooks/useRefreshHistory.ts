import { useRef, useState } from "react";
import { historyCopy } from "../copy/historyCopy";
import type { ListPhase } from "../historyQuery";
import { flushHistory } from "../sync/flushHistory";
import type { Toast } from "./useToast";

type RefreshOptions = {
  phase: ListPhase;
  reload: () => Promise<boolean>;
  show: (toast: Toast) => void;
};

export function useRefreshHistory({ phase, reload, show }: RefreshOptions) {
  const running = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    if (running.current) return;
    running.current = true;
    setRefreshing(true);
    const showing = phase === "ready";
    await flushHistory();
    const loaded = await reload();
    running.current = false;
    setRefreshing(false);
    if (!loaded && showing) {
      show({ text: historyCopy.couldNotRefresh, undo: null });
    }
  };
  return { refreshing, refresh };
}

import type { HistoryFilter } from "@getahoy/protocol";
import { useNetworkState } from "expo-network";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/toast";
import { historyCopy } from "../copy/historyCopy";
import { unsyncedIds } from "../historyOutbox";
import { withLocalEntries } from "../localEntries";
import { useClearHistory } from "./useClearHistory";
import { useEntryDeletion } from "./useEntryDeletion";
import { useHistoryList } from "./useHistoryList";
import { useHistorySettings } from "./useHistorySettings";
import { useOutbox } from "./useOutbox";
import { useRefetchAfterSync } from "./useRefetchAfterSync";
import { useRefreshHistory } from "./useRefreshHistory";

function useHistoryView() {
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [search, setSearch] = useState("");
  const [macKey, setMacKey] = useState<string | null>(null);
  return { filter, search, macKey, setFilter, setSearch, setMacKey };
}

export function useHistoryState() {
  const view = useHistoryView();
  const list = useHistoryList(view);
  const outbox = useOutbox();
  const settings = useHistorySettings();
  const { clear, clearing } = useClearHistory();
  const network = useNetworkState();
  const { deleting, deleteEntry } = useEntryDeletion();
  const { phase, settled, serverAt } = list;
  const refreshing = useRefreshHistory({ view: settled, phase });
  useRefetchAfterSync(outbox, serverAt);
  const [cleared, setCleared] = useState(false);

  const entries = useMemo(() => {
    const merged = withLocalEntries(list.entries, outbox, settled, serverAt);
    return merged.filter((entry) => !deleting.has(entry.id));
  }, [list.entries, settled, outbox, serverAt, deleting]);
  const hasEntries = entries.length > 0;
  useEffect(() => {
    if (hasEntries) setCleared(false);
  }, [hasEntries]);
  const unsynced = useMemo(() => unsyncedIds(outbox), [outbox]);
  const offline =
    network.isConnected === false || network.isInternetReachable === false;

  const clearAll = async () => {
    const done = await clear();
    if (done) setCleared(true);
    else toast(historyCopy.couldNotClear);
  };

  const status = { entries, unsynced, offline, cleared, clearing };
  const actions = { deleteEntry, clearAll, ...refreshing };
  return { ...view, ...status, list, settings, ...actions };
}

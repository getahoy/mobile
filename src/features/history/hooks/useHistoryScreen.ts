import { useState } from "react";
import { usePairedMacs } from "@/features/pairing/hooks/usePairedMacs";
import { historyCopy } from "../copy/historyCopy";
import { blankFor } from "../historyBlankState";
import { listNotice, summaryLine } from "../historyView";
import { useHistory } from "./historyContext";

export type OpenSheet = "picker" | "clear" | null;

export function useHistoryScreen() {
  const history = useHistory();
  const macs = usePairedMacs().macs ?? [];
  const [sheet, setSheet] = useState<OpenSheet>(null);
  const { list, filter, search, macKey, entries, unsynced } = history;
  const picking = macs.length > 1;
  const chosen = macs.find((mac) => mac.publicKey === macKey);
  const plain = filter === "all" && !search.trim();
  const blank = blankFor({
    phase: list.phase,
    cleared: history.cleared,
    count: entries.length,
    filter,
    search,
  });
  return {
    history,
    macs,
    sheet,
    setSheet,
    picking,
    chipLabel: chosen?.displayName || historyCopy.allMacs,
    showMac: picking && macKey === null,
    canClear: plain && entries.length > 0,
    summary: plain ? summaryLine(list.summary) : null,
    notice: listNotice({
      offline: history.offline,
      waiting: unsynced.size,
      stale: list.stale,
    }),
    blank,
  };
}

export type HistoryScreenState = ReturnType<typeof useHistoryScreen>;

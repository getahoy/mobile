import { summaryLine } from "@getahoy/lib";
import { useState } from "react";
import { usePairedMacs } from "@/features/pairing/hooks/usePairedMacs";
import { historyCopy } from "../copy/historyCopy";
import { blankFor } from "../historyBlankState";
import { listNotice } from "../historyView";
import { useHistory } from "./historyContext";
import { useFirstLoad } from "./useFirstLoad";

type OpenSheet = "picker" | "clear" | null;

export function useHistoryScreen() {
  const history = useHistory();
  const macs = usePairedMacs().macs ?? [];
  const [sheet, setSheet] = useState<OpenSheet>(null);
  const { list, filter, search, macKey, entries, unsynced } = history;
  const picking = macs.length > 1;
  const chosen = macs.find((mac) => mac.publicKey === macKey);
  const plain = filter === "all" && !search.trim();
  const count = entries.length;
  const { phase } = list;
  const { cleared } = history;
  const blank = blankFor({ phase, cleared, count, filter, search });
  const firstLoad = useFirstLoad(blank === "loading");
  const noHistory = blank === "empty" || blank === "cleared";
  return {
    firstLoad,
    history,
    macs,
    sheet,
    setSheet,
    picking,
    chipLabel: chosen?.displayName || historyCopy.allMacs,
    showMac: picking && macKey === null,
    canClear: plain && entries.length > 0,
    summary: noHistory ? null : summaryLine(filter, list.summary),
    summaryPending: !noHistory && list.summaryPending,
    notice: listNotice({
      offline: history.offline,
      waiting: unsynced.size,
      stale: list.stale && list.errorAt !== history.failedAt,
    }),
    blank,
  };
}

export type HistoryScreenState = ReturnType<typeof useHistoryScreen>;
